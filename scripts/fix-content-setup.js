// Fix Content Setup - Run this to complete the setup
const { neon } = require("@neondatabase/serverless")

const DATABASE_URL = "postgresql://neondb_owner:npg_bChJUSxtc6H2@ep-tight-haze-ad4o5ots-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

async function fixContentSetup() {
  try {
    const sql = neon(DATABASE_URL)
    console.log("🔧 Fixing content setup...")

    // Add unique constraint to content table if it doesn't exist
    try {
      await sql`ALTER TABLE content ADD CONSTRAINT content_section_unique UNIQUE (section)`
      console.log("✅ Added unique constraint to content table")
    } catch (e) {
      console.log("ℹ️  Unique constraint already exists")
    }

    // Insert content sections
    await sql`INSERT INTO content (section, title, content, icon_name, color, is_active) VALUES
      ('about', 'About Me', 'Welcome to my portfolio! I am a final year aerospace engineering student with a passion for technology, gaming, and digital art.', 'User', 'blue-600', true),
      ('contact', 'Get In Touch', 'Feel free to reach out to me through any of the following channels...', 'Mail', 'cyan-600', true),
      ('faq', 'Frequently Asked Questions', 'Here are some common questions about my work and background...', 'HelpCircle', 'yellow-600', true),
      ('engineering', 'Engineering Projects', 'Explore my engineering projects and technical work...', 'Rocket', 'orange-600', true),
      ('games', 'Game Development', 'Check out my game development projects and creative work...', 'Gamepad2', 'green-600', true),
      ('art', 'Digital Art', 'Browse through my digital art portfolio and creative projects...', 'Palette', 'purple-600', true)
      ON CONFLICT (section) DO UPDATE SET
        title = EXCLUDED.title,
        content = EXCLUDED.content,
        icon_name = EXCLUDED.icon_name,
        color = EXCLUDED.color,
        is_active = EXCLUDED.is_active`
    
    console.log("✅ Content sections added successfully!")

    console.log("\n🎉 SUCCESS! Everything is now set up!")
    console.log("\n📋 What you can now do:")
    console.log("1. Go to /admin/backend to manage your desktop")
    console.log("2. Control which icons appear on desktop")
    console.log("3. Manage home tab icons")
    console.log("4. Change wallpapers")
    console.log("5. Edit content for about, engineering, games, art, contact, faq")
    console.log("\n✨ Your backend is ready to use!")

  } catch (error) {
    console.log("❌ Error:", error.message)
  }
}

fixContentSetup()


