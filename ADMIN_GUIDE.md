

1. **Set up the admin user:**
   ```bash
   npm run admin:setup
   ```

2. **Access the admin panel:**
   - Go to: `http://localhost:3000/admin`


## 📊 Features Overview

### 1. Analytics Dashboard
- **Real-time visitor tracking** - See who's visiting your site
- **Page view statistics** - Track which pages are most popular
- **Daily visitor charts** - Visualize traffic patterns
- **Referrer tracking** - See where your visitors come from

### 2. Content Management
- **About Section** - Edit your personal information
- **Contact Section** - Update contact details
- **FAQ Section** - Manage frequently asked questions

### 3. Project Management
- **Add new projects** in three categories:
  - 🚀 Engineering
  - 🎮 Games  
  - 🎨 Art
- **Edit existing projects** - Update descriptions, images, tags
- **Delete projects** - Remove projects you no longer want to showcase
- **Project ordering** - Control the display order of projects
- **Tags system** - Add relevant tags to categorize projects

### 4. Settings & Configuration
- **Site information** - Update site title, description, contact email
- **Analytics settings** - Configure tracking preferences
- **System status** - Monitor database connection and system health

## 🛠️ How to Use

### Adding a New Project
1. Go to the **Projects** tab
2. Click **"Add Project"** button
3. Fill in the details:
   - **Title**: Project name
   - **Description**: Detailed project description
   - **Category**: Choose Engineering/Games/Art
   - **Image URL**: Link to project image (optional)
   - **Tags**: Add relevant tags (press Enter to add)
   - **Order**: Set display order (lower numbers appear first)
4. Click **Save**

### Editing Content
1. Go to the **Content** tab
2. Click **"Edit"** on any section (About/Contact/FAQ)
3. Update the title and content
4. Click **Save**

### Viewing Analytics
1. Go to the **Analytics** tab
2. View:
   - **Total page views** and **unique visitors**
   - **Page popularity charts**
   - **Daily visitor trends**
   - **Top referrer sources**

## 🔧 Technical Details

### Database Tables
- `users` - Admin authentication
- `content` - About, Contact, FAQ sections
- `projects` - Project portfolio items
- `analytics` - Visitor tracking data
- `sessions` - Admin session management

### API Endpoints
- `/api/auth/*` - Authentication (login, logout, check)
- `/api/content` - Content management
- `/api/projects` - Project CRUD operations
- `/api/analytics` - Analytics tracking and retrieval

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Session management
- Protected API routes

## 🎯 Best Practices

### For Projects
- Use descriptive titles
- Include detailed descriptions
- Add relevant tags for better categorization
- Use high-quality images
- Set appropriate order numbers

### For Content
- Keep About section personal and engaging
- Make Contact information easily accessible
- Use FAQ to address common questions
- Regular updates keep content fresh

### For Analytics
- Monitor traffic patterns regularly
- Use insights to improve content
- Track which projects get most attention
- Understand your audience better

## 🔒 Security Notes

- Change the default admin password after first login
- Keep your database credentials secure
- Regularly backup your data
- Monitor for unusual activity

## 🆘 Troubleshooting

### Can't login?
- Make sure you've run `npm run admin:setup`
- Check that your database is connected
- Verify the email/password combination

### Analytics not showing?
- Ensure the analytics tracker is active
- Check browser console for errors
- Verify database connection

### Projects not saving?
- Check that all required fields are filled
- Ensure you're logged in as admin
- Check browser console for API errors

## 📈 Future Enhancements

Potential features to add:
- Image upload functionality
- Rich text editor for content
- Advanced analytics filters
- Email notifications
- Backup/restore functionality
- Multi-user admin support

---

**Need help?** Check the browser console for error messages or review the API endpoints in the `/app/api/` directory. 