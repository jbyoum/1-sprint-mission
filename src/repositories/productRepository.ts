import { Prisma } from '@prisma/client';
import prisma from '../config/prismaClient';

async function getById(id: number) {
  return await prisma.product.findUnique({
    where: {
      id: id,
    },
  });
}

async function getList(where: Prisma.ProductFindManyArgs) {
  return await prisma.product.findMany(where);
}

async function create(product: Prisma.ProductUncheckedCreateInput) {
  return await prisma.product.create({
    data: product,
  });
}

async function update(id: number, data: Prisma.ProductUncheckedUpdateInput) {
  return await prisma.product.update({
    where: {
      id,
    },
    data: data,
  });
}

async function remove(id: number) {
  return await prisma.product.delete({
    where: {
      id: id,
    },
  });
}

async function count(where: Prisma.ProductCountArgs) {
  return await prisma.product.count(where);
}

function getEntityName() {
  return prisma.product.getEntityName();
}

export default {
  getById,
  create,
  update,
  remove,
  count,
  getList,
  getEntityName,
};
