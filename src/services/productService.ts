import { NotificationType, Prisma, Product } from '@prisma/client';
import productRepository from '../repositories/productRepository';
import { UpdateProductBodyType } from '../structs/productStruct';
import likeProductService from './likeProductService';
import notificationService from './notificationService';
import { emitAlertToUser } from '../sockets/handlers/notificationHandler';

async function getById(id: number) {
  return await productRepository.getById(id);
}

async function getList(where: Prisma.ProductFindManyArgs) {
  return await productRepository.getList(where);
}

async function create(product: Prisma.ProductUncheckedCreateInput) {
  return await productRepository.create(product);
}

async function handleNotification(existingProduct: Product | null, product: Product) {
  if (!existingProduct) return;
  if (existingProduct.price === product.price) return;

  const likes = await likeProductService.getList({
    where: {
      productId: product.id,
    },
  });
  if (likes.length === 0) return;

  Promise.all(
    likes.map(async (like) => {
      const notification = await notificationService.createNotification(
        like.userId,
        `관심 상품 "${product.name}"의 가격이 변경되었습니다.`,
        NotificationType.PRICE_CHANGE,
      );
      emitAlertToUser(like.userId, notification);
    }),
  );
}

async function update(id: number, data: UpdateProductBodyType) {
  const existingProduct = await productRepository.getById(id);
  const product = await productRepository.update(id, data);
  handleNotification(existingProduct, product).catch((error) => {
    console.error('Error handling product notification:', error);
  });
  return product;
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
