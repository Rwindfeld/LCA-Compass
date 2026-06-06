import { PrismaClient } from "../generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import {
  getCurrentProductReport,
  persistVerifiedReport,
  resolveDocumentRegistry,
} from "../lib/lca/save-verified-report"

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" })
const prisma = new PrismaClient({ adapter })

async function main() {
  const productId = "cmpz7rwy00001uwoptlk83iu3"
  const r1 = await resolveDocumentRegistry(productId, false)
  console.log("resolve1", r1)
  await persistVerifiedReport({
    productId,
    productName: "Test",
    complianceScore: 100,
    locale: "da",
    format: "ISO_14044_FULL",
    htmlContent: "<html>v1</html>",
    documentId: r1.documentId,
    existingReportId: r1.existingReportId,
    version: r1.version,
  })
  const r2 = await resolveDocumentRegistry(productId, false)
  console.log("resolve2", r2)
  await persistVerifiedReport({
    productId,
    productName: "Test",
    complianceScore: 100,
    locale: "da",
    format: "ISO_14044_FULL",
    htmlContent: "<html>v2</html>",
    documentId: r2.documentId,
    existingReportId: r2.existingReportId,
    version: r2.version,
  })
  const cur = await getCurrentProductReport(productId)
  console.log("current", cur)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
