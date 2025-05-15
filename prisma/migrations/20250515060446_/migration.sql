/*
  Warnings:

  - You are about to drop the column `content` on the `Alert` table. All the data in the column will be lost.
  - Added the required column `payload` to the `Alert` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Alert` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('NEW_COMMENT', 'PRICE_CHANGE');

-- AlterTable
ALTER TABLE "Alert" DROP COLUMN "content",
ADD COLUMN     "payload" JSONB NOT NULL,
ADD COLUMN     "type" "AlertType" NOT NULL;
