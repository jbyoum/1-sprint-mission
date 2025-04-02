import { create } from 'superstruct';
import NotFoundError from '../lib/errors/NotFoundError';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articleStructs';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentStruct';
import articleService from '../services/articleService';
import commentService from '../services/commentService';
import likeArticleService from '../services/likeArticleService';
import AlreadyExstError from '../lib/errors/AlreadyExstError';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { UserWithId } from '../../types/user-with-id';
import { ArticleListWithCountDTO, ArticleWithLikeDTO } from '../lib/dtos/ArticleResDTO';
import { CommentListWithCursorDTO } from '../lib/dtos/CommentResDTO';
import { RECENT_STRING, DESC_STRING, ASC_STRING } from '../config/constants';

export async function createArticle(req: Request, res: Response) {
  const reqUser = req.user as UserWithId;
  const data = create(req.body, CreateArticleBodyStruct);
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);

  const article = await articleService.create({
    ...data,
    userId: userId,
  });

  res.status(201).send(article);
}

export async function getArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const article = await articleService.getById(id);
  if (!article) {
    throw new NotFoundError(articleService.getEntityName(), id);
  }

  if (!req.user) {
    res.send(article);
  } else {
    const reqUser = req.user as UserWithId;
    const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);
    const like = await likeArticleService.getById(userId, id);
    res.send(new ArticleWithLikeDTO(article, like));
  }
}

export async function updateArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);

  const article = await articleService.update(id, data);
  res.send(article);
}

export async function deleteArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);

  await articleService.remove(id);
  res.status(204).send();
}

export async function getArticleList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListParamsStruct);
  const search = {
    where: {
      OR: [
        { title: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
        { content: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
      ],
    },
  };

  const totalCount = await articleService.count({ where: keyword ? search.where : {} });
  const articles = await articleService.getList({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === RECENT_STRING ? { createdAt: DESC_STRING } : { createdAt: ASC_STRING },
    where: keyword ? search.where : {},
  });
  res.send(new ArticleListWithCountDTO(articles, totalCount));
}

export async function createComment(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);

  const comment = await commentService.create({
    articleId: articleId,
    content,
    userId: userId,
  });

  res.status(201).send(comment);
}

export async function getCommentList(req: Request, res: Response) {
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
    orderBy: { createdAt: DESC_STRING },
  });

  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  res.send(new CommentListWithCursorDTO(comments, nextCursor));
}

export async function likeArticle(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);

  const existedLike = await likeArticleService.getById(userId, articleId);
  if (existedLike) {
    throw new AlreadyExstError(likeArticleService.getEntityName());
  }

  const like = await likeArticleService.create({
    userId: userId,
    articleId: articleId,
  });
  res.send(like);
}

export async function dislikeArticle(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);

  const existedLike = await likeArticleService.getById(userId, articleId);
  if (!existedLike) {
    throw new NotFoundError(likeArticleService.getEntityName(), userId);
  }

  await likeArticleService.remove(userId, articleId);
  res.status(204).send();
}
