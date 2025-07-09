import { type NextRequest, NextResponse } from "next/server"
import { getContent, updateContent } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get("section")

    if (!section) {
      return NextResponse.json({ error: "Section required" }, { status: 400 })
    }

    const content = await getContent(section)
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    await requireAuth()

    const { section, title, content } = await request.json()

    if (!section || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await updateContent(section, title, content)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 })
  }
}
