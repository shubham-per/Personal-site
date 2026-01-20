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
  return ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif" || ext === "svg"
}

export async function GET() {
  try {
    const windows = getWindows()
    return NextResponse.json(windows)
  } catch (error) {
    console.error("Windows GET error:", error)
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

    const body = await request.json()
    const windows = getWindows()
    const newId = windows.length ? Math.max(...windows.map((w) => w.id)) + 1 : 1

    const newWindow: WindowConfig = {
      id: newId,
      key: String(body.key || `custom-${newId}`),
      label: String(body.label || "New Window"),
      type: "custom",
      showOnDesktop: Boolean(body.showOnDesktop),
      showInHome: Boolean(body.showInHome ?? true),
      orderDesktop: Number.isFinite(body.orderDesktop) ? body.orderDesktop : newId,
      orderHome: Number.isFinite(body.orderHome) ? body.orderHome : newId,
      isHidden: false,
      content: typeof body.content === "string" ? body.content : "",
      icon: typeof body.icon === "string" ? body.icon : "folder",
      layout: body.layout === "projects" || body.layout === "faq" ? body.layout : "content",
    }

    windows.push(newWindow)
    saveWindows(windows)
    return NextResponse.json(newWindow, { status: 201 })
  } catch (error) {
    console.error("Windows POST error:", error)
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
          if (key === "id" || key === "orderDesktop" || key === "orderHome") {
            body[key] = Number(value)
          } else if (key === "showOnDesktop" || key === "showInHome" || key === "isHidden") {
            body[key] = value === "true"
          } else {
            body[key] = value
          }
        }
      }
    } else {
      body = await request.json()
    }

    const id = Number(body.id)
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const windows = getWindows()
    const index = windows.findIndex((w) => w.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Window not found" }, { status: 404 })
    }

    const current = windows[index]

    const updated: WindowConfig = {
      ...current,
      label: body.label ?? current.label,
      showOnDesktop: body.showOnDesktop ?? current.showOnDesktop,
      showInHome: body.showInHome ?? current.showInHome,
      orderDesktop:
        typeof body.orderDesktop === "number" && !Number.isNaN(body.orderDesktop)
          ? body.orderDesktop
          : current.orderDesktop,
      orderHome:
        typeof body.orderHome === "number" && !Number.isNaN(body.orderHome) ? body.orderHome : current.orderHome,
      isHidden: body.isHidden ?? current.isHidden,
      content: body.content ?? current.content,
      icon: body.icon ?? current.icon,
      layout: body.layout ?? current.layout,
      customIconUrl: body.customIconUrl !== undefined ? body.customIconUrl : current.customIconUrl,
    }

    windows[index] = updated
    saveWindows(windows)
    return NextResponse.json(updated)
  } catch (error) {
    console.error("Windows PUT error:", error)
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
    const id = Number(searchParams.get("id"))
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    const windows = getWindows()
    const index = windows.findIndex((w) => w.id === id)
    if (index === -1) {
      return NextResponse.json({ error: "Window not found" }, { status: 404 })
    }

    if (windows[index].type === "builtIn") {
      return NextResponse.json({ error: "Built-in windows cannot be deleted" }, { status: 400 })
    }

    const remaining = windows.filter((w) => w.id !== id)
    saveWindows(remaining)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Windows DELETE error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}


