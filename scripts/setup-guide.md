# Database Setup Guide

## Step 1: Set up your database

You have several options for setting up your database:

### Option A: Use Neon (Recommended - Free tier available)
1. Go to [neon.tech](https://neon.tech)
2. Create a free account
3. Create a new project
4. Copy the connection string (it looks like: `postgresql://username:password@host:port/database`)

### Option B: Use Supabase (Free tier available)
1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to Settings > Database
5. Copy the connection string

### Option C: Use Railway (Free tier available)
1. Go to [railway.app](https://railway.app)
2. Create a free account
3. Create a new PostgreSQL service
4. Copy the connection string

## Step 2: Create environment variables

Create a `.env.local` file in your project root with:

```env
# Database Configuration
DATABASE_URL="your-database-connection-string-here"

# JWT Secret for authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"
```

## Step 3: Set up database tables

Once you have your database URL, run the SQL scripts in the `scripts/` folder:

1. `create-tables.sql` - Creates all necessary tables
2. `seed-data.sql` - Adds sample data (optional)

## Step 4: Create admin user

After setting up the database, run:

```bash
npm run admin:setup
```

## Step 5: Access your admin panel

1. Start your development server: `npm run dev`
2. Go to: `http://localhost:3000/admin`
3. Login with:
   - Email: `admin@shubham.dev`
   - Password: `admin123`

## Troubleshooting

### "DATABASE_URL not set" error
- Make sure you created the `.env.local` file
- Check that the DATABASE_URL is correct
- Restart your development server after adding environment variables

### "relation does not exist" error
- Run the `create-tables.sql` script in your database
- Make sure all tables are created before running the admin setup

### Connection timeout
- Check your database connection string
- Ensure your database is accessible from your IP
- Try using a different database provider

## Security Notes

- Change the default admin password after first login
- Use a strong JWT_SECRET in production
- Keep your database credentials secure
- Never commit `.env.local` to version control 