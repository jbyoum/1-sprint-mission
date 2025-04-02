import { Prisma } from '@prisma/client';
import prisma from '../config/prismaClient';

async function getById(userId: number, articleId: number) {
  return await prisma.likeArticle.findUnique({
    where: {
      userId_articleId: { userId, articleId },
    },
  });
}

async function getList(where: Prisma.LikeArticleFindManyArgs) {
  return await prisma.likeArticle.findMany(where);
}

async function create(like: Prisma.LikeArticleUncheckedCreateInput) {
  return await prisma.likeArticle.create({
    data: like,
  });
}

async function remove(userId: number, articleId: number) {
  return await prisma.likeArticle.delete({
    where: {
      userId_articleId: { userId, articleId },
    },
  });
}

function getEntityName() {
  return prisma.likeArticle.getEntityName();
}

export default {
  getById,
  getList,
  create,
  remove: remove,
  getEntityName,
};
