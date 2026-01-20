import fs from "fs"
import path from "path"

const DATA_DIR = path.join(process.cwd(), "data")
const CONTENT_FILE = path.join(DATA_DIR, "content.json")
const ANALYTICS_FILE = path.join(DATA_DIR, "analytics.json")
const USERS_FILE = path.join(DATA_DIR, "users.json")
const FAQ_FILE = path.join(DATA_DIR, "faq.json")
const BACKGROUND_FILE = path.join(DATA_DIR, "background.json")
const WINDOWS_FILE = path.join(DATA_DIR, "windows.json")

type ContentEntry = {
  id: number
  section: string
  title: string
  content: string
  updatedAt: string
}

type AnalyticsEvent = {
  id: number
  visitorId: string
  page: string
  action: string
  userAgent: string
  ipAddress: string
  referrer?: string
  sessionId: string
  timestamp: string
}

export type FaqItem = {
  id: number
  question: string
  answer: string
  order: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  customTabKey?: string // For custom tab FAQ items
}

type UserJson = {
  id: number
  email: string
  passwordHash: string
  role: string
  createdAt: string
}

export type BackgroundConfig =
  | {
      type: "solid"
      color: string
    }
  | {
      type: "gradient"
      from: string
      via?: string
      to: string
    }
  | {
      type: "image"
      imageUrl: string
      overlay?: boolean
    }

export type WindowConfig = {
  id: number
  key: string
  label: string
  type: "builtIn" | "custom"
  showOnDesktop: boolean
  showInHome: boolean
  orderDesktop: number
  orderHome: number
  isHidden: boolean
  content?: string // for custom windows
  icon?: string // optional icon name for custom/built-in mapping (lucide icon name)
  customIconUrl?: string // uploaded custom icon image URL
  layout?: "content" | "projects" | "faq" // how the window should behave (currently used for custom)
}

function ensureDirAndFile(filePath: string, defaultContent: string) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, defaultContent)
  }
}

function readJson<T>(filePath: string, defaultValue: T): T {
  ensureDirAndFile(filePath, JSON.stringify(defaultValue, null, 2))
  const raw = fs.readFileSync(filePath, "utf8")
  try {
    return JSON.parse(raw) as T
  } catch {
    return defaultValue
  }
}

function writeJson<T>(filePath: string, data: T) {
  ensureDirAndFile(filePath, JSON.stringify(data, null, 2))
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
}

// ---------- CONTENT (about / contact / faq summary) ----------

export function getContent(section: string): ContentEntry | null {
  const entries = readJson<ContentEntry[]>(CONTENT_FILE, [])
  const entry = entries.find((c) => c.section === section)
  return entry || null
}

export function updateContent(section: string, title: string, content: string): boolean {
  const entries = readJson<ContentEntry[]>(CONTENT_FILE, [])
  const now = new Date().toISOString()
  const existingIndex = entries.findIndex((c) => c.section === section)

  if (existingIndex >= 0) {
    entries[existingIndex] = {
      ...entries[existingIndex],
      section,
      title,
      content,
      updatedAt: now,
    }
  } else {
    const newId = entries.length ? Math.max(...entries.map((e) => e.id)) + 1 : 1
    entries.push({
      id: newId,
      section,
      title,
      content,
      updatedAt: now,
    })
  }

  writeJson(CONTENT_FILE, entries)
  return true
}

// ---------- FAQ (advanced, multi-question) ----------

function readFaqItems(): FaqItem[] {
  const items = readJson<FaqItem[]>(FAQ_FILE, [])
  return items.sort((a, b) => a.order - b.order || a.id - b.id)
}

function writeFaqItems(items: FaqItem[]) {
  writeJson(FAQ_FILE, items)
}

function syncFaqSummaryContent(items: FaqItem[]) {
  if (!items.length) {
    return
  }
  const lines: string[] = []
  for (const item of items.filter((i) => i.isActive)) {
    lines.push(`Q: ${item.question}`)
    lines.push(`A: ${item.answer}`)
    lines.push("") // blank line between questions
  }
  const summary = lines.join("\n").trim()
  updateContent("faq", "Frequently Asked Questions", summary || "FAQ will be updated soon.")
}

export function getFaqItems(): FaqItem[] {
  return readFaqItems()
}

export function createFaqItem(data: { question: string; answer: string; order?: number; customTabKey?: string }): FaqItem {
  const items = readFaqItems()
  const now = new Date().toISOString()
  const newId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1
  const order = typeof data.order === "number" ? data.order : items.length + 1

  const newItem: FaqItem = {
    id: newId,
    question: data.question,
    answer: data.answer,
    order,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    customTabKey: data.customTabKey,
  }

  const nextItems = [...items, newItem]
  writeFaqItems(nextItems)
  syncFaqSummaryContent(nextItems)

  return newItem
}

export function updateFaqItem(id: number, data: Partial<Omit<FaqItem, "id" | "createdAt">>): FaqItem | null {
  const items = readFaqItems()
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return null

  const now = new Date().toISOString()
  const updated: FaqItem = {
    ...items[index],
    ...data,
    id,
    updatedAt: now,
  }

  const nextItems = [...items]
  nextItems[index] = updated
  writeFaqItems(nextItems)
  syncFaqSummaryContent(nextItems)

  return updated
}

export function deleteFaqItem(id: number): boolean {
  const items = readFaqItems()
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return false

  const nextItems = items.filter((i) => i.id !== id)
  writeFaqItems(nextItems)
  syncFaqSummaryContent(nextItems)
  return true
}

