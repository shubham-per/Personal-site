-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create content table for about, contact, faq sections
CREATE TABLE IF NOT EXISTS content (
  id SERIAL PRIMARY KEY,
  section VARCHAR(50) NOT NULL,
  title VARCHAR(255),
  content TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL, -- 'engineering', 'games', 'art'
  image_url VARCHAR(500),
  photos TEXT[], -- PostgreSQL array for additional photos
  keywords TEXT[], -- PostgreSQL array for SEO keywords
  project_link VARCHAR(500), -- URL to the project
  card_style VARCHAR(20) DEFAULT 'style1', -- Card display style
  tags TEXT[], -- PostgreSQL array for tags
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create analytics table for visitor tracking
CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  visitor_id VARCHAR(255),
  page VARCHAR(255),
  action VARCHAR(100),
  user_agent TEXT,
  ip_address INET,
  referrer VARCHAR(500),
  session_id VARCHAR(255),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create sessions table for admin sessions
CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
