/*
  Warnings:

  - You are about to drop the column `numTickets` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `priceSar` on the `IceSession` table. All the data in the column will be lost.
  - Added the required column `priceAdultSar` to the `IceSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceKidSar` to the `IceSession` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Booking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "numAdults" INTEGER NOT NULL DEFAULT 1,
    "numKids" INTEGER NOT NULL DEFAULT 0,
    "totalSar" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "IceSession" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Booking" ("createdAt", "id", "sessionId", "status", "totalSar", "userId") SELECT "createdAt", "id", "sessionId", "status", "totalSar", "userId" FROM "Booking";
DROP TABLE "Booking";
ALTER TABLE "new_Booking" RENAME TO "Booking";
CREATE TABLE "new_IceSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "capacity" INTEGER NOT NULL,
    "priceAdultSar" INTEGER NOT NULL,
    "priceKidSar" INTEGER NOT NULL,
    "womenOnly" BOOLEAN NOT NULL DEFAULT false,
    "kidsAllowed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_IceSession" ("capacity", "createdAt", "endTime", "id", "startTime", "titleAr", "titleEn", "type") SELECT "capacity", "createdAt", "endTime", "id", "startTime", "titleAr", "titleEn", "type" FROM "IceSession";
DROP TABLE "IceSession";
ALTER TABLE "new_IceSession" RENAME TO "IceSession";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
