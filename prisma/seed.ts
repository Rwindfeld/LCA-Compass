import { PrismaClient } from "../generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import {
  QR_SEED_PRODUCT,
  RFID_SEED_PRODUCT,
  TSHIRT_SEED_PRODUCT,
  PACKAGING_SEED_PRODUCT,
  STEEL_SEED_PRODUCT,
  LAPTOP_SEED_PRODUCT,
  CONCRETE_EPD_SEED_PRODUCT,
  WINDOW_EPD_SEED_PRODUCT,
} from "../lib/lca/seed-data"

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seeding database...")

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@lca-compass.dk" },
    update: {},
    create: {
      email: "demo@lca-compass.dk",
      name: "Rattana Nielsen",
      company: "Papas Papbar",
      role: "USER",
      locale: "da",
    },
  })

  console.log(`✅ Demo user: ${demoUser.email}`)

  // Clean up existing seed products
  await prisma.product.deleteMany({
    where: { userId: demoUser.id, isSeedData: true },
  })

  // Create QR product
  const qr = await prisma.product.create({
    data: {
      userId: demoUser.id,
      name: QR_SEED_PRODUCT.name,
      productType: QR_SEED_PRODUCT.productType,
      description: QR_SEED_PRODUCT.description,
      ambitionLevel: QR_SEED_PRODUCT.ambitionLevel,
      status: QR_SEED_PRODUCT.status,
      isSeedData: true,
      complianceScore: QR_SEED_PRODUCT.complianceScore,
      goalScope: JSON.stringify(QR_SEED_PRODUCT.goalScope),
      lci: JSON.stringify(QR_SEED_PRODUCT.lci),
      lcia: JSON.stringify(QR_SEED_PRODUCT.lcia),
      interpretation: JSON.stringify(QR_SEED_PRODUCT.interpretation),
    },
  })

  console.log(`✅ QR product: ${qr.name} (${qr.id})`)

  // Create RFID product
  const rfid = await prisma.product.create({
    data: {
      userId: demoUser.id,
      name: RFID_SEED_PRODUCT.name,
      productType: RFID_SEED_PRODUCT.productType,
      description: RFID_SEED_PRODUCT.description,
      ambitionLevel: RFID_SEED_PRODUCT.ambitionLevel,
      status: RFID_SEED_PRODUCT.status,
      isSeedData: true,
      complianceScore: RFID_SEED_PRODUCT.complianceScore,
      goalScope: JSON.stringify(RFID_SEED_PRODUCT.goalScope),
      lci: JSON.stringify(RFID_SEED_PRODUCT.lci),
      lcia: JSON.stringify(RFID_SEED_PRODUCT.lcia),
      interpretation: JSON.stringify(RFID_SEED_PRODUCT.interpretation),
    },
  })

  console.log(`✅ RFID product: ${rfid.name} (${rfid.id})`)

  // Create T-shirt (SCREENING ~40%)
  const tshirt = await prisma.product.create({
    data: {
      userId: demoUser.id,
      name: TSHIRT_SEED_PRODUCT.name,
      productType: TSHIRT_SEED_PRODUCT.productType,
      description: TSHIRT_SEED_PRODUCT.description,
      ambitionLevel: TSHIRT_SEED_PRODUCT.ambitionLevel,
      status: TSHIRT_SEED_PRODUCT.status,
      isSeedData: true,
      complianceScore: TSHIRT_SEED_PRODUCT.complianceScore,
      goalScope: JSON.stringify(TSHIRT_SEED_PRODUCT.goalScope),
      lci: JSON.stringify(TSHIRT_SEED_PRODUCT.lci),
      lcia: JSON.stringify(TSHIRT_SEED_PRODUCT.lcia),
      interpretation: JSON.stringify(TSHIRT_SEED_PRODUCT.interpretation),
    },
  })
  console.log(`✅ T-shirt product: ${tshirt.name} (${tshirt.id})`)

  // Create PLA packaging (DETAILED ~67%)
  const packaging = await prisma.product.create({
    data: {
      userId: demoUser.id,
      name: PACKAGING_SEED_PRODUCT.name,
      productType: PACKAGING_SEED_PRODUCT.productType,
      description: PACKAGING_SEED_PRODUCT.description,
      ambitionLevel: PACKAGING_SEED_PRODUCT.ambitionLevel,
      status: PACKAGING_SEED_PRODUCT.status,
      isSeedData: true,
      complianceScore: PACKAGING_SEED_PRODUCT.complianceScore,
      goalScope: JSON.stringify(PACKAGING_SEED_PRODUCT.goalScope),
      lci: JSON.stringify(PACKAGING_SEED_PRODUCT.lci),
      lcia: JSON.stringify(PACKAGING_SEED_PRODUCT.lcia),
      interpretation: JSON.stringify(PACKAGING_SEED_PRODUCT.interpretation),
    },
  })
  console.log(`✅ Packaging product: ${packaging.name} (${packaging.id})`)

  // Create Steel beam (CRITICAL_REVIEWED ~87%)
  const steel = await prisma.product.create({
    data: {
      userId: demoUser.id,
      name: STEEL_SEED_PRODUCT.name,
      productType: STEEL_SEED_PRODUCT.productType,
      description: STEEL_SEED_PRODUCT.description,
      ambitionLevel: STEEL_SEED_PRODUCT.ambitionLevel,
      status: STEEL_SEED_PRODUCT.status,
      isSeedData: true,
      complianceScore: STEEL_SEED_PRODUCT.complianceScore,
      goalScope: JSON.stringify(STEEL_SEED_PRODUCT.goalScope),
      lci: JSON.stringify(STEEL_SEED_PRODUCT.lci),
      lcia: JSON.stringify(STEEL_SEED_PRODUCT.lcia),
      interpretation: JSON.stringify(STEEL_SEED_PRODUCT.interpretation),
    },
  })
  console.log(`✅ Steel product: ${steel.name} (${steel.id})`)

  // Create Laptop (EPD_VERIFIED ~93%)
  const laptop = await prisma.product.create({
    data: {
      userId: demoUser.id,
      name: LAPTOP_SEED_PRODUCT.name,
      productType: LAPTOP_SEED_PRODUCT.productType,
      description: LAPTOP_SEED_PRODUCT.description,
      ambitionLevel: LAPTOP_SEED_PRODUCT.ambitionLevel,
      status: LAPTOP_SEED_PRODUCT.status,
      isSeedData: true,
      complianceScore: LAPTOP_SEED_PRODUCT.complianceScore,
      goalScope: JSON.stringify(LAPTOP_SEED_PRODUCT.goalScope),
      lci: JSON.stringify(LAPTOP_SEED_PRODUCT.lci),
      lcia: JSON.stringify(LAPTOP_SEED_PRODUCT.lcia),
      interpretation: JSON.stringify(LAPTOP_SEED_PRODUCT.interpretation),
    },
  })
  console.log(`✅ Laptop product: ${laptop.name} (${laptop.id})`)

  const concrete = await prisma.product.create({
    data: {
      userId: demoUser.id,
      name: CONCRETE_EPD_SEED_PRODUCT.name,
      productType: CONCRETE_EPD_SEED_PRODUCT.productType,
      description: CONCRETE_EPD_SEED_PRODUCT.description,
      ambitionLevel: CONCRETE_EPD_SEED_PRODUCT.ambitionLevel,
      status: CONCRETE_EPD_SEED_PRODUCT.status,
      isSeedData: true,
      complianceScore: CONCRETE_EPD_SEED_PRODUCT.complianceScore,
      goalScope: JSON.stringify(CONCRETE_EPD_SEED_PRODUCT.goalScope),
      lci: JSON.stringify(CONCRETE_EPD_SEED_PRODUCT.lci),
      lcia: JSON.stringify(CONCRETE_EPD_SEED_PRODUCT.lcia),
      interpretation: JSON.stringify(CONCRETE_EPD_SEED_PRODUCT.interpretation),
    },
  })
  console.log(`✅ Concrete EPD product: ${concrete.name} (${concrete.id})`)

  const window = await prisma.product.create({
    data: {
      userId: demoUser.id,
      name: WINDOW_EPD_SEED_PRODUCT.name,
      productType: WINDOW_EPD_SEED_PRODUCT.productType,
      description: WINDOW_EPD_SEED_PRODUCT.description,
      ambitionLevel: WINDOW_EPD_SEED_PRODUCT.ambitionLevel,
      status: WINDOW_EPD_SEED_PRODUCT.status,
      isSeedData: true,
      complianceScore: WINDOW_EPD_SEED_PRODUCT.complianceScore,
      goalScope: JSON.stringify(WINDOW_EPD_SEED_PRODUCT.goalScope),
      lci: JSON.stringify(WINDOW_EPD_SEED_PRODUCT.lci),
      lcia: JSON.stringify(WINDOW_EPD_SEED_PRODUCT.lcia),
      interpretation: JSON.stringify(WINDOW_EPD_SEED_PRODUCT.interpretation),
    },
  })
  console.log(`✅ Window EPD product: ${window.name} (${window.id})`)

  // Scenarier på laptop — låser op for sammenlignende rapport
  await prisma.scenario.createMany({
    data: [
      {
        productId: laptop.id,
        name: "Længere levetid (7 år)",
        description: "Brugsfase forlænget fra 5 til 7 år",
        isBaseline: true,
        modifiedData: JSON.stringify({
          lever: "use_energy",
          percentChange: -20,
          snapshotBaselineGwp: 412,
        }),
      },
      {
        productId: laptop.id,
        name: "DK el-mix (grøn strøm)",
        description: "Brugsfase med 100% vedvarende el",
        isBaseline: false,
        modifiedData: JSON.stringify({
          lever: "use_energy",
          percentChange: -35,
          snapshotBaselineGwp: 412,
        }),
      },
    ],
  })
  console.log(`✅ Laptop scenarios: 2`)

  console.log("🎉 Seed complete!")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
