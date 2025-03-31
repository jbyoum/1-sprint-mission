import { Prisma } from '@prisma/client';
import articleRepository from '../repositories/articleRepository.js';

async function getById(id: number) {
  return await articleRepository.getById(id);
}

async function getList(where: Prisma.ArticleFindManyArgs) {
  return await articleRepository.getList(where);
}

async function create(article: Prisma.ArticleUncheckedCreateInput) {
  return await articleRepository.create(article);
}

async function update(id: number, article: Prisma.ArticleUncheckedUpdateInput) {
  return await articleRepository.update(id, article);
}

async function remove(id: number) {
  return await articleRepository.remove(id);
}

async function count(where: Prisma.ArticleCountArgs) {
  return await articleRepository.count(where);
}

function getEntityName() {
  return articleRepository.getEntityName();
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
