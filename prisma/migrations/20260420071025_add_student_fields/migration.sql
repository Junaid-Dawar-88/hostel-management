/*
  Warnings:

  - You are about to drop the column `guardian` on the `Student` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "rollNo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fatherName" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "guardPhone" TEXT,
    "cnic" TEXT,
    "email" TEXT,
    "course" TEXT,
    "feesPaid" BOOLEAN NOT NULL DEFAULT false,
    "roomId" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Student_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Student" ("course", "createdAt", "email", "feesPaid", "guardPhone", "id", "name", "phone", "rollNo", "roomId") SELECT "course", "createdAt", "email", "feesPaid", "guardPhone", "id", "name", "phone", "rollNo", "roomId" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_rollNo_key" ON "Student"("rollNo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
