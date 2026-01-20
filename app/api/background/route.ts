import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { BackgroundConfig, getBackground, updateBackground } from "@/lib/data"
import { requireAuth } from "@/lib/auth"

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads")

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

function getExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase()
}

function isAllowedImageType(filename: string) {
  const ext = getExtension(filename)
  return ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif"
}

export async function GET() {
  try {
    const config = getBackground()
    return NextResponse.json(config)
  } catch (error) {
    console.error("Background GET error:", error)
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

    const contentType = request.headers.get("content-type") || ""

    let config: BackgroundConfig

    if (contentType.startsWith("multipart/form-data")) {
      // @ts-ignore
      const formData = await request.formData()
      const type = formData.get("type") as string

      if (type === "image") {
        const file = formData.get("image") as File | null
        if (!file || typeof file === "string") {
          return NextResponse.json({ error: "Image file is required" }, { status: 400 })
        }
        if (!isAllowedImageType(file.name)) {
          return NextResponse.json({ error: "Unsupported image type" }, { status: 400 })
        }
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`
        const filePath = path.join(UPLOADS_DIR, filename)
        fs.writeFileSync(filePath, buffer)

        const overlay = formData.get("overlay") === "true"

        config = {
          type: "image",
          imageUrl: `/uploads/${filename}`,
          overlay,
        }
      } else if (type === "solid") {
        const color = (formData.get("color") as string) || "#000000"
        config = { type: "solid", color }
      } else {
        const from = (formData.get("from") as string) || "#60a5fa"
        const via = (formData.get("via") as string) || "#3b82f6"
        const to = (formData.get("to") as string) || "#2563eb"
        config = { type: "gradient", from, via, to }
      }
    } else {
      const body = await request.json()
      config = body as BackgroundConfig
    }

    updateBackground(config)
    return NextResponse.json(config)
  } catch (error) {
    console.error("Background POST error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


