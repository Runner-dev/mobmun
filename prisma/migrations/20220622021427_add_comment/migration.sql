-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Document" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "uploaded" BOOLEAN NOT NULL DEFAULT false,
    "sharingId" TEXT NOT NULL,
    "approvalStatus" INTEGER NOT NULL DEFAULT -1,
    "mediatorComment" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Document_sharingId_fkey" FOREIGN KEY ("sharingId") REFERENCES "Sharing" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Document" ("approvalStatus", "id", "name", "sharingId", "uploaded") SELECT "approvalStatus", "id", "name", "sharingId", "uploaded" FROM "Document";
DROP TABLE "Document";
ALTER TABLE "new_Document" RENAME TO "Document";
CREATE UNIQUE INDEX "Document_sharingId_key" ON "Document"("sharingId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
