import { Prisma } from '@prisma/client';
import likeArticleRepository from '../repositories/likeArticleRepository';

async function getById(userId: number, articleId: number) {
  return await likeArticleRepository.getById(userId, articleId);
}

async function getList(where: Prisma.LikeArticleFindManyArgs) {
  return await likeArticleRepository.getList(where);
}

async function create(data: Prisma.LikeArticleUncheckedCreateInput) {
  return await likeArticleRepository.create(data);
}

async function remove(userId: number, articleId: number) {
  return await likeArticleRepository.remove(userId, articleId);
}

function getEntityName() {
  return likeArticleRepository.getEntityName();
}

export default {
  getById,
  getList,
  create,
  remove,
  getEntityName,
};
