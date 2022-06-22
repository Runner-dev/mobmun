-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CorreiosElegantes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mensagem" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_CorreiosElegantes" ("id", "mensagem") SELECT "id", "mensagem" FROM "CorreiosElegantes";
DROP TABLE "CorreiosElegantes";
ALTER TABLE "new_CorreiosElegantes" RENAME TO "CorreiosElegantes";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
