import prisma from '../config/prismaClient.js';

async function create(comment) {
  return await prisma.comment.create({
    data: comment,
  });
}

async function getById(id) {
  return await prisma.comment.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
}

async function getAll() {
  return await prisma.comment.findMany();
}

async function getList(data) {
  return await prisma.comment.findMany(data);
}

async function update(id, data) {
  return await prisma.comment.update({
    where: {
      id: parseInt(id, 10),
    },
    data: data,
  });
}

async function deleteById(id) {
  return await prisma.comment.delete({
    where: {
      id: parseInt(id, 10),
    },
  });
}

function getEntityName() {
  return prisma.comment.getEntityName();
}

export default {
  create,
  getById,
  getAll,
  getList,
  update,
  deleteById,
  getEntityName,
};
