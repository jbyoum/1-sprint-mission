import { Prisma } from '@prisma/client';
import prisma from '../config/prismaClient';

async function getById(id: number) {
  return await prisma.article.findUnique({
    where: {
      id: id,
    },
  });
}

async function getList(where: Prisma.ArticleFindManyArgs) {
  return await prisma.article.findMany(where);
}

async function create(article: Prisma.ArticleUncheckedCreateInput) {
  return await prisma.article.create({
    data: article,
  });
}

async function update(id: number, data: Prisma.ArticleUncheckedUpdateInput) {
  return await prisma.article.update({
    where: {
      id,
    },
    data: data,
  });
}

async function remove(id: number) {
  return await prisma.article.delete({
    where: {
      id: id,
    },
  });
}

async function count(where: Prisma.ArticleCountArgs) {
  return await prisma.article.count(where);
}

function getEntityName() {
  return prisma.article.getEntityName();
}

export default {
  getById,
  create,
  update,
  remove,
  getEntityName,
  count,
  getList,
};
