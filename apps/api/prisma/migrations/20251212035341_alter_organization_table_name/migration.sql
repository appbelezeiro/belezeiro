/*
  Warnings:

  - You are about to drop the column `business_name` on the `organizations` table. All the data in the column will be lost.
  - Added the required column `name` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "business_name",
ADD COLUMN     "name" TEXT NOT NULL;
