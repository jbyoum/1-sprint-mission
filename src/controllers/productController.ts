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

/**
 * @openapi
 * /products:
 *   post:
 *     summary: 상품 생성
 *     description: 사용자가 새로운 상품을 생성합니다.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 상품 이름
 *                 example: "Laptop"
 *               price:
 *                 type: number
 *                 description: 상품 가격
 *                 example: 1200
 *               description:
 *                 type: string
 *                 description: 상품 설명
 *                 example: "A high-performance laptop."
 *     responses:
 *       201:
 *         description: 상품 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: 잘못된 요청. 입력 데이터가 유효하지 않습니다.
 */
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

/**
 * @openapi
 * /products/{id}:
 *   get:
 *     summary: 상품 조회
 *     description: 특정 ID를 가진 상품을 조회합니다.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 조회할 상품의 ID
 *     responses:
 *       200:
 *         description: 상품 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductWithLikeDTO'
 *       404:
 *         description: 상품을 찾을 수 없습니다.
 */
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

/**
 * @openapi
 * /products/{id}:
 *   patch:
 *     summary: 상품 수정
 *     description: 특정 ID를 가진 상품의 정보를 수정합니다.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 수정할 상품의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 수정할 상품 이름
 *               price:
 *                 type: number
 *                 description: 수정할 상품 가격
 *               description:
 *                 type: string
 *                 description: 수정할 상품 설명
 *     responses:
 *       200:
 *         description: 상품 수정 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: 상품을 찾을 수 없습니다.
 */
export async function updateProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateProductBodyStruct);

  const updatedProduct = await productService.update(id, data);

  res.send(updatedProduct);
}

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: 상품 삭제
 *     description: 특정 ID를 가진 상품을 삭제합니다.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 삭제할 상품의 ID
 *     responses:
 *       204:
 *         description: 상품 삭제 성공
 *       404:
 *         description: 상품을 찾을 수 없습니다.
 */
export async function deleteProduct(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  await productService.remove(id);

  res.status(204).send();
}

/**
 * @openapi
 * /products:
 *   get:
 *     summary: 상품 목록 조회
 *     description: 페이지네이션 및 검색 조건을 기반으로 상품 목록을 조회합니다.
 *     tags:
 *       - Products
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: number
 *         description: 페이지 번호
 *       - in: query
 *         name: pageSize
 *         required: true
 *         schema:
 *           type: number
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: orderBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [recent]
 *         description: 정렬 기준
 *       - in: query
 *         name: keyword
 *         required: false
 *         schema:
 *           type: string
 *         description: 검색 키워드
 *     responses:
 *       200:
 *         description: 상품 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListWithCountDTO'
 */
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

/**
 * @openapi
 * /products/{id}/comments:
 *   post:
 *     summary: 상품 댓글 생성
 *     description: 특정 상품에 댓글을 작성합니다.
 *     tags:
 *       - Comments
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 댓글을 작성할 상품의 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 description: 댓글 내용
 *                 example: "This is a comment for the product."
 *     responses:
 *       201:
 *         description: 댓글 생성 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       404:
 *         description: 상품을 찾을 수 없습니다.
 */
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

/**
 * @openapi
 * /products/{id}/comments:
 *   get:
 *     summary: 상품 댓글 목록 조회
 *     description: 특정 상품의 댓글 목록을 조회합니다.
 *     tags:
 *       - Comments
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 댓글을 조회할 상품의 ID
 *       - in: query
 *         name: cursor
 *         required: false
 *         schema:
 *           type: number
 *         description: 다음 페이지를 위한 커서
 *       - in: query
 *         name: limit
 *         required: true
 *         schema:
 *           type: number
 *         description: 가져올 댓글 수
 *     responses:
 *       200:
 *         description: 댓글 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CommentListWithCursorDTO'
 *       404:
 *         description: 상품을 찾을 수 없습니다.
 */
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

/**
 * @openapi
 * /products/{id}/like:
 *   get:
 *     summary: 상품 좋아요 추가
 *     description: 특정 상품에 대해 사용자가 좋아요를 추가합니다.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 좋아요를 추가할 상품의 ID
 *     responses:
 *       200:
 *         description: 좋아요 추가 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liked:
 *                   type: boolean
 *                   description: 좋아요가 추가된 상태
 *                   example: true
 *       404:
 *         description: 상품을 찾을 수 없습니다.
 *       409:
 *         description: 이미 좋아요가 추가된 상태입니다.
 */
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

/**
 * @openapi
 * /products/{id}/dislike:
 *   get:
 *     summary: 상품 좋아요 제거
 *     description: 특정 상품에 대해 사용자가 추가한 좋아요를 제거합니다.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: 좋아요를 제거할 상품의 ID
 *     responses:
 *       200:
 *         description: 좋아요 제거 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liked:
 *                   type: boolean
 *                   description: 좋아요가 제거된 상태
 *                   example: false
 *       404:
 *         description: 좋아요가 존재하지 않아 제거할 수 없습니다.
 */
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

/**
 * @openapi
 * /products/me:
 *   get:
 *     summary: 사용자가 등록한 상품 목록 조회
 *     description: 사용자가 자신이 등록한 상품 목록을 조회합니다.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: number
 *         description: 페이지 번호
 *       - in: query
 *         name: pageSize
 *         required: true
 *         schema:
 *           type: number
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: orderBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [recent, asc]
 *         description: 정렬 기준 recent
 *     responses:
 *       200:
 *         description: 사용자가 등록한 상품 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListWithCountDTO'
 *       401:
 *         description: 인증 실패. 사용자가 로그인하지 않았습니다.
 */
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

/**
 * @openapi
 * /products/like:
 *   get:
 *     summary: 사용자가 좋아요한 상품 목록 조회
 *     description: 사용자가 좋아요를 추가한 상품 목록을 조회합니다.
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: true
 *         schema:
 *           type: number
 *         description: 페이지 번호
 *       - in: query
 *         name: pageSize
 *         required: true
 *         schema:
 *           type: number
 *         description: 페이지당 항목 수
 *       - in: query
 *         name: orderBy
 *         required: false
 *         schema:
 *           type: string
 *           enum: [recent, asc]
 *         description: 정렬 기준 recent
 *     responses:
 *       200:
 *         description: 사용자가 좋아요한 상품 목록 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListWithCountDTO'
 *       401:
 *         description: 인증 실패. 사용자가 로그인하지 않았습니다.
 */
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
