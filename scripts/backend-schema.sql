-- Backend Management Schema for Desktop Interface
-- This extends the existing schema with new management features

-- Desktop Icons Management
CREATE TABLE IF NOT EXISTS desktop_icons (
  id SERIAL PRIMARY KEY,
  icon_type VARCHAR(50) NOT NULL, -- 'lucide', 'emoji', 'custom'
  icon_name VARCHAR(100) NOT NULL, -- 'Rocket', 'Gamepad2', etc.
  label VARCHAR(100) NOT NULL,
  window_id VARCHAR(50) NOT NULL, -- 'engineering', 'games', etc.
  position_x INTEGER DEFAULT 0,
  position_y INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Home Tab Icons Management
CREATE TABLE IF NOT EXISTS home_icons (
  id SERIAL PRIMARY KEY,
  icon_type VARCHAR(50) NOT NULL,
  icon_name VARCHAR(100) NOT NULL,
  label VARCHAR(100) NOT NULL,
  window_id VARCHAR(50) NOT NULL,
  color VARCHAR(20) DEFAULT 'blue-600', -- Tailwind color class
  size VARCHAR(10) DEFAULT 'large', -- 'small', 'large'
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Wallpaper Management
CREATE TABLE IF NOT EXISTS wallpapers (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL, -- 'gradient', 'image'
  name VARCHAR(100) NOT NULL,
  config JSONB NOT NULL, -- Store gradient config or image path
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social Media Icons Management
CREATE TABLE IF NOT EXISTS social_icons (
  id SERIAL PRIMARY KEY,
  platform VARCHAR(50) NOT NULL, -- 'youtube', 'discord', 'linkedin'
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
);

-- Content Sections Management (extend existing content table)
-- Add new sections for engineering, games, art
ALTER TABLE content ADD COLUMN IF NOT EXISTS icon_name VARCHAR(100);
ALTER TABLE content ADD COLUMN IF NOT EXISTS color VARCHAR(20) DEFAULT 'blue-600';
ALTER TABLE content ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Insert default desktop icons
INSERT INTO desktop_icons (icon_type, icon_name, label, window_id, position_x, position_y, order_index) VALUES
('lucide', 'Rocket', 'Engineering', 'engineering', 0, 0, 1),
('lucide', 'Gamepad2', 'Games', 'games', 0, 1, 2),
('lucide', 'Palette', 'Art', 'art', 0, 2, 3)
ON CONFLICT DO NOTHING;

-- Insert default home icons
INSERT INTO home_icons (icon_type, icon_name, label, window_id, color, size, order_index) VALUES
('lucide', 'User', 'About', 'about', 'blue-600', 'large', 1),
('lucide', 'Rocket', 'Engineering', 'engineering', 'orange-600', 'large', 2),
('lucide', 'Gamepad2', 'Games', 'games', 'green-600', 'large', 3),
('lucide', 'Palette', 'Art', 'art', 'purple-600', 'large', 4),
('lucide', 'Mail', 'Contact', 'contact', 'cyan-600', 'large', 5),
('lucide', 'HelpCircle', 'FAQ', 'faq', 'yellow-600', 'large', 6)
ON CONFLICT DO NOTHING;

-- Insert default social icons
INSERT INTO social_icons (platform, icon_name, label, url, color, position_x, position_y, order_index) VALUES
('youtube', 'Youtube', 'YouTube', 'https://youtube.com', 'red-500', 0, 0, 1),
('discord', 'MessageCircle', 'Discord', 'https://discord.com', 'indigo-500', 0, 1, 2),
('linkedin', 'User', 'LinkedIn', 'https://linkedin.com', 'blue-600', 0, 2, 3)
ON CONFLICT DO NOTHING;

-- Insert default wallpaper
INSERT INTO wallpapers (type, name, config, is_active) VALUES
('gradient', 'Default Blue Gradient', '{"type": "gradient", "from": "blue-400", "via": "blue-500", "to": "blue-600", "direction": "to-b"}', true)
ON CONFLICT DO NOTHING;

-- Insert default content sections
INSERT INTO content (section, title, content, icon_name, color, is_active) VALUES
('about', 'About Me', 'Welcome to my portfolio! I am a final year aerospace engineering student with a passion for technology, gaming, and digital art.', 'User', 'blue-600', true),
('contact', 'Get In Touch', 'Feel free to reach out to me through any of the following channels...', 'Mail', 'cyan-600', true),
('faq', 'Frequently Asked Questions', 'Here are some common questions about my work and background...', 'HelpCircle', 'yellow-600', true),
('engineering', 'Engineering Projects', 'Explore my engineering projects and technical work...', 'Rocket', 'orange-600', true),
('games', 'Game Development', 'Check out my game development projects and creative work...', 'Gamepad2', 'green-600', true),
('art', 'Digital Art', 'Browse through my digital art portfolio and creative projects...', 'Palette', 'purple-600', true)
ON CONFLICT (section) DO NOTHING;

