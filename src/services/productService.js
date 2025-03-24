import productRepository from '../repositories/productRepository.js';

async function getById(id) {
  return await productRepository.getById(id);
}

async function getList(where) {
  return await productRepository.getList(where);
}

async function create(product) {
  return await productRepository.create(product);
}

async function update(id, data) {
  return await productRepository.update(id, data);
}

async function remove(id) {
  return await productRepository.remove(id);
}

async function count(where) {
  return await productRepository.count(where);
}

async function getEntityName() {
  return await productRepository.getEntityName();
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
