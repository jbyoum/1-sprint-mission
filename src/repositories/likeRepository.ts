import prisma from '../config/prismaClient.js';

async function findByArticle(userId, articleId) {
  return (
    await prisma.like.findMany({
      where: {
        userId: userId,
        articleId: articleId,
      },
    })
  )?.[0];
}

async function findByProduct(userId, productId) {
  return await prisma.like.findUnique({
    where: {
      userId: userId,
      productId: productId,
    },
  });
}

async function getList(where) {
  return await prisma.like.findMany(where);
}

async function create(like) {
  return await prisma.like.create({
    data: like,
  });
}

async function removeByArticle(userId, articleId) {
  return await prisma.like.deleteMany({
    where: {
      userId: userId,
      articleId: articleId,
    },
  });
}

async function removeByProduct(userId, productId) {
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
