import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; scenarioId: string }> }
) {
  try {
    const { id, scenarioId } = await params
    const scenario = await prisma.scenario.findFirst({
      where: { id: scenarioId, productId: id },
    })
    if (!scenario) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    if (scenario.isBaseline) {
      return NextResponse.json({ error: "Cannot delete baseline" }, { status: 400 })
    }

    await prisma.scenario.delete({ where: { id: scenarioId } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Scenario DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
  }
}
