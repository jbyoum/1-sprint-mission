import { Prisma } from '@prisma/client';
import likeRepository from '../repositories/likeRepository';

async function getByArticle(userId: number, articleId: number) {
  return await likeRepository.findByArticle(userId, articleId);
}

async function getByProduct(userId: number, productId: number) {
  return await likeRepository.findByProduct(userId, productId);
}

async function getList(where: Prisma.LikeFindManyArgs) {
  return await likeRepository.getList(where);
}

async function create(data: Prisma.LikeUncheckedCreateInput) {
  return await likeRepository.create(data);
}

async function removeByArticle(userId: number, articleId: number) {
  return await likeRepository.removeByArticle(userId, articleId);
}

async function removeByProduct(userId: number, productId: number) {
  return await likeRepository.removeByProduct(userId, productId);
}

function getEntityName() {
  return likeRepository.getEntityName();
}

export default {
  getByArticle,
  getByProduct,
  getList,
  create,
  removeByArticle,
  removeByProduct,
  getEntityName,
};
