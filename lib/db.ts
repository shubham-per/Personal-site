import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface User {
  id: number
  email: string
  password_hash: string
  role: string
  created_at: string
}

export interface Content {
  id: number
  section: string
  title: string
  content: string
  updated_at: string
}

export interface Project {
  id: number
  title: string
  description: string
  category: "engineering" | "games" | "art"
  image_url?: string
  tags: string[]
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Analytics {
  id: number
  visitor_id: string
  page: string
  action: string
  user_agent: string
  ip_address: string
  referrer?: string
  session_id: string
  timestamp: string
}

// Content functions
export async function getContent(section: string): Promise<Content | null> {
  const result = await sql`SELECT * FROM content WHERE section = ${section} LIMIT 1`
  return result[0] || null
}

export async function updateContent(section: string, title: string, content: string): Promise<void> {
  await sql`
    INSERT INTO content (section, title, content, updated_at)
    VALUES (${section}, ${title}, ${content}, NOW())
    ON CONFLICT (section) 
    DO UPDATE SET title = ${title}, content = ${content}, updated_at = NOW()
  `
}

// Project functions
export async function getProjects(category?: string): Promise<Project[]> {
  if (category) {
    return await sql`
      SELECT * FROM projects 
      WHERE category = ${category} AND is_active = true 
      ORDER BY order_index ASC, created_at DESC
    `
  }
  return await sql`
    SELECT * FROM projects 
    WHERE is_active = true 
    ORDER BY category, order_index ASC, created_at DESC
  `
}

export async function createProject(project: Omit<Project, "id" | "created_at" | "updated_at">): Promise<Project> {
  const result = await sql`
    INSERT INTO projects (title, description, category, image_url, tags, order_index, is_active)
    VALUES (${project.title}, ${project.description}, ${project.category}, ${project.image_url}, ${project.tags}, ${project.order_index}, ${project.is_active})
    RETURNING *
  `
  return result[0]
}

export async function updateProject(id: number, project: Partial<Project>): Promise<void> {
  const fields = Object.keys(project).filter((key) => key !== "id")
  if (fields.length === 0) return

  const setClause = fields.map((field) => `${field} = $${fields.indexOf(field) + 2}`).join(", ")
  const values = [id, ...fields.map((field) => (project as any)[field])]

  await sql`UPDATE projects SET ${sql.unsafe(setClause)}, updated_at = NOW() WHERE id = ${id}`
}

export async function deleteProject(id: number): Promise<void> {
  await sql`UPDATE projects SET is_active = false WHERE id = ${id}`
}

// Analytics functions
export async function trackVisit(data: Omit<Analytics, "id" | "timestamp">): Promise<void> {
  await sql`
    INSERT INTO analytics (visitor_id, page, action, user_agent, ip_address, referrer, session_id)
    VALUES (${data.visitor_id}, ${data.page}, ${data.action}, ${data.user_agent}, ${data.ip_address}, ${data.referrer}, ${data.session_id})
  `
}

export async function getAnalytics(days = 30) {
  const pageViews = await sql`
    SELECT page, COUNT(*) as views
    FROM analytics 
    WHERE timestamp > NOW() - INTERVAL '${days} days'
    GROUP BY page
    ORDER BY views DESC
  `

  const dailyVisits = await sql`
    SELECT DATE(timestamp) as date, COUNT(DISTINCT visitor_id) as unique_visitors, COUNT(*) as total_views
    FROM analytics 
    WHERE timestamp > NOW() - INTERVAL '${days} days'
    GROUP BY DATE(timestamp)
    ORDER BY date DESC
  `

  const topReferrers = await sql`
    SELECT referrer, COUNT(*) as visits
    FROM analytics 
    WHERE timestamp > NOW() - INTERVAL '${days} days' AND referrer IS NOT NULL
    GROUP BY referrer
    ORDER BY visits DESC
    LIMIT 10
  `

  return { pageViews, dailyVisits, topReferrers }
}

// User functions
export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`
  return result[0] || null
}
