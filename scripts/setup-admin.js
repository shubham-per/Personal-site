const bcrypt = require('bcryptjs');
const { neon } = require('@neondatabase/serverless');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.log('Please set your DATABASE_URL environment variable and try again.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function setupAdmin() {
  try {
    console.log('🔧 Setting up admin user...');
    
    // Test database connection
    console.log('📡 Testing database connection...');
    await sql`SELECT 1`;
    console.log('✅ Database connection successful!');
    
    // Hash the password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Delete existing admin user if exists
    console.log('🗑️ Removing existing admin user...');
    await sql`DELETE FROM users WHERE email = 'admin@shubham.dev'`;
    
    // Insert new admin user
    console.log('👤 Creating new admin user...');
    await sql`
      INSERT INTO users (email, password_hash, role) 
      VALUES ('admin@shubham.dev', ${hashedPassword}, 'admin')
    `;
    
    console.log('\n🎉 Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email: admin@shubham.dev');
    console.log('🔑 Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🌐 You can now login to the admin panel at:');
    console.log('   http://localhost:3000/admin');
    console.log('\n📊 Features available:');
    console.log('   • Edit About, Contact, FAQ content');
    console.log('   • Add/Remove projects in Engineering, Games, Art');
    console.log('   • View visitor analytics and tracking');
    console.log('   • Manage project categories and tags');
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
    if (error.message.includes('relation "users" does not exist')) {
      console.log('\n💡 It looks like the database tables haven\'t been created yet.');
      console.log('   Please run the database setup scripts first:');
      console.log('   npm run db:setup');
    }
  }
}

setupAdmin(); 