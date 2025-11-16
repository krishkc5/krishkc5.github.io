# Production Deployment Guide

This guide will walk you through deploying your portfolio website with a production-ready backend.

## Prerequisites

- Node.js 18+ and npm 9+
- A hosting platform account (see options below)
- Basic command line knowledge

## Architecture

```
┌─────────────────┐
│   Frontend      │  Static HTML/CSS/JS
│   (GitHub Pages)│  Served from GitHub or CDN
└────────┬────────┘
         │ API Calls
         ↓
┌─────────────────┐
│   Backend API   │  Node.js + Express + SQLite
│   (Render/Fly)  │  Handles auth & blog management
└─────────────────┘
```

## Quick Start (Local Development)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

3. **Initialize Database**
   ```bash
   npm run init-db
   ```

4. **Create Admin User**
   ```bash
   npm run create-admin
   # Follow the prompts
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Test It**
   - Frontend: Open `index.html` in your browser
   - Admin: Open `admin.html` in your browser
   - API: Visit `http://localhost:3000/api/health`

## Production Deployment Options

### Option 1: Render.com (Recommended - Free Tier Available)

**Best for**: Simple deployment with free tier

#### Steps:

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Add production backend"
   git push origin main
   ```

2. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

3. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `your-portfolio-api`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free (or paid for better performance)

4. **Add Environment Variables**
   ```
   NODE_ENV=production
   JWT_SECRET=your-super-secret-key-change-this
   JWT_EXPIRES_IN=24h
   ALLOWED_ORIGINS=https://yourusername.github.io,https://yourcustomdomain.com
   PORT=10000
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete
   - Note your API URL: `https://your-portfolio-api.onrender.com`

6. **Initialize Database**
   - Go to Shell tab in Render dashboard
   - Run: `npm run create-admin`

7. **Update Frontend**
   - Edit `api-client.js`:
     ```javascript
     constructor(baseURL = 'https://your-portfolio-api.onrender.com/api') {
     ```
   - Commit and push changes

### Option 2: Fly.io (More Control)

**Best for**: Better performance, more regions

#### Steps:

1. **Install Fly CLI**
   ```bash
   # Mac/Linux
   curl -L https://fly.io/install.sh | sh

   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Login**
   ```bash
   fly auth login
   ```

3. **Create fly.toml**
   ```toml
   app = "your-portfolio-api"
   primary_region = "iad"

   [build]
     [build.args]
       NODE_VERSION = "18"

   [env]
     NODE_ENV = "production"
     PORT = "8080"

   [[services]]
     http_checks = []
     internal_port = 8080
     processes = ["app"]
     protocol = "tcp"
     script_checks = []

     [[services.ports]]
       handlers = ["http"]
       port = 80
       force_https = true

     [[services.ports]]
       handlers = ["tls", "http"]
       port = 443

     [[services.tcp_checks]]
       grace_period = "1s"
       interval = "15s"
       restart_limit = 0
       timeout = "2s"
   ```

4. **Set Secrets**
   ```bash
   fly secrets set JWT_SECRET=your-super-secret-key
   fly secrets set ALLOWED_ORIGINS=https://yourusername.github.io
   ```

5. **Deploy**
   ```bash
   fly deploy
   ```

6. **Create Admin**
   ```bash
   fly ssh console
   npm run create-admin
   exit
   ```

### Option 3: Railway (Easiest Setup)

**Best for**: Zero configuration deployment

#### Steps:

1. **Install Railway CLI**
   ```bash
   npm i -g @railway/cli
   ```

2. **Login**
   ```bash
   railway login
   ```

3. **Initialize**
   ```bash
   railway init
   ```

4. **Add Variables**
   ```bash
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your-secret-key
   railway variables set ALLOWED_ORIGINS=https://yourusername.github.io
   ```

5. **Deploy**
   ```bash
   railway up
   ```

6. **Get URL**
   ```bash
   railway domain
   ```

### Option 4: Heroku (Traditional)

**Best for**: Enterprise features, add-ons

#### Steps:

1. **Install Heroku CLI**
   ```bash
   # Mac
   brew tap heroku/brew && brew install heroku

   # Windows
   # Download from heroku.com
   ```

2. **Create Procfile**
   ```
   web: npm start
   ```

3. **Deploy**
   ```bash
   heroku create your-portfolio-api
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set ALLOWED_ORIGINS=https://yourusername.github.io
   git push heroku main
   ```

4. **Create Admin**
   ```bash
   heroku run npm run create-admin
   ```

## Frontend Deployment

### GitHub Pages

1. **Update API endpoint** in `api-client.js`:
   ```javascript
   constructor(baseURL = 'https://your-backend-url.com/api') {
   ```

2. **Enable GitHub Pages**
   - Go to repository → Settings → Pages
   - Source: main branch, / (root)
   - Save

3. **Access at**: `https://yourusername.github.io`

### Netlify

1. **Install Netlify CLI**
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**
   ```bash
   netlify deploy --prod
   ```

### Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

## Post-Deployment Checklist

- [ ] Backend API is accessible
- [ ] Health check works: `/api/health`
- [ ] Admin login works
- [ ] Can create/edit/delete posts
- [ ] Blog posts appear on homepage
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] Rate limiting active
- [ ] Database backed up

