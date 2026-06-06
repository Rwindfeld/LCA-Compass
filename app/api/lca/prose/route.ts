import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateProse, type ProseSection } from "@/lib/ai"

export async function POST(req: NextRequest) {
  try {
    const { section, productId, variantSeed, locale = "da" } = await req.json()

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const parsedProduct = {
      ...product,
      goalScope: product.goalScope ? JSON.parse(product.goalScope) : null,
      lci: product.lci ? JSON.parse(product.lci) : null,
      lcia: product.lcia ? JSON.parse(product.lcia) : null,
      interpretation: product.interpretation ? JSON.parse(product.interpretation) : null,
    }

    const prose = await generateProse({
      section: section as ProseSection,
      productData: parsedProduct,
      locale: locale as "da" | "en",
      variantSeed,
    })

    return NextResponse.json({ prose })
  } catch (error) {
    console.error("Prose generation error:", error)
    return NextResponse.json({ error: "Failed to generate prose" }, { status: 500 })
  }
}
