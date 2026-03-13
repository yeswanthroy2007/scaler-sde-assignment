/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `DateOverride` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DateOverride_userId_date_key" ON "DateOverride"("userId", "date");
