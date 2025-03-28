import { create } from 'superstruct';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articleStructs.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentStruct.js';
import articleService from '../services/articleService.js';
import commentService from '../services/commentService.js';
import likeService from '../services/likeService.js';
import passport from '../config/passport.js';
import AlreadyExstError from '../lib/errors/AlreadyExstError.js';
import { Request, Response } from 'express';
import { User } from '@prisma/client';

export async function createArticle(req: RequestAuthed, res: Response) {
  const data = create(req.body, CreateArticleBodyStruct);
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);

  const article = await articleService.create({
    ...data,
    userId: userId,
  });

  return res.status(201).send(article);
}

export async function getArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const article = await articleService.getById(id);
  if (!article) {
    throw new NotFoundError(articleService.getEntityName(), id);
  }

  passport.authenticate('access-token', { session: false }, async (err: Error, user: User, info) => {

      if (user) {
        const like = await likeService.getByArticle(user.id, id);
        return res.send({ ...article, isLiked: !!like });
      } else {
        return res.send(article);
      }
  })(req, res);
}

export async function updateArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);

  const article = await articleService.update(id, data);
  return res.send(article);
}

export async function deleteArticle(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  await articleService.remove(id);
  return res.status(204).send();
}

export async function getArticleList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListParamsStruct);
  const search = {
    where: {
      OR: [
        { title: { contains: keyword, mode: 'insensitive' } },
        { content: { contains: keyword, mode: 'insensitive' } },
      ],
    },
  };

  const totalCount = await articleService.count({ ...(keyword && search) });
  const articles = await articleService.getList({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { createdAt: 'asc' },
    ...(keyword && search),
  });
  const response = {
    list: articles,
    totalCount,
  };
  return res.send(response);
}

export async function createComment(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);

  const comment = await commentService.create({
    articleId: articleId,
    content,
    userId: userId,
  });

  return res.status(201).send(comment);
}

export async function getCommentList(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const article = await articleService.getById(articleId);
  if (!article) {
    throw new NotFoundError(articleService.getEntityName(), articleId);
  }

  const commentsWithCursor = await commentService.getList({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { articleId },
    orderBy: { createdAt: 'desc' },
  });

  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return res.send({
    list: comments,
    nextCursor,
  });
}

export async function likeArticle(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);

  const existedLike = await likeService.getByArticle(userId, articleId);
  if (existedLike) {
    throw new AlreadyExstError(likeService.getEntityName());
  }

  const like = await likeService.create({
    userId: userId,
    articleId: articleId,
  });
  return res.send(like);
}

export async function dislikeArticle(req, res) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);

  const existedLike = await likeService.getByArticle(userId, articleId);
  if (!existedLike) {
    throw new NotFoundError(likeService.getEntityName(), userId);
  }

  await likeService.removeByArticle(userId, articleId);
  return res.status(204).send();
}
