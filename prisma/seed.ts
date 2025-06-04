// seed.ts
import { PrismaClient } from '@prisma/client';
import {
  mockUsers,
  mockArticles,
  mockProducts,
  mockComments,
  mockLikeArticles,
  mockLikeProducts,
  mockNotifications,
} from './mock';

const prisma = new PrismaClient();

export async function seedDatabase(): Promise<void> {
  await prisma.notification.deleteMany();
  await prisma.likeArticle.deleteMany();
  await prisma.likeProduct.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({ data: mockUsers });
  await prisma.article.createMany({ data: mockArticles });
  await prisma.product.createMany({ data: mockProducts });
  await prisma.comment.createMany({ data: mockComments });
  await prisma.likeArticle.createMany({ data: mockLikeArticles });
  await prisma.likeProduct.createMany({ data: mockLikeProducts });
  await prisma.notification.createMany({ data: mockNotifications });
}

// 직접 실행할 경우만 동작
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🌱 Seed completed successfully');
    })
    .catch((e) => {
      console.error('❌ Seed failed', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
