import prisma from '../config/prismaClient.js';

async function create(comment) {
  return await prisma.comment.create({
    data: comment,
  });
}

async function getById(id) {
  const comment = await prisma.comment.findUnique({
    where: {
      id: parseInt(id, 10),
    },
  });
  return comment;
}

async function getAll() {
  const comments = await prisma.comment.findMany();
  return comments;
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
  const deletedComment = await prisma.comment.delete({
    where: {
      id: parseInt(id, 10),
    },
  });
  return deletedComment;
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
