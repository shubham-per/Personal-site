// Test Login - Verify admin credentials work
const bcrypt = require('bcryptjs')
const { neon } = require('@neondatabase/serverless')

const DATABASE_URL = "postgresql://neondb_owner:npg_bChJUSxtc6H2@ep-tight-haze-ad4o5ots-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

async function testLogin() {
  try {
    const sql = neon(DATABASE_URL)
    console.log("🔍 Testing admin login...")

    // Get admin user
    const user = await sql`SELECT * FROM users WHERE email = 'admin@shubham.dev'`
    
    if (user.length === 0) {
      console.log("❌ Admin user not found!")
      return
    }

    console.log("✅ Admin user found:")
    console.log(`   Email: ${user[0].email}`)
    console.log(`   Role: ${user[0].role}`)

    // Test password
    const password = 'admin123'
    const isValid = await bcrypt.compare(password, user[0].password_hash)
    
    if (isValid) {
      console.log("✅ Password is correct!")
      console.log("\n🎉 Login should work with:")
      console.log("   Email: admin@shubham.dev")
      console.log("   Password: admin123")
    } else {
      console.log("❌ Password is incorrect!")
    }

  } catch (error) {
    console.log("❌ Error:", error.message)
  }
}

testLogin()


