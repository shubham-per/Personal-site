import { NextRequest, NextResponse } from "next/server"
import { getWindows, saveWindows, WindowConfig } from "@/lib/data"
import { requireAuth } from "@/lib/auth"
import fs from "fs"
import path from "path"

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads")

function getExtension(filename: string) {
  return filename.split(".").pop()?.toLowerCase()
}

function isAllowedImageType(filename: string) {
  const ext = getExtension(filename)
  return ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif" || ext === "svg" || ext === "webp"
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")
    const windows = getWindows()
    const custom = windows.filter((w) => w.type === "custom")
    
    if (key) {
      const window = custom.find((w) => w.key === key)
      if (!window) {
        return NextResponse.json({ error: "Custom panel not found" }, { status: 404 })
      }
      return NextResponse.json(window)
    }
    
    return NextResponse.json(custom)
  } catch (error) {
    console.error("Custom Panels GET error:", error)
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

    const contentType = request.headers.get("content-type") || ""
    let body: any = {}

    if (contentType.startsWith("multipart/form-data")) {
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true })
      }

      const formData = await request.formData()
      for (const [key, value] of formData.entries()) {
        if (value instanceof File && key === "icon" && isAllowedImageType(value.name)) {
          const arrayBuffer = await value.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          const filename = `${Date.now()}-${value.name.replace(/[^a-zA-Z0-9.]/g, "_")}`
          const filePath = path.join(UPLOADS_DIR, filename)
          fs.writeFileSync(filePath, buffer)
          body.customIconUrl = `/uploads/${filename}`
        } else if (typeof value === "string") {
          body[key] = value
        }
      }
    } else {
      body = await request.json()
    }

    const key = String(body.key)
    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 })
    }

    const windows = getWindows()
    const index = windows.findIndex((w) => w.key === key && w.type === "custom")
    if (index === -1) {
      return NextResponse.json({ error: "Custom panel not found" }, { status: 404 })
    }

    const current = windows[index]

    const updated: WindowConfig = {
      ...current,
      label: body.label ?? current.label,
      content: body.content ?? current.content,
      layout: body.layout ?? current.layout,
      icon: body.icon ?? current.icon,
      customIconUrl: body.customIconUrl !== undefined ? body.customIconUrl : current.customIconUrl,
    }

    windows[index] = updated
    saveWindows(windows)
    return NextResponse.json(updated)
  } catch (error) {
    console.error("Custom Panels PUT error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

