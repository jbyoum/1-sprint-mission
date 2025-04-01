import { Prisma } from '@prisma/client';
import productRepository from '../repositories/productRepository';

async function getById(id: number) {
  return await productRepository.getById(id);
}

async function getList(where: Prisma.ProductFindManyArgs) {
  return await productRepository.getList(where);
}

async function create(product: Prisma.ProductUncheckedCreateInput) {
  return await productRepository.create(product);
}

async function update(id: number, data: Prisma.ProductUncheckedUpdateInput) {
  return await productRepository.update(id, data);
}

async function remove(id: number) {
  return await productRepository.remove(id);
}

async function count(where: Prisma.ProductCountArgs) {
  return await productRepository.count(where);
}

function getEntityName() {
  return productRepository.getEntityName();
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
