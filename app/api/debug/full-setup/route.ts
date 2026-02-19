import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const sql = neon(process.env.DATABASE_URL!)

export async function POST() {
  const steps = []

  try {
    // Step 1: Check database connection
    steps.push("🔌 Testing database connection...")
    await sql`SELECT 1`
    steps.push("✅ Database connection successful")

    // Step 2: Create users table
    steps.push("📋 Creating users table...")
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    steps.push("✅ Users table created/verified")

    // Step 3: Clear existing admin user
    steps.push("🗑️ Removing existing admin user...")
    const deleteResult = await sql`DELETE FROM users WHERE email = 'admin@shubham.dev'`
    steps.push(`✅ Deleted ${deleteResult.length || 0} existing admin users`)

    // Step 4: Hash password
    steps.push("🔐 Hashing password...")
    const plainPassword = "admin123"
    const hashedPassword = await bcrypt.hash(plainPassword, 10)
    steps.push("✅ Password hashed successfully")

    // Step 5: Insert new admin user
    steps.push("👤 Creating new admin user...")
    await sql`
      INSERT INTO users (email, password_hash, role) 
      VALUES ('admin@shubham.dev', ${hashedPassword}, 'admin')
    `
    steps.push("✅ Admin user created")

    // Step 6: Verify user exists
    steps.push("🔍 Verifying user creation...")
    const users = await sql`SELECT id, email, role, created_at FROM users WHERE email = 'admin@shubham.dev'`
    if (users.length === 0) {
      throw new Error("User was not created properly")
    }
    steps.push("✅ User verified in database")

    // Step 7: Test password verification
    steps.push("🧪 Testing password verification...")
    const passwordTest = await bcrypt.compare(plainPassword, hashedPassword)
    if (!passwordTest) {
      throw new Error("Password verification failed")
    }
    steps.push("✅ Password verification successful")

    // Step 8: Test full login flow
    steps.push("🚀 Testing complete login flow...")
    const loginUser = await sql`SELECT * FROM users WHERE email = 'admin@shubham.dev'`
    const loginTest = await bcrypt.compare(plainPassword, loginUser[0].password_hash)
    if (!loginTest) {
      throw new Error("Full login flow failed")
    }
    steps.push("✅ Complete login flow successful")

    return NextResponse.json({
      success: true,
      message: "Admin setup completed successfully!",
      steps,
      credentials: {
        email: "admin@shubham.dev",
        password: "admin123",
      },
      user: users[0],
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    steps.push(`❌ Error: ${errorMessage}`)

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        steps,
        troubleshooting: {
          checkEnvironmentVariables: [
            "DATABASE_URL should be set from Neon integration",
            "JWT_SECRET should be set to any random string",
          ],
          commonIssues: [
            "Database connection failed - check DATABASE_URL",
            "Permission denied - check database permissions",
            "Table creation failed - check database schema permissions",
          ],
        },
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    // Just check current status
    const users = await sql`SELECT id, email, role, created_at FROM users WHERE email = 'admin@shubham.dev'`

    return NextResponse.json({
      userExists: users.length > 0,
      user: users[0] || null,
      databaseConnected: true,
      environmentVariables: {
        DATABASE_URL: !!process.env.DATABASE_URL,
        JWT_SECRET: !!process.env.JWT_SECRET,
      },
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      {
        userExists: false,
        databaseConnected: false,
        error: errorMessage,
        environmentVariables: {
          DATABASE_URL: !!process.env.DATABASE_URL,
          JWT_SECRET: !!process.env.JWT_SECRET,
        },
      },
      { status: 500 },
    )
  }
}
