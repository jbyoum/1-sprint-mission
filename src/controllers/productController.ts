import { create } from 'superstruct';
import NotFoundError from '../lib/errors/NotFoundError';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productStruct.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentStruct';
import productService from '../services/productService';
import commentService from '../services/commentService';
import likeService from '../services/likeService';
import { Request, Response } from 'express';
import AlreadyExstError from '../lib/errors/AlreadyExstError';
import { Prisma } from '@prisma/client';

export async function createProduct(req: Request, res: Response) {
  const data = create(req.body, CreateProductBodyStruct);
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);

  const product = await productService.create({
    ...data,
    userId: userId,
  });

  res.status(201).send(product);
}

export async function getProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);

  const product = await productService.getById(id);
  if (!product) {
    throw new NotFoundError(productService.getEntityName(), id);
  }

  if (!req.user) {
    res.send(product);
  } else {
    const { id: userId } = create({ id: req.user.id }, IdParamsStruct);
    const like = await likeService.getByProduct(userId, id);
    res.send({ ...product, isLiked: !!like });
  }
}

export async function updateProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStruct);

  const updatedProduct = await productService.update(id, data);

  res.send(updatedProduct);
}

export async function deleteProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  await productService.remove(id);

  res.status(204).send();
}

export async function getProductList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);

  const search = {
    where: {
      OR: [
        { name: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
        { description: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
      ],
    },
  };

  const totalCount = await productService.count({ where: keyword ? search.where : {} });
  const products = await productService.getList({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    where: keyword ? search.where : {},
  });

  res.send({
    list: products,
    totalCount,
  });
}

export async function createComment(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);

  const comment = await commentService.create({
    productId: productId,
    content,
    userId: userId,
  });

  res.status(201).send(comment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const existingProduct = await productService.getById(productId);
  if (!existingProduct) {
    throw new NotFoundError(productService.getEntityName(), productId);
  }

  const commentsWithCursorComment = await commentService.getList({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { productId },
  });
  const comments = commentsWithCursorComment.slice(0, limit);
  const cursorComment = commentsWithCursorComment[comments.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  res.send({
    list: comments,
    nextCursor,
  });
}

export async function likeProduct(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);

  const existedLike = await likeService.getByProduct(userId, productId);
  if (existedLike) {
    throw new AlreadyExstError(likeService.getEntityName());
  }

  const like = await likeService.create({
    userId: userId,
    productId: productId,
  });
  res.send(like);
}

export async function dislikeProduct(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);

  const existedLike = await likeService.getByProduct(userId, productId);
  if (!existedLike) {
    throw new NotFoundError(likeService.getEntityName(), userId);
  }

  await likeService.removeByProduct(userId, productId);
  res.status(204).send();
}
