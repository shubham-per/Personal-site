import { NextRequest, NextResponse } from "next/server"
import { createFaqItem, deleteFaqItem, getFaqItems, updateFaqItem } from "@/lib/data"
import { requireAuth } from "@/lib/auth"

export async function GET() {
  try {
    const items = getFaqItems().filter((item) => item.isActive)
    return NextResponse.json(items)
  } catch (error) {
    console.error("FAQ GET error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    try {
      requireAuth(request)
    } catch {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { question, answer, order, customTabKey } = await request.json()

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 },
      )
    }

    const item = createFaqItem({ question, answer, order, customTabKey })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("FAQ POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    try {
      requireAuth(request)
    } catch {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { id, ...data } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "FAQ ID is required" }, { status: 400 })
    }

    const updated = updateFaqItem(Number(id), data)
    if (!updated) {
      return NextResponse.json({ error: "FAQ item not found" }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error("FAQ PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    try {
      requireAuth(request)
    } catch {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "FAQ ID is required" }, { status: 400 })
    }

    const ok = deleteFaqItem(Number(id))
    if (!ok) {
      return NextResponse.json({ error: "FAQ item not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("FAQ DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


