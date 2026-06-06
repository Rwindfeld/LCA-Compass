import { prisma } from "@/lib/prisma"
import { DashboardClient } from "./DashboardClient"

async function getProducts() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "demo@lca-compass.dk" },
      include: {
        products: {
          orderBy: { updatedAt: "desc" },
          take: 10,
        },
      },
    })
    return user?.products ?? []
  } catch {
    return []
  }
}

export default async function DashboardPage() {
  const products = await getProducts()

  const stats = {
    total: products.length,
    avgCompliance:
      products.length > 0
        ? Math.round(
            products.reduce((sum, p) => sum + p.complianceScore, 0) /
              products.length
          )
        : 0,
    epdReady: products.filter((p) => p.status === "EPD_READY").length,
    missingFields: 5,
  }

  return <DashboardClient products={products} stats={stats} />
}
