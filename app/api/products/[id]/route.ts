import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getCurrentProductReport } from "@/lib/lca/save-verified-report"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      select: { id: true, name: true },
    })
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    const report = await getCurrentProductReport(id)
    return NextResponse.json({
      productId: id,
      documentId: report?.documentId ?? null,
      version: report?.version ?? null,
    })
  } catch (error) {
    console.error("Product document lookup error:", error)
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { step, data } = await req.json()

    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { updatedAt: new Date() }

    if (step === "name" && data?.name) {
      updateData.name = data.name.trim()
    }

    if (step === 1 && data) {
      updateData.goalScope = JSON.stringify(data)
      if (data.ambitionLevel) updateData.ambitionLevel = data.ambitionLevel
    }

    if (step >= 2 && step <= 6 && data) {
      const existingLci = existing.lci ? JSON.parse(existing.lci) : {}
      const newLci = { ...existingLci, ...data }
      updateData.lci = JSON.stringify(newLci)
    }

    if (step === 7 && data?.lcia) {
      updateData.lcia = JSON.stringify(data.lcia)
    }

    if (step === 8 && data?.interpretation) {
      updateData.interpretation = JSON.stringify(data.interpretation)
    }

    if (step === 9 && data?.criticalReview) {
      updateData.criticalReview = JSON.stringify(data.criticalReview)
    }

    const product = await prisma.product.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await prisma.product.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 })
    }
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json({ error: "Delete failed" }, { status: 500 })
  }
}
