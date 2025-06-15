/*
  Warnings:

  - The primary key for the `LikeArticle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `LikeArticle` table. All the data in the column will be lost.
  - The primary key for the `LikeProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `LikeProduct` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LikeArticle" DROP CONSTRAINT "LikeArticle_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "LikeArticle_pkey" PRIMARY KEY ("userId", "articleId");

-- AlterTable
ALTER TABLE "LikeProduct" DROP CONSTRAINT "LikeProduct_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "LikeProduct_pkey" PRIMARY KEY ("userId", "productId");
