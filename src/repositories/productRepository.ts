import prisma from '../config/prismaClient.js';

async function getById(id) {
  return await prisma.product.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
}

async function getList(where) {
  return await prisma.product.findMany(where);
}

async function create(product) {
  return await prisma.product.create({
    data: product,
  });
}

async function update(id, data) {
  return await prisma.product.update({
    where: {
      id,
    },
    data: data,
  });
}

async function remove(id) {
  return await prisma.product.delete({
    where: {
      id: parseInt(id, 10),
    },
  });
}

async function count(where) {
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
