import likeRepository from '../repositories/likeRepository.js';

async function getByArticle(userId, articleId) {
  return await likeRepository.findByArticle(userId, articleId);
}

async function getByProduct(userId, productId) {
  return await likeRepository.findByProduct(userId, productId);
}

async function getList(where) {
  return await likeRepository.getList(where);
}

async function create(data) {
  return await likeRepository.create(data);
}

async function removeByArticle(userId, articleId) {
  return await likeRepository.removeByArticle(userId, articleId);
}

async function removeByProduct(userId, productId) {
  return await likeRepository.removeByProduct(userId, productId);
}

function getEntityName() {
  return likeRepository.getEntityName();
}

export default {
  getByArticle,
  getByProduct,
  getList,
  create,
  removeByArticle,
  removeByProduct,
  getEntityName,
};
