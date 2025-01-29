/*
  Warnings:

  - You are about to drop the column `notes` on the `BackgroundInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BackgroundInfo" DROP COLUMN "notes";

-- CreateTable
CREATE TABLE "ChatContext" (
    "id" TEXT NOT NULL,
    "contactName" TEXT NOT NULL,
    "contactNotes" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatContext_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ChatContext_sessionId_idx" ON "ChatContext"("sessionId");
