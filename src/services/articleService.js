import articleRepository from '../repositories/articleRepository.js';

async function getById(id) {
  return await articleRepository.getById(id);
}

async function getList(where) {
  return await articleRepository.getList(where);
}

async function create(article) {
  return await articleRepository.create(article);
}

async function update(id, article) {
  return await articleRepository.update(id, article);
}

async function remove(id) {
  return await articleRepository.remove(id);
}

async function count(where) {
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
