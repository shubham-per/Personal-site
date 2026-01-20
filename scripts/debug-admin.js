// Debug Admin User - Check what's in the database
const { neon } = require('@neondatabase/serverless')

const DATABASE_URL = "postgresql://neondb_owner:npg_bChJUSxtc6H2@ep-tight-haze-ad4o5ots-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

async function debugAdmin() {
  try {
    const sql = neon(DATABASE_URL)
    console.log("🔍 Checking admin user in database...")

    // Check if users table exists
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'users'
    `
    
    if (tables.length === 0) {
      console.log("❌ Users table doesn't exist!")
      console.log("Creating users table...")
      
      await sql`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'admin',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `
      console.log("✅ Users table created")
    } else {
      console.log("✅ Users table exists")
    }

    // Check existing users
    const users = await sql`SELECT * FROM users`
    console.log("\n📋 Current users in database:")
    console.log(users)

    if (users.length === 0) {
      console.log("\n🔧 No users found. Creating admin user...")
      
      const bcrypt = require('bcryptjs')
      const password = 'admin123'
      const hashedPassword = await bcrypt.hash(password, 10)

      await sql`
        INSERT INTO users (email, password_hash, role) 
        VALUES ('admin@shubham.dev', ${hashedPassword}, 'admin')
      `
      
      console.log("✅ Admin user created!")
    }

    // Verify the user was created
    const adminUser = await sql`SELECT * FROM users WHERE email = 'admin@shubham.dev'`
    console.log("\n👤 Admin user details:")
    console.log(adminUser)

    console.log("\n🎉 Admin setup complete!")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("📧 Email: admin@shubham.dev")
    console.log("🔑 Password: admin123")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

  } catch (error) {
    console.log("❌ Error:", error.message)
  }
}

debugAdmin()


