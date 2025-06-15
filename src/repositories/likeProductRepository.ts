import { Prisma } from '@prisma/client';
import prisma from '../config/prismaClient';

async function getById(userId: number, productId: number) {
  return await prisma.likeProduct.findUnique({
    where: {
      userId_productId: { userId, productId },
    },
  });
}

async function getList(where: Prisma.LikeProductFindManyArgs) {
  return await prisma.likeProduct.findMany(where);
}

async function create(like: Prisma.LikeProductUncheckedCreateInput) {
  return await prisma.likeProduct.create({
    data: like,
  });
}

async function remove(userId: number, productId: number) {
  return await prisma.likeProduct.delete({
    where: {
      userId_productId: { userId, productId },
    },
  });
}

function getEntityName() {
  return prisma.likeProduct.getEntityName();
}

export default {
  getById,
  getList,
  create,
  remove,
  getEntityName,
};
