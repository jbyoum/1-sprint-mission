import { create } from 'superstruct';
import NotFoundError from '../lib/errors/NotFoundError.js';
import { IdParamsStruct } from '../structs/commonStructs.js';
import {
  CreateProductBodyStruct,
  GetProductListParamsStruct,
  UpdateProductBodyStruct,
} from '../structs/productStruct.js';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentStruct.js';
import productService from '../services/productService.js';
import commentService from '../services/commentService.js';
import likeService from '../services/likeService.js';
import passport from '../config/passport.js';

export async function createProduct(req, res) {
  const data = create(req.body, CreateProductBodyStruct);
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);

  const product = await productService.create({
    ...data,
    userId: userId,
  });

  res.status(201).send(product);
}

export async function getProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);

  const product = await productService.getById(id);
  if (!product) {
    throw new NotFoundError(productService.getEntityName(), id);
  }

  const user = passport.authenticate('access-token', { session: false });
  if (user) {
    const like = await likeService.getByProduct(user.id, id);
    product.isLiked = like ? true : false;
  }

  return res.send(product);
}

export async function updateProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStruct);

  const updatedProduct = await productService.update(id, data);

  return res.send(updatedProduct);
}

export async function deleteProduct(req, res) {
  const { id } = create(req.params, IdParamsStruct);
  await productService.delete(id);

  return res.status(204).send();
}

export async function getProductList(req, res) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetProductListParamsStruct);

  const search = {
    where: {
      OR: [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ],
    },
  };

  const totalCount = await productService.count({ ...(keyword && search) });
  const products = await productService.getList({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { id: 'desc' } : { id: 'asc' },
    ...(keyword && search),
  });

  return res.send({
    list: products,
    totalCount,
  });
}

export async function createComment(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);

  const comment = await commentService.create({
    productId: productId,
    content,
    userId: userId,
  });

  return res.status(201).send(comment);
}

export async function getCommentList(req, res) {
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

  return res.send({
    list: comments,
    nextCursor,
  });
}

export async function likeProduct(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);

  const existedLike = await likeService.getByProduct(userId, productId);
  if (existedLike) {
    throw new AlreadyExstError(likeService.getEntityName());
  }

  const like = await likeService.create({
    userId: userId,
    productId: productId,
  });
  return res.send(like);
}

export async function dislikeProduct(req, res) {
  const { id: productId } = create(req.params, IdParamsStruct);
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);

  const existedLike = await likeService.getByProduct(userId, productId);
  if (!existedLike) {
    throw new NotFoundError(likeService.getEntityName(), userId);
  }

  await likeService.removeByProduct(userId, productId);
  return res.status(204).send();
}
