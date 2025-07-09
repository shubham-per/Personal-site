import { type NextRequest, NextResponse } from "next/server"
import { trackVisit, getAnalytics } from "@/lib/db"
import { requireAuth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"

    await trackVisit({
      ...data,
      ip_address: ip,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to track visit" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth()

    const { searchParams } = new URL(request.url)
    const days = Number.parseInt(searchParams.get("days") || "30")

    const analytics = await getAnalytics(days)
    return NextResponse.json(analytics)
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
