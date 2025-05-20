/*
  Warnings:

  - You are about to drop the column `booking_id` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `check_in_at` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `check_out_at` on the `tickets` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `bookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `otps` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `parking_spots` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `parking_id` to the `tickets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `tickets` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_spot_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_user_id_fkey";

-- DropForeignKey
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_booking_id_fkey";

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "booking_id",
DROP COLUMN "check_in_at",
DROP COLUMN "check_out_at",
ADD COLUMN     "charged_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "entry_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "exit_time" TIMESTAMP(3),
ADD COLUMN     "parking_id" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "status",
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';

-- DropTable
DROP TABLE "bookings";

-- DropTable
DROP TABLE "otps";

-- DropTable
DROP TABLE "parking_spots";

-- DropEnum
DROP TYPE "otp_types";

-- DropEnum
DROP TYPE "roles";

-- DropEnum
DROP TYPE "user_status";

-- CreateTable
CREATE TABLE "parkings" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "number_of_available_space" INTEGER NOT NULL,
    "charging_fee_per_hour" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parkings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parkings_code_key" ON "parkings"("code");

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_parking_id_fkey" FOREIGN KEY ("parking_id") REFERENCES "parkings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
