// Easy Backend Setup - One Click Solution
// Just run: node scripts/easy-setup.js

const { neon } = require("@neondatabase/serverless")

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.log("❌ DATABASE_URL not found!")
  console.log("Please make sure you have a .env.local file with your DATABASE_URL")
  console.log("Example: DATABASE_URL=postgresql://username:password@host/database")
  process.exit(1)
}

const sql = neon(DATABASE_URL)

async function easySetup() {
  console.log("🚀 Starting easy backend setup...")
  console.log("This will create all the tables and data you need!")
  
  try {
    // Step 1: Create all tables
    console.log("\n📋 Creating database tables...")
    
    await sql`CREATE TABLE IF NOT EXISTS desktop_icons (
      id SERIAL PRIMARY KEY,
      icon_type VARCHAR(50) NOT NULL,
      icon_name VARCHAR(100) NOT NULL,
      label VARCHAR(100) NOT NULL,
      window_id VARCHAR(50) NOT NULL,
      position_x INTEGER DEFAULT 0,
      position_y INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
    console.log("✅ Desktop icons table created")

    await sql`CREATE TABLE IF NOT EXISTS home_icons (
      id SERIAL PRIMARY KEY,
      icon_type VARCHAR(50) NOT NULL,
      icon_name VARCHAR(100) NOT NULL,
      label VARCHAR(100) NOT NULL,
      window_id VARCHAR(50) NOT NULL,
      color VARCHAR(20) DEFAULT 'blue-600',
      size VARCHAR(10) DEFAULT 'large',
      is_active BOOLEAN DEFAULT true,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
    console.log("✅ Home icons table created")

    await sql`CREATE TABLE IF NOT EXISTS wallpapers (
      id SERIAL PRIMARY KEY,
      type VARCHAR(20) NOT NULL,
      name VARCHAR(100) NOT NULL,
      config JSONB NOT NULL,
      is_active BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
    console.log("✅ Wallpapers table created")

    await sql`CREATE TABLE IF NOT EXISTS social_icons (
      id SERIAL PRIMARY KEY,
      platform VARCHAR(50) NOT NULL,
      icon_name VARCHAR(100) NOT NULL,
      label VARCHAR(100) NOT NULL,
      url VARCHAR(500) NOT NULL,
      color VARCHAR(20) DEFAULT 'white',
      position_x INTEGER DEFAULT 0,
      position_y INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
    console.log("✅ Social icons table created")

    // Step 2: Add columns to existing content table
    console.log("\n🔧 Updating existing tables...")
    
    try {
      await sql`ALTER TABLE content ADD COLUMN icon_name VARCHAR(100)`
      console.log("✅ Added icon_name to content table")
    } catch (e) {
      console.log("ℹ️  icon_name column already exists")
    }
    
    try {
      await sql`ALTER TABLE content ADD COLUMN color VARCHAR(20) DEFAULT 'blue-600'`
      console.log("✅ Added color to content table")
    } catch (e) {
      console.log("ℹ️  color column already exists")
    }
    
    try {
      await sql`ALTER TABLE content ADD COLUMN is_active BOOLEAN DEFAULT true`
      console.log("✅ Added is_active to content table")
    } catch (e) {
      console.log("ℹ️  is_active column already exists")
    }

    // Step 3: Insert default data
    console.log("\n📝 Adding default data...")

    // Desktop icons
    await sql`INSERT INTO desktop_icons (icon_type, icon_name, label, window_id, position_x, position_y, order_index) VALUES
      ('lucide', 'Rocket', 'Engineering', 'engineering', 0, 0, 1),
      ('lucide', 'Gamepad2', 'Games', 'games', 0, 1, 2),
      ('lucide', 'Palette', 'Art', 'art', 0, 2, 3)
      ON CONFLICT DO NOTHING`
    console.log("✅ Desktop icons added")

    // Home icons
    await sql`INSERT INTO home_icons (icon_type, icon_name, label, window_id, color, size, order_index) VALUES
      ('lucide', 'User', 'About', 'about', 'blue-600', 'large', 1),
      ('lucide', 'Rocket', 'Engineering', 'engineering', 'orange-600', 'large', 2),
      ('lucide', 'Gamepad2', 'Games', 'games', 'green-600', 'large', 3),
      ('lucide', 'Palette', 'Art', 'art', 'purple-600', 'large', 4),
      ('lucide', 'Mail', 'Contact', 'contact', 'cyan-600', 'large', 5),
      ('lucide', 'HelpCircle', 'FAQ', 'faq', 'yellow-600', 'large', 6)
      ON CONFLICT DO NOTHING`
    console.log("✅ Home icons added")

    // Social icons
    await sql`INSERT INTO social_icons (platform, icon_name, label, url, color, position_x, position_y, order_index) VALUES
      ('youtube', 'Youtube', 'YouTube', 'https://youtube.com', 'red-500', 0, 0, 1),
      ('discord', 'MessageCircle', 'Discord', 'https://discord.com', 'indigo-500', 0, 1, 2),
      ('linkedin', 'User', 'LinkedIn', 'https://linkedin.com', 'blue-600', 0, 2, 3)
      ON CONFLICT DO NOTHING`
    console.log("✅ Social icons added")

    // Wallpaper
    await sql`INSERT INTO wallpapers (type, name, config, is_active) VALUES
      ('gradient', 'Default Blue Gradient', '{"type": "gradient", "from": "blue-400", "via": "blue-500", "to": "blue-600", "direction": "to-b"}', true)
      ON CONFLICT DO NOTHING`
    console.log("✅ Default wallpaper added")

    // Content sections
    await sql`INSERT INTO content (section, title, content, icon_name, color, is_active) VALUES
      ('about', 'About Me', 'Welcome to my portfolio! I am a final year aerospace engineering student with a passion for technology, gaming, and digital art.', 'User', 'blue-600', true),
      ('contact', 'Get In Touch', 'Feel free to reach out to me through any of the following channels...', 'Mail', 'cyan-600', true),
      ('faq', 'Frequently Asked Questions', 'Here are some common questions about my work and background...', 'HelpCircle', 'yellow-600', true),
      ('engineering', 'Engineering Projects', 'Explore my engineering projects and technical work...', 'Rocket', 'orange-600', true),
      ('games', 'Game Development', 'Check out my game development projects and creative work...', 'Gamepad2', 'green-600', true),
      ('art', 'Digital Art', 'Browse through my digital art portfolio and creative projects...', 'Palette', 'purple-600', true)
      ON CONFLICT (section) DO NOTHING`
    console.log("✅ Content sections added")

    // Success!
    console.log("\n🎉 SUCCESS! Everything is set up!")
    console.log("\n📋 What you can now do:")
    console.log("1. Go to /admin/backend to manage your desktop")
    console.log("2. Control which icons appear on desktop")
    console.log("3. Manage home tab icons")
    console.log("4. Change wallpapers")
    console.log("5. Edit content for about, engineering, games, art, contact, faq")
    console.log("\n✨ Your backend is ready to use!")

  } catch (error) {
    console.log("\n❌ Something went wrong:")
    console.log(error.message)
    console.log("\n💡 Try running this command again, or check your DATABASE_URL")
  }
}

// Run the setup
easySetup()


