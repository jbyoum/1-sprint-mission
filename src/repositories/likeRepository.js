import prisma from '../config/prismaClient.js';

async function findByArticle(userId, articleId) {
  return prisma.like.findUnique({
    where: {
      userId: userId,
      articleId: articleId,
    },
  });
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
  return prisma.like.create({
    data: like,
  });
}

async function removeByArticle(userId, articleId) {
  return prisma.like.remove({
    where: {
      userId: userId,
      articleId: articleId,
    },
  });
}

async function removeByProduct(userId, productId) {
  return prisma.like.remove({
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
