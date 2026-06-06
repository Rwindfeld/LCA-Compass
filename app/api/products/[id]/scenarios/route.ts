import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import {
  buildModifiedDataPayload,
  getBaselineGwp,
  type ScenarioLever,
} from "@/lib/lca/scenario-engine"

function parseProductJson(product: {
  goalScope: string | null
  lci: string | null
  lcia: string | null
  interpretation: string | null
}) {
  return {
    goalScope: product.goalScope ? JSON.parse(product.goalScope) : null,
    lci: product.lci ? JSON.parse(product.lci) : null,
    lcia: product.lcia ? JSON.parse(product.lcia) : null,
    interpretation: product.interpretation ? JSON.parse(product.interpretation) : null,
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const scenarios = await prisma.scenario.findMany({
      where: { productId: id },
      orderBy: [{ isBaseline: "desc" }, { createdAt: "asc" }],
    })
    return NextResponse.json({ scenarios })
  } catch (error) {
    console.error("Scenarios GET error:", error)
    return NextResponse.json({ error: "Failed to load scenarios" }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()
    const {
      name,
      description,
      lever = "gwp_overall",
      percentChange = 0,
      absoluteGwp,
      assumptions,
      isBaseline = false,
      fromTemplate,
    } = body as {
      name?: string
      description?: string
      lever?: ScenarioLever
      percentChange?: number
      absoluteGwp?: number
      assumptions?: string
      isBaseline?: boolean
      fromTemplate?: string
    }

    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const parsed = parseProductJson(product)
    const baselineGwp = getBaselineGwp(parsed)

    let scenarioName = name?.trim()
    let scenarioLever = lever
    let scenarioPct = percentChange
    let scenarioDesc = description?.trim() || null
    let scenarioAssumptions = assumptions

    if (fromTemplate) {
      const templates: Record<
        string,
        { name: string; lever: ScenarioLever; percentChange: number; assumptions: string }
      > = {
        green_electricity: {
          name: "Green electricity mix",
          lever: "use_energy",
          percentChange: -20,
          assumptions: "100% renewable electricity in use phase",
        },
        shorter_transport: {
          name: "Shorter transport",
          lever: "transport",
          percentChange: -40,
          assumptions: "Regional distribution, 40% shorter haul",
        },
        high_recycling: {
          name: "High end-of-life recycling",
          lever: "recycled_eol",
          percentChange: -30,
          assumptions: "Increased EOL recycling rate",
        },
        pessimistic: {
          name: "Pessimistic case",
          lever: "gwp_overall",
          percentChange: 15,
          assumptions: "Conservative assumptions across phases",
        },
      }
      const t = templates[fromTemplate]
      if (t) {
        scenarioName = scenarioName || t.name
        scenarioLever = t.lever
        scenarioPct = t.percentChange
        scenarioAssumptions = scenarioAssumptions || t.assumptions
      }
    }

    if (!scenarioName) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }

    if (isBaseline) {
      await prisma.scenario.updateMany({
        where: { productId: id, isBaseline: true },
        data: { isBaseline: false },
      })
    }

    const modifiedData = buildModifiedDataPayload(
      scenarioLever,
      scenarioPct,
      baselineGwp,
      scenarioAssumptions,
      absoluteGwp
    )

    const scenario = await prisma.scenario.create({
      data: {
        productId: id,
        name: scenarioName,
        description: scenarioDesc,
        isBaseline: Boolean(isBaseline),
        modifiedData,
      },
    })

    return NextResponse.json({ scenario }, { status: 201 })
  } catch (error) {
    console.error("Scenarios POST error:", error)
    return NextResponse.json({ error: "Failed to create scenario" }, { status: 500 })
  }
}

/** Ensure baseline scenario exists for product. */
export async function PUT(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await prisma.scenario.findFirst({
      where: { productId: id, isBaseline: true },
    })
    if (existing) {
      return NextResponse.json({ scenario: existing })
    }

    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const parsed = parseProductJson(product)
    const baselineGwp = getBaselineGwp(parsed)
    const modifiedData = buildModifiedDataPayload("gwp_overall", 0, baselineGwp, "Current LCA data")

    const scenario = await prisma.scenario.create({
      data: {
        productId: id,
        name: "Baseline",
        description: "Reference scenario from current product data",
        isBaseline: true,
        modifiedData,
      },
    })

    return NextResponse.json({ scenario })
  } catch (error) {
    console.error("Scenarios PUT error:", error)
    return NextResponse.json({ error: "Failed to init baseline" }, { status: 500 })
  }
}
