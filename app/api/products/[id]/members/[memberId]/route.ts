import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const { id, memberId } = await params
    await prisma.productMember.deleteMany({
      where: { id: memberId, productId: id },
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Member DELETE error:", error)
    return NextResponse.json({ error: "Failed to remove" }, { status: 500 })
  }
}