## Database Backup

Your SQLite database is stored at `server/database/blog.db`.

### Automatic Backups

Add to your deployment platform:

**Render/Fly/Railway**:
1. Create a cron job service
2. Use this script:
   ```bash
   #!/bin/bash
   cp server/database/blog.db backups/blog-$(date +%Y%m%d).db
   ```

### Manual Backup

```bash
# SSH into your server
# Copy database
cp server/database/blog.db blog-backup.db

# Download locally (adjust command for your platform)
scp user@server:/path/to/blog-backup.db ./local-backup.db
```

## Troubleshooting

### Backend won't start
- Check environment variables are set
- Ensure Node.js version is 18+
- Check logs for errors

### CORS errors
- Update `ALLOWED_ORIGINS` environment variable
- Include protocol (https://)
- No trailing slashes

### Can't login
- Verify admin user created: `npm run create-admin`
- Check JWT_SECRET is set
- Clear browser localStorage
- Check network tab for error responses

### Posts not loading
- Check API endpoint in browser
- Verify CORS headers
- Check console for errors
- Ensure posts are published

## Security Best Practices

1. **Change Default Secrets**
   ```bash
   # Generate strong JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Use HTTPS Only**
   - Enable force HTTPS on your platform
   - Update CORS to only allow HTTPS origins

3. **Regular Updates**
   ```bash
   npm audit
   npm update
   ```

4. **Rate Limiting**
   - Default: 100 requests/15min
   - Auth: 5 attempts/15min
   - Adjust in `.env` if needed

5. **Database Backups**
   - Set up automated backups
   - Test restore process
   - Keep offsite copy

## Monitoring

### Health Checks

Monitor these endpoints:
- `GET /api/health` - Should return 200
- `GET /api/posts` - Should return blog posts

### Logs

Check logs regularly:
```bash
# Render: Dashboard → Logs
# Fly: fly logs
# Railway: railway logs
# Heroku: heroku logs --tail
```

## Scaling

### Performance Optimization

1. **Enable caching**
   - Add Redis for session storage
   - Cache blog post responses

2. **Use CDN**
   - CloudFlare for frontend assets
   - Reduce API calls

3. **Upgrade database**
   - Migrate to PostgreSQL for better performance
   - Use connection pooling

### Migration to PostgreSQL

When ready to scale beyond SQLite:

1. Install PostgreSQL adapter
2. Update database config
3. Run migration scripts
4. Update environment variables

See `docs/postgresql-migration.md` (coming soon)

## Support

- **Issues**: https://github.com/yourusername/portfolio/issues
- **Email**: krishkc@seas.upenn.edu

## Next Steps

After deployment:
- [ ] Set up monitoring/alerting
- [ ] Configure automated backups
- [ ] Add analytics
- [ ] Create RSS feed
- [ ] Add sitemap.xml
- [ ] Set up custom domain
- [ ] Enable CDN
- [ ] Add image upload functionality

---

**Congratulations!** Your portfolio is now production-ready with a secure backend.
