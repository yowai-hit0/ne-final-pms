/*
  Warnings:

  - The values [STUDENT] on the enum `roles` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `bookId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `end_date` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `start_date` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the `books` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `spot_id` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "roles_new" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "role" TYPE "roles_new" USING ("role"::text::"roles_new");
ALTER TYPE "roles" RENAME TO "roles_old";
ALTER TYPE "roles_new" RENAME TO "roles";
DROP TYPE "roles_old";
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_bookId_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_userId_fkey";

-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_createdById_fkey";

-- DropIndex
DROP INDEX "bookings_orderId_key";

-- AlterTable
ALTER TABLE "bookings" DROP COLUMN "bookId",
DROP COLUMN "created_at",
DROP COLUMN "end_date",
DROP COLUMN "orderId",
DROP COLUMN "price",
DROP COLUMN "start_date",
DROP COLUMN "userId",
ADD COLUMN     "booked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "released_at" TIMESTAMP(3),
ADD COLUMN     "spot_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "vehicle_plate_number" TEXT,
ALTER COLUMN "role" SET DEFAULT 'USER';

-- DropTable
DROP TABLE "books";

-- CreateTable
CREATE TABLE "parking_spots" (
    "id" TEXT NOT NULL,
    "spot_number" TEXT NOT NULL,
    "is_occupied" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parking_spots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parking_spots_spot_number_key" ON "parking_spots"("spot_number");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_spot_id_fkey" FOREIGN KEY ("spot_id") REFERENCES "parking_spots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
