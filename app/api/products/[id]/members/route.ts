import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { createProductInvites, parseInviteEmails } from "@/lib/products/product-members"
import type { ProductMemberRole } from "@/generated/prisma/client"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    if (!("productMember" in prisma) || !prisma.productMember) {
      console.error("Members GET: Prisma client missing productMember — run: npx prisma generate && npx prisma migrate deploy")
      return NextResponse.json({ members: [] })
    }
    const members = await prisma.productMember.findMany({
      where: { productId: id },
      orderBy: { createdAt: "asc" },
    })
    return NextResponse.json({ members })
  } catch (error) {
    console.error("Members GET error:", error)
    return NextResponse.json({ error: "Failed to load members" }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { emails: raw, email, role = "EDITOR" } = await req.json()

    const emails = Array.isArray(raw)
      ? raw.map((e: string) => e.trim().toLowerCase()).filter(Boolean)
      : email
        ? [String(email).trim().toLowerCase()]
        : typeof raw === "string"
          ? parseInviteEmails(raw)
          : []

    if (emails.length === 0) {
      return NextResponse.json({ error: "No valid emails" }, { status: 400 })
    }

    const members = await createProductInvites(
      id,
      emails,
      role as ProductMemberRole
    )

    return NextResponse.json({ members }, { status: 201 })
  } catch (error) {
    console.error("Members POST error:", error)
    return NextResponse.json({ error: "Failed to invite" }, { status: 500 })
  }
}
