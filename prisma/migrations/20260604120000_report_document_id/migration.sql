-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL DEFAULT '',
    "complianceScore" INTEGER NOT NULL DEFAULT 0,
    "version" INTEGER NOT NULL DEFAULT 1,
    "locale" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "generatedProse" TEXT,
    "htmlContent" TEXT,
    "pdfUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Report_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Report" ("id", "documentId", "productId", "productName", "complianceScore", "version", "locale", "format", "generatedProse", "htmlContent", "pdfUrl", "createdAt")
SELECT
    "id",
    upper(substr("id", 1, 4)) || '-' || upper(substr(hex(randomblob(2)), 1, 4)),
    "productId",
    '',
    0,
    "version",
    "locale",
    "format",
    "generatedProse",
    NULL,
    "pdfUrl",
    "createdAt"
FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
CREATE UNIQUE INDEX "Report_documentId_key" ON "Report"("documentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
