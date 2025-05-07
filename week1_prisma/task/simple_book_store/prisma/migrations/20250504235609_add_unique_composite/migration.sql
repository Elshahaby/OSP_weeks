/*
  Warnings:

  - A unique constraint covering the columns `[title,auther,publishedAt]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Book_title_auther_publishedAt_key" ON "Book"("title", "auther", "publishedAt");
