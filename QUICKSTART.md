# Quick Start Guide

## Production Backend Setup (5 Minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment
```bash
cp .env.example .env
```

Edit `.env` and change:
- `JWT_SECRET` to a random string (at least 32 characters)
- `ADMIN_PASSWORD` to your desired password

### Step 3: Initialize Database
```bash
npm run init-db
```

### Step 4: Create Admin User
```bash
npm run create-admin
```

Follow the prompts:
- Username: `admin` (or your choice)
- Password: (min 8 characters)
- Confirm password

### Step 5: Start Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

You should see:
```
╔═══════════════════════════════════════════════╗
║   Portfolio Blog API Server                  ║
║   Environment: development                    ║
║   Port: 3000                                  ║
║   Database: SQLite                            ║
║   Ready to accept connections!                ║
╚═══════════════════════════════════════════════╝
```

### Step 6: Test It

1. **Check API Health**
   ```bash
   curl http://localhost:3000/api/health
   ```
   Should return: `{"status":"ok",...}`

2. **Open Admin Interface**
   - Open `admin.html` in your browser
   - Login with your credentials
   - Create your first blog post!

3. **View Portfolio**
   - Open `index.html` in your browser
   - Your blog posts should appear automatically

## Deployment to Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions on deploying to:
- Render.com (Recommended, Free)
- Fly.io
- Railway
- Heroku

### Quick Deploy to Render (Free)

1. Push code to GitHub
2. Go to https://render.com
3. New Web Service → Connect GitHub repo
4. Set environment variables (JWT_SECRET, etc.)
5. Deploy!

Full instructions: [DEPLOYMENT.md](DEPLOYMENT.md)

## Troubleshooting

### "npm: command not found"
Install Node.js from https://nodejs.org (v18 or higher)

### "Cannot find module 'express'"
Run `npm install` first

### "Database is locked"
Stop any other instances of the server

### "Login failed"
- Make sure you ran `npm run create-admin`
- Check username and password
- Clear browser localStorage

### "Posts not loading on homepage"
- Check if API is running (http://localhost:3000/api/health)
- Check browser console for errors
- Make sure CORS is configured correctly in `.env`

## Next Steps

After setup:
- [ ] Create some blog posts
- [ ] Customize the portfolio content
- [ ] Deploy to production (see DEPLOYMENT.md)
- [ ] Set up custom domain
- [ ] Configure automated backups

## Support

- Full README: [README.md](README.md)
- Deployment Guide: [DEPLOYMENT.md](DEPLOYMENT.md)
- Issues: https://github.com/yourusername/portfolio/issues
