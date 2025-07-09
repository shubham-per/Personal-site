import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Get user from database
    const users = await sql`SELECT * FROM users WHERE email = ${email}`
    const user = users[0]

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not found",
        debug: { email, userExists: false },
      })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)

    return NextResponse.json({
      success: isValidPassword,
      debug: {
        email,
        userExists: true,
        passwordMatch: isValidPassword,
        storedHash: user.password_hash.substring(0, 20) + "...", // Show partial hash for debugging
        userId: user.id,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    // Reset admin user with correct password hash
    const hashedPassword = await bcrypt.hash("admin123", 10)

    await sql`DELETE FROM users WHERE email = 'admin@shubham.dev'`

    await sql`
      INSERT INTO users (email, password_hash, role) 
      VALUES ('admin@shubham.dev', ${hashedPassword}, 'admin')
    `

    // Verify it works
    const testPassword = await bcrypt.compare("admin123", hashedPassword)

    return NextResponse.json({
      success: true,
      message: "Admin user recreated with proper password hash",
      passwordTest: testPassword,
      hash: hashedPassword.substring(0, 20) + "...",
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    )
  }
}