// ---------- ANALYTICS ----------

export function trackVisit(data: {
  visitorId: string
  page: string
  action: string
  userAgent: string
  ipAddress: string
  referrer?: string
  sessionId: string
}): void {
  const events = readJson<AnalyticsEvent[]>(ANALYTICS_FILE, [])
  const newId = events.length ? Math.max(...events.map((e) => e.id)) + 1 : 1
  const now = new Date().toISOString()

  const event: AnalyticsEvent = {
    id: newId,
    visitorId: data.visitorId,
    page: data.page,
    action: data.action,
    userAgent: data.userAgent,
    ipAddress: data.ipAddress,
    referrer: data.referrer,
    sessionId: data.sessionId,
    timestamp: now,
  }

  events.push(event)
  writeJson(ANALYTICS_FILE, events)
}

export function getAnalytics(days = 30) {
  const events = readJson<AnalyticsEvent[]>(ANALYTICS_FILE, [])
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000

  const recent = events.filter((e) => {
    const ts = new Date(e.timestamp).getTime()
    return !Number.isNaN(ts) && ts >= cutoff
  })

  // Page views per page
  const pageViewMap = new Map<string, number>()
  for (const e of recent) {
    const page = e.page || "unknown"
    pageViewMap.set(page, (pageViewMap.get(page) || 0) + 1)
  }
  const pageViews = Array.from(pageViewMap.entries()).map(([page, views]) => ({ page, views }))

  // Daily visits: unique visitors + total views per day
  const dailyMap = new Map<
    string,
    {
      visitors: Set<string>
      totalViews: number
    }
  >()

  for (const e of recent) {
    const date = new Date(e.timestamp).toISOString().slice(0, 10)
    if (!dailyMap.has(date)) {
      dailyMap.set(date, { visitors: new Set(), totalViews: 0 })
    }
    const bucket = dailyMap.get(date)!
    bucket.visitors.add(e.visitorId)
    bucket.totalViews += 1
  }

  const dailyVisits = Array.from(dailyMap.entries())
    .map(([date, bucket]) => ({
      date,
      unique_visitors: bucket.visitors.size,
      total_views: bucket.totalViews,
    }))
    .sort((a, b) => (a.date < b.date ? -1 : 1))

  // Top referrers
  const refMap = new Map<string, number>()
  for (const e of recent) {
    if (!e.referrer) continue
    const ref = e.referrer
    refMap.set(ref, (refMap.get(ref) || 0) + 1)
  }

  const topReferrers = Array.from(refMap.entries())
    .map(([referrer, visits]) => ({ referrer, visits }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10)

  return { pageViews, dailyVisits, topReferrers }
}

// ---------- USERS (admin auth) ----------

export async function getUserByEmail(email: string) {
  const users = readJson<UserJson[]>(USERS_FILE, [])
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    password_hash: user.passwordHash,
    role: user.role,
    created_at: user.createdAt,
  }
}

// ---------- BACKGROUND (homepage) ----------

const defaultBackground: BackgroundConfig = {
  type: "gradient",
  from: "#60a5fa", // blue-400
  via: "#3b82f6", // blue-500
  to: "#2563eb", // blue-600
}

export function getBackground(): BackgroundConfig {
  return readJson<BackgroundConfig>(BACKGROUND_FILE, defaultBackground)
}

export function updateBackground(config: BackgroundConfig): void {
  writeJson(BACKGROUND_FILE, config)
}

// ---------- WINDOWS (desktop/home tabs) ----------

function defaultWindows(): WindowConfig[] {
  return [
    {
      id: 1,
      key: "about",
      label: "about",
      type: "builtIn",
      showOnDesktop: false,
      showInHome: true,
      orderDesktop: 1,
      orderHome: 1,
      isHidden: false,
      icon: "user",
      layout: "content",
    },
    {
      id: 2,
      key: "engineering",
      label: "engineering",
      type: "builtIn",
      showOnDesktop: true,
      showInHome: true,
      orderDesktop: 2,
      orderHome: 2,
      isHidden: false,
      icon: "rocket",
      layout: "projects",
    },
    {
      id: 3,
      key: "games",
      label: "games",
      type: "builtIn",
      showOnDesktop: true,
      showInHome: true,
      orderDesktop: 3,
      orderHome: 3,
      isHidden: false,
      icon: "gamepad2",
      layout: "projects",
    },
    {
      id: 4,
      key: "art",
      label: "art",
      type: "builtIn",
      showOnDesktop: true,
      showInHome: true,
      orderDesktop: 4,
      orderHome: 4,
      isHidden: false,
      icon: "palette",
      layout: "projects",
    },
    {
      id: 5,
      key: "contact",
      label: "contact",
      type: "builtIn",
      showOnDesktop: false,
      showInHome: true,
      orderDesktop: 5,
      orderHome: 5,
      isHidden: false,
      icon: "mail",
      layout: "content",
    },
    {
      id: 6,
      key: "faq",
      label: "faq",
      type: "builtIn",
      showOnDesktop: false,
      showInHome: true,
      orderDesktop: 6,
      orderHome: 6,
      isHidden: false,
      icon: "help-circle",
      layout: "faq",
    },
  ]
}

export function getWindows(): WindowConfig[] {
  const windows = readJson<WindowConfig[]>(WINDOWS_FILE, defaultWindows())
  return windows.sort((a, b) => a.id - b.id)
}

export function saveWindows(windows: WindowConfig[]): void {
  writeJson(WINDOWS_FILE, windows)
}



