import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const member = await prisma.productMember.findUnique({
      where: { inviteToken: token },
      include: { product: { select: { id: true, name: true } } },
    })
    if (!member) {
      return NextResponse.json({ error: "not_found" }, { status: 404 })
    }
    return NextResponse.json({
      email: member.email,
      role: member.role,
      status: member.status,
      productId: member.product.id,
      productName: member.product.name,
    })
  } catch (error) {
    console.error("Invite GET error:", error)
    return NextResponse.json({ error: "lookup_failed" }, { status: 500 })
  }
}

/** Demo: accept invite without real email auth. */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params
    const member = await prisma.productMember.update({
      where: { inviteToken: token },
      data: { status: "ACTIVE" },
      include: { product: { select: { id: true, name: true } } },
    })
    return NextResponse.json({
      ok: true,
      productId: member.product.id,
      productName: member.product.name,
    })
  } catch (error) {
    console.error("Invite accept error:", error)
    return NextResponse.json({ error: "accept_failed" }, { status: 500 })
  }
}
