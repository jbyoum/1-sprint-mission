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

  await prisma.user.createMany({ data: mockUsers, skipDuplicates: false });
  await prisma.article.createMany({ data: mockArticles, skipDuplicates: false });
  await prisma.product.createMany({ data: mockProducts, skipDuplicates: false });
  await prisma.comment.createMany({ data: mockComments, skipDuplicates: false });
  await prisma.likeArticle.createMany({ data: mockLikeArticles, skipDuplicates: false });
  await prisma.likeProduct.createMany({ data: mockLikeProducts, skipDuplicates: false });
  await prisma.notification.createMany({ data: mockNotifications, skipDuplicates: false });

  await prisma.$executeRawUnsafe(
    `SELECT setval('"User_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM "User"), true);`,
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval('"Article_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM "Article"), true);`,
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval('"Product_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM "Product"), true);`,
  );
  await prisma.$executeRawUnsafe(
    `SELECT setval('"Comment_id_seq"', (SELECT COALESCE(MAX(id), 1) FROM "Comment"), true);`,
  );
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
