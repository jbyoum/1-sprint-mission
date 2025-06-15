import { Prisma } from '@prisma/client';
import likeProductRepository from '../repositories/likeProductRepository';

async function getById(userId: number, productId: number) {
  return await likeProductRepository.getById(userId, productId);
}

async function getList(where: Prisma.LikeProductFindManyArgs) {
  return await likeProductRepository.getList(where);
}

async function create(data: Prisma.LikeProductUncheckedCreateInput) {
  return await likeProductRepository.create(data);
}

async function remove(userId: number, productId: number) {
  return await likeProductRepository.remove(userId, productId);
}

function getEntityName() {
  return likeProductRepository.getEntityName();
}

export default {
  getById,
  getList,
  create,
  remove,
  getEntityName,
};
