import { Prisma } from '@prisma/client';
import prisma from '../config/prismaClient.js';

async function findByArticle(userId: number, articleId: number) {
  return (
    await prisma.like.findMany({
      where: {
        userId: userId,
        articleId: articleId,
      },
    })
  )?.[0];
}

async function findByProduct(userId: number, productId: number) {
  return (
    await prisma.like.findMany({
      where: {
        userId: userId,
        productId: productId,
      },
    })
  )?.[0];
}

async function getList(where: Prisma.LikeFindManyArgs) {
  return await prisma.like.findMany(where);
}

async function create(like: Prisma.LikeUncheckedCreateInput) {
  return await prisma.like.create({
    data: like,
  });
}

async function removeByArticle(userId: number, articleId: number) {
  return await prisma.like.deleteMany({
    where: {
      userId: userId,
      articleId: articleId,
    },
  });
}

async function removeByProduct(userId: number, productId: number) {
  return await prisma.like.deleteMany({
    where: {
      userId: userId,
      productId: productId,
    },
  });
}

function getEntityName() {
  return prisma.like.getEntityName();
}

export default {
  findByArticle,
  findByProduct,
  getList,
  create,
  removeByArticle,
  removeByProduct,
  getEntityName,
};
