import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  try {
    // Create users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Hash the password properly
    const hashedPassword = await bcrypt.hash("admin123", 10)

    // Delete existing admin user and create new one
    await sql`DELETE FROM users WHERE email = 'admin@shubham.dev'`

    await sql`
      INSERT INTO users (email, password_hash, role) 
      VALUES ('admin@shubham.dev', ${hashedPassword}, 'admin')
    `

    // Verify user was created
    const user = await sql`SELECT email, role, created_at FROM users WHERE email = 'admin@shubham.dev'`

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: user[0],
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    // Check if user exists
    const user = await sql`SELECT email, role, created_at FROM users WHERE email = 'admin@shubham.dev'`

    return NextResponse.json({
      userExists: user.length > 0,
      user: user[0] || null,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        userExists: false,
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}
