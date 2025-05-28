import { create } from 'superstruct';
import NotFoundError from '../lib/errors/NotFoundError';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productStruct';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentStruct';
import productService from '../services/productService';
import commentService from '../services/commentService';
import likeProductService from '../services/likeProductService';
import { Request, Response } from 'express';
import AlreadyExstError from '../lib/errors/AlreadyExstError';
import { Prisma } from '@prisma/client';
import { UserWithId } from '../../types/user-with-id';
import { ProductListWithCountDTO, ProductWithLikeDTO } from '../lib/dtos/ProductResDTO';
import { CommentListWithCursorDTO } from '../lib/dtos/CommentDTO';
import { ASC_STRING, DESC_STRING, RECENT_STRING } from '../config/constants';

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
    const reqUser = req.user as UserWithId;
    const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);
    const like = await likeProductService.getById(userId, id);
    res.send(new ProductWithLikeDTO(product, like));
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
    orderBy: orderBy === RECENT_STRING ? { id: DESC_STRING } : { id: ASC_STRING },
    where: keyword ? search.where : {},
  });

  res.send(new ProductListWithCountDTO(products, totalCount));
}

export async function createComment(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);

  const product = await productService.getById(productId);
  if (!product) {
    throw new NotFoundError(productService.getEntityName(), productId);
  }

  const comment = await commentService.create(content, userId, null, productId);

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

  res.send(new CommentListWithCursorDTO(comments, nextCursor));
}

export async function likeProduct(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);

  const product = await productService.getById(productId);
  if (!product) {
    throw new NotFoundError(productService.getEntityName(), productId);
  }

  const existedLike = await likeProductService.getById(userId, productId);
  if (existedLike) {
    throw new AlreadyExstError(likeProductService.getEntityName());
  }

  const like = await likeProductService.create({
    userId: userId,
    productId: productId,
  });
  res.send(like);
}

export async function dislikeProduct(req: Request, res: Response) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);

  const existedLike = await likeProductService.getById(userId, productId);
  if (!existedLike) {
    throw new NotFoundError(likeProductService.getEntityName(), userId);
  }

  await likeProductService.remove(userId, productId);
  res.status(204).send();
}

export async function getOwnProducts(req: Request, res: Response) {
  const { page, pageSize, orderBy } = create(req.query, GetProductListParamsStruct);
  const reqUser = req.user as UserWithId;

  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);

  const totalCount = await productService.count({ where: { userId: userId } });
  const products = await productService.getList({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === RECENT_STRING ? { createdAt: DESC_STRING } : { id: ASC_STRING },
    where: {
      userId: userId,
    },
  });

  res.send(new ProductListWithCountDTO(products, totalCount));
}

export async function getLikedProducts(req: Request, res: Response) {
  const { page, pageSize, orderBy } = create(req.query, GetProductListParamsStruct);
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);

  const likes = await likeProductService.getList({
    where: {
      userId: userId,
    },
    select: { productId: true },
  });
  const likedProductIds = likes
    .map((like) => like.productId)
    .filter((element): element is number => element !== null);
  const totalCount = likedProductIds.length;
  const likedProducts = await productService.getList({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === RECENT_STRING ? { createdAt: DESC_STRING } : { id: ASC_STRING },
    where: {
      id: {
        in: likedProductIds,
      },
    },
  });

  res.send(new ProductListWithCountDTO(likedProducts, totalCount));
}
