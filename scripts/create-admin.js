// Create Admin User - Run this to create admin login
const bcrypt = require('bcryptjs')
const { neon } = require('@neondatabase/serverless')

const DATABASE_URL = "postgresql://neondb_owner:npg_bChJUSxtc6H2@ep-tight-haze-ad4o5ots-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

async function createAdmin() {
  try {
    const sql = neon(DATABASE_URL)
    console.log("🔧 Creating admin user...")

    // Hash the password
    const password = 'admin123'
    const hashedPassword = await bcrypt.hash(password, 10)

    // Delete existing admin user if exists
    await sql`DELETE FROM users WHERE email = 'admin@shubham.dev'`

    // Insert new admin user
    await sql`
      INSERT INTO users (email, password_hash, role) 
      VALUES ('admin@shubham.dev', ${hashedPassword}, 'admin')
    `

    console.log("\n🎉 Admin user created successfully!")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("📧 Email: admin@shubham.dev")
    console.log("🔑 Password: admin123")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("\n🌐 You can now login to:")
    console.log("   http://localhost:3000/admin/backend")

  } catch (error) {
    console.log("❌ Error:", error.message)
  }
}

createAdmin()


