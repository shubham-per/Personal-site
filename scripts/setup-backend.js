const { neon } = require("@neondatabase/serverless")

// Load environment variables manually
const fs = require('fs')
const path = require('path')

// Try to load .env file
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      process.env[key.trim()] = value.trim()
    }
  })
}

const sql = neon(process.env.DATABASE_URL)

async function setupBackend() {
  try {
    console.log("Setting up backend database schema...")
    
    // Create desktop_icons table
    await sql`
      CREATE TABLE IF NOT EXISTS desktop_icons (
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
      )
    `
    console.log("✓ Created desktop_icons table")

    // Create home_icons table
    await sql`
      CREATE TABLE IF NOT EXISTS home_icons (
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
      )
    `
    console.log("✓ Created home_icons table")

    // Create wallpapers table
    await sql`
      CREATE TABLE IF NOT EXISTS wallpapers (
        id SERIAL PRIMARY KEY,
        type VARCHAR(20) NOT NULL,
        name VARCHAR(100) NOT NULL,
        config JSONB NOT NULL,
        is_active BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `
    console.log("✓ Created wallpapers table")

    // Create social_icons table
    await sql`
      CREATE TABLE IF NOT EXISTS social_icons (
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
      )
    `
    console.log("✓ Created social_icons table")

    // Add new columns to content table
    await sql`
      ALTER TABLE content ADD COLUMN IF NOT EXISTS icon_name VARCHAR(100)
    `
    await sql`
      ALTER TABLE content ADD COLUMN IF NOT EXISTS color VARCHAR(20) DEFAULT 'blue-600'
    `
    await sql`
      ALTER TABLE content ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true
    `
    console.log("✓ Extended content table")

    // Insert default data
    console.log("Inserting default data...")

    // Default desktop icons
    await sql`
      INSERT INTO desktop_icons (icon_type, icon_name, label, window_id, position_x, position_y, order_index) VALUES
      ('lucide', 'Rocket', 'Engineering', 'engineering', 0, 0, 1),
      ('lucide', 'Gamepad2', 'Games', 'games', 0, 1, 2),
      ('lucide', 'Palette', 'Art', 'art', 0, 2, 3)
      ON CONFLICT DO NOTHING
    `

    // Default home icons
    await sql`
      INSERT INTO home_icons (icon_type, icon_name, label, window_id, color, size, order_index) VALUES
      ('lucide', 'User', 'About', 'about', 'blue-600', 'large', 1),
      ('lucide', 'Rocket', 'Engineering', 'engineering', 'orange-600', 'large', 2),
      ('lucide', 'Gamepad2', 'Games', 'games', 'green-600', 'large', 3),
      ('lucide', 'Palette', 'Art', 'art', 'purple-600', 'large', 4),
      ('lucide', 'Mail', 'Contact', 'contact', 'cyan-600', 'large', 5),
      ('lucide', 'HelpCircle', 'FAQ', 'faq', 'yellow-600', 'large', 6)
      ON CONFLICT DO NOTHING
    `

    // Default social icons
    await sql`
      INSERT INTO social_icons (platform, icon_name, label, url, color, position_x, position_y, order_index) VALUES
      ('youtube', 'Youtube', 'YouTube', 'https://youtube.com', 'red-500', 0, 0, 1),
      ('discord', 'MessageCircle', 'Discord', 'https://discord.com', 'indigo-500', 0, 1, 2),
      ('linkedin', 'User', 'LinkedIn', 'https://linkedin.com', 'blue-600', 0, 2, 3)
      ON CONFLICT DO NOTHING
    `

    // Default wallpaper
    await sql`
      INSERT INTO wallpapers (type, name, config, is_active) VALUES
      ('gradient', 'Default Blue Gradient', '{"type": "gradient", "from": "blue-400", "via": "blue-500", "to": "blue-600", "direction": "to-b"}', true)
      ON CONFLICT DO NOTHING
    `

    // Default content sections
    await sql`
      INSERT INTO content (section, title, content, icon_name, color, is_active) VALUES
      ('about', 'About Me', 'Welcome to my portfolio! I am a final year aerospace engineering student with a passion for technology, gaming, and digital art.', 'User', 'blue-600', true),
      ('contact', 'Get In Touch', 'Feel free to reach out to me through any of the following channels...', 'Mail', 'cyan-600', true),
      ('faq', 'Frequently Asked Questions', 'Here are some common questions about my work and background...', 'HelpCircle', 'yellow-600', true),
      ('engineering', 'Engineering Projects', 'Explore my engineering projects and technical work...', 'Rocket', 'orange-600', true),
      ('games', 'Game Development', 'Check out my game development projects and creative work...', 'Gamepad2', 'green-600', true),
      ('art', 'Digital Art', 'Browse through my digital art portfolio and creative projects...', 'Palette', 'purple-600', true)
      ON CONFLICT (section) DO NOTHING
    `

    console.log("✓ Inserted default data")
    console.log("\n🎉 Backend setup completed successfully!")
    console.log("You can now access the admin panel at: /admin/backend")

  } catch (error) {
    console.error("❌ Setup failed:", error)
    process.exit(1)
  }
}

setupBackend()
