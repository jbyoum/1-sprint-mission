import { Prisma } from '@prisma/client';
import prisma from '../config/prismaClient.js';

async function create(comment: Prisma.CommentUncheckedCreateInput) {
  return await prisma.comment.create({
    data: comment,
  });
}

async function getById(id: number) {
  return await prisma.comment.findUnique({
    where: {
      id: id,
    },
  });
}

async function getAll() {
  return await prisma.comment.findMany();
}

async function getList(data: Prisma.CommentFindManyArgs) {
  return await prisma.comment.findMany(data);
}

async function update(id: number, data: Prisma.CommentUncheckedUpdateInput) {
  return await prisma.comment.update({
    where: {
      id: id,
    },
    data: data,
  });
}

async function deleteById(id: number) {
  return await prisma.comment.delete({
    where: {
      id: id,
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
