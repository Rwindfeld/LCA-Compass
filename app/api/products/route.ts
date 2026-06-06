import { NextRequest, NextResponse } from "next/server"
import { matchProductSearch } from "@/lib/products/match-product-search"
import { createProductInvites, parseInviteEmails } from "@/lib/products/product-members"
import { prisma } from "@/lib/prisma"

const productListSelect = {
  id: true,
  name: true,
  description: true,
  productType: true,
  status: true,
  complianceScore: true,
  updatedAt: true,
} as const

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q")?.trim() ?? ""

    const user = await prisma.user.findUnique({
      where: { email: "demo@lca-compass.dk" },
      include: {
        products: {
          orderBy: { updatedAt: "desc" },
          select: productListSelect,
        },
      },
    })

    if (!user) {
      return NextResponse.json({ products: [] })
    }

    const products = q
      ? user.products.filter((p) => matchProductSearch(p, q))
      : user.products

    return NextResponse.json({ products })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, productType, description, ambitionLevel, inviteEmails } = body

    const user = await prisma.user.findUnique({
      where: { email: "demo@lca-compass.dk" },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const product = await prisma.product.create({
      data: {
        userId: user.id,
        name: name ?? "Nyt produkt",
        productType: productType ?? "OTHER",
        description,
        ambitionLevel: ambitionLevel ?? "SCREENING",
        status: "DRAFT",
        complianceScore: 0,
      },
    })

    const emails =
      typeof inviteEmails === "string"
        ? parseInviteEmails(inviteEmails)
        : Array.isArray(inviteEmails)
          ? inviteEmails.filter((e: unknown) => typeof e === "string")
          : []

    if (emails.length > 0) {
      await createProductInvites(product.id, emails)
    }

    return NextResponse.json({ product })
  } catch (error) {
    console.error("Create error:", error)
    return NextResponse.json({ error: "Create failed" }, { status: 500 })
  }
}
