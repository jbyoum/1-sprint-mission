import { create } from 'superstruct';
import userService from '../services/userService';
import productService from '../services/productService';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreatePasswordStruct,
  CreateUserBodyStruct,
  GetListParamsStruct,
  UpdateUserBodyStruct,
} from '../structs/userStructs';
import likeService from '../services/likeService';
import { Request, Response } from 'express';

export async function createUser(req: Request, res: Response) {
  const data = create(req.body, CreateUserBodyStruct);
  const user = await userService.createUser(data);
  return res.status(201).send(user);
}

export async function login(req: RequestWithUser, res: Response) {
  const user = req.user;
  const accessToken = userService.createToken(user);
  const refreshToken = userService.createToken(user, 'refresh');
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);
  await userService.updateUser(userId, { refreshToken });
  res.cookie('refreshToken', refreshToken, {
    path: '/users/token/refresh',
    httpOnly: true,
    sameSite: 'none',
    secure: false,
  });
  return res.json({ accessToken });
}

export async function refreshToken(req: RequestWithUser, res: Response) {
  const { refreshToken } = req.cookies;
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);
  const { accessToken, newRefreshToken } = await userService.refreshToken(userId, refreshToken);
  await userService.updateUser(userId, { refreshToken: newRefreshToken });
  res.cookie('refreshToken', newRefreshToken, {
    path: '/users/token/refresh',
    httpOnly: true,
    sameSite: 'none',
    secure: false,
  });
  return res.json({ accessToken });
}

export async function getInfo(req: RequestWithUser, res: Response) {
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);
  const user = await userService.getUserById(userId);
  return res.send(user);
}

export async function editInfo(req: RequestWithUser, res: Response) {
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);
  const data = create(req.body, UpdateUserBodyStruct);
  const user = await userService.updateUser(userId, data);
  return res.status(201).send(user);
}

export async function editPassword(req: RequestWithUser, res: Response) {
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);
  const { password: password } = create(req.body, CreatePasswordStruct);
  const user = await userService.updatePassword(userId, password);
  return res.status(201).send(user);
}

export async function getOwnProducts(req: RequestWithUser, res: Response) {
  const { page, pageSize, orderBy } = create(req.query, GetListParamsStruct);
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);

  const products = await productService.getList({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where: {
      userId: userId,
    },
  });

  return res.send(products);
}

export async function getLikedProducts(req: RequestWithUser, res: Response) {
  const { page, pageSize, orderBy } = create(req.query, GetListParamsStruct);
  const { id: userId } = create({ id: req.user.id }, IdParamsStruct);

  const likes = await likeService.getList({
    where: {
      userId: userId,
      productId: { not: null },
    },
    select: { productId: true },
  });
  const likedProductIds = likes.map((like) => like.productId);
  const totalCount = likedProductIds.length;
  const likedProducts = await productService.getList({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where: {
      id: {
        in: likedProductIds,
      },
    },
  });

  return res.send({
    list: likedProducts,
    totalCount,
  });
}
