/*
  Warnings:

  - You are about to drop the `oTP` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('DISABLED', 'ENABLED');

-- CreateEnum
CREATE TYPE "otp_types" AS ENUM ('ACTIVATION', 'RESET');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "status" "user_status" NOT NULL DEFAULT 'DISABLED';

-- DropTable
DROP TABLE "oTP";

-- CreateTable
CREATE TABLE "otps" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "type" "otp_types" NOT NULL DEFAULT 'ACTIVATION',

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);
