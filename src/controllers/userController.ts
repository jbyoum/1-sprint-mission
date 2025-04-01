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
  res.status(201).send(user);
}

export async function login(req: Request, res: Response) {
  const reqUser = req.user as UserWithId;
  const accessToken = userService.createToken(reqUser);
  const refreshToken = userService.createToken(reqUser, 'refresh');
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);
  await userService.updateUser(userId, { refreshToken });
  res.cookie('refreshToken', refreshToken, {
    path: '/users/token/refresh',
    httpOnly: true,
    sameSite: 'none',
    secure: false,
  });
  res.json({ accessToken });
}

export async function refreshToken(req: Request, res: Response) {
  const { refreshToken } = req.cookies;
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);
  const { accessToken, newRefreshToken } = await userService.refreshToken(userId, refreshToken);
  await userService.updateUser(userId, { refreshToken: newRefreshToken });
  res.cookie('refreshToken', newRefreshToken, {
    path: '/users/token/refresh',
    httpOnly: true,
    sameSite: 'none',
    secure: false,
  });
  res.json({ accessToken });
}

export async function getInfo(req: Request, res: Response) {
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);
  const user = await userService.getUserById(userId);
  res.send(user);
}

export async function editInfo(req: Request, res: Response) {
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);
  const data = create(req.body, UpdateUserBodyStruct);
  const user = await userService.updateUser(userId, data);
  res.status(201).send(user);
}

export async function editPassword(req: Request, res: Response) {
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);
  const { password: password } = create(req.body, CreatePasswordStruct);
  const user = await userService.updatePassword(userId, password);
  res.status(201).send(user);
}

export async function getOwnProducts(req: Request, res: Response) {
  const { page, pageSize, orderBy } = create(req.query, GetListParamsStruct);
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);

  const products = await productService.getList({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where: {
      userId: userId,
    },
  });

  res.send(products);
}

export async function getLikedProducts(req: Request, res: Response) {
  const { page, pageSize, orderBy } = create(req.query, GetListParamsStruct);
  const reqUser = req.user as UserWithId;
  const { id: userId } = create({ id: reqUser.id }, IdParamsStruct);

  const likes = await likeService.getList({
    where: {
      userId: userId,
      productId: { not: null },
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
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where: {
      id: {
        in: likedProductIds,
      },
    },
  });

  res.send({
    list: likedProducts,
    totalCount,
  });
}
