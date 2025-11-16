# Deploy to Render.com (5 Minutes)

## Step-by-Step Guide

### 1. Push Your Code to GitHub

```bash
git add .
git commit -m "Add production backend with Docker support"
git push origin main
```

### 2. Sign Up for Render

1. Go to https://render.com
2. Click "Get Started"
3. Sign up with GitHub

### 3. Create New Web Service

1. Click "New +" button (top right)
2. Select "Web Service"
3. Connect your GitHub account if prompted
4. Find and select your repository: `krishkc5/krishkc5.github.io`

### 4. Configure Service

Fill in the form exactly as shown:

**Basic Settings:**
- **Name**: `personal-website` (or your choice)
- **Region**: `Oregon (US West)` (or closest to you)
- **Branch**: `main`
- **Root Directory**: Leave empty (or `.` if required)

**Build Settings:**
- **Language**: Select `Docker`
- **Dockerfile Path**: `./Dockerfile` (it should auto-detect)

**Plan:**
- Select **Free** (or upgrade to Starter for $7/month)

### 5. Add Environment Variables

Click "Advanced" then scroll to "Environment Variables"

Add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | `8f3d9c2e1a7b6f5e4d3c2b1a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a` |
| `JWT_EXPIRES_IN` | `24h` |
| `PORT` | `3000` |
| `ALLOWED_ORIGINS` | `https://krishkc5.github.io,https://yourdomain.com` |

**Important:** Replace the JWT_SECRET with your own random string!

To generate a new secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 6. Deploy

1. Click "Create Web Service"
2. Wait for deployment (2-5 minutes)
3. Watch the logs - you should see:
   ```
   ╔═══════════════════════════════════════════════╗
   ║   Portfolio Blog API Server                  ║
   ║   Environment: production                    ║
   ║   Port: 3000                                  ║
   ║   Database: SQLite                            ║
   ║   Ready to accept connections!                ║
   ╚═══════════════════════════════════════════════╝
   ```

### 7. Get Your API URL

After deployment succeeds, you'll see your URL:
```
https://personal-website-xxxx.onrender.com
```

Copy this URL!

### 8. Initialize Database

**Option A: Use Render Shell**
1. In Render dashboard, go to your service
2. Click "Shell" tab
3. Run:
   ```bash
   npm run init-db
   node server/scripts/setup-admin.js
   ```

**Option B: Use API (Easier)**
The database will auto-initialize on first start. You just need to create an admin user:

1. SSH into your service via Render shell
2. Run: `node server/scripts/setup-admin.js`
3. Or use the create-admin endpoint (if you add one)

### 9. Update Frontend

Update `api-client.js` to use your Render URL:

```javascript
// Change this line:
constructor(baseURL = '/api') {

// To this (use your actual Render URL):
constructor(baseURL = 'https://personal-website-xxxx.onrender.com/api') {
```

Or make it environment-aware:
```javascript
constructor(baseURL = null) {
    // Use production URL if deployed, localhost if local
    this.baseURL = baseURL || (
        window.location.hostname === 'localhost'
            ? 'http://localhost:3000/api'
            : 'https://personal-website-xxxx.onrender.com/api'
    );
    this.token = localStorage.getItem('authToken');
}
```

### 10. Test Your Deployment

1. **Health Check**
   ```bash
   curl https://personal-website-xxxx.onrender.com/api/health
   ```
   Should return: `{"status":"ok",...}`

2. **Get Posts**
   ```bash
   curl https://personal-website-xxxx.onrender.com/api/posts
   ```
   Should return: `[]` (empty array initially)

3. **Test Login** (after creating admin)
   - Open your deployed `admin.html`
   - Login with your credentials
   - Create a test post

### 11. Update CORS

Make sure your `ALLOWED_ORIGINS` environment variable includes:
```
https://krishkc5.github.io,https://yourdomain.com,http://localhost:3000
```

You can update this in Render dashboard under "Environment" tab.

## Troubleshooting

### Build Fails

**Check logs for errors:**
- Missing dependencies? Run `npm install` locally first
- Dockerfile syntax error? Validate with `docker build .`

**Common fixes:**
- Make sure `package.json` is committed
- Verify Node version matches (18+)
- Check Dockerfile has correct syntax

### Database Issues

**Database not initialized:**
1. Go to Shell tab in Render
2. Run: `npm run init-db`
3. Run: `node server/scripts/setup-admin.js`

**Database keeps resetting:**
- Render's free tier has ephemeral storage
- Database resets on every deploy/restart
- **Solution:** Upgrade to paid plan or migrate to PostgreSQL

### CORS Errors

**Update allowed origins:**
1. Render dashboard → Environment
2. Edit `ALLOWED_ORIGINS`
3. Add your GitHub Pages URL
4. Click "Save Changes"
5. Service will auto-redeploy

### Service Sleeps (Free Tier)

On free tier, service sleeps after 15 min of inactivity:
- First request takes ~30 seconds to wake up
- **Solution:** Upgrade to paid tier or use a ping service

## Important Notes

### Free Tier Limitations

- ⚠️ Service sleeps after 15 minutes of inactivity
- ⚠️ 750 hours/month (shared across all services)
- ⚠️ Database resets on redeploy (use PostgreSQL for persistence)
- ✅ Automatic SSL certificate
- ✅ Automatic deploys on git push
- ✅ Good enough for portfolio/demo

### Upgrade Benefits ($7/month)

- ✅ No sleep time
- ✅ Persistent storage
- ✅ Better performance
- ✅ More bandwidth
- ✅ Priority support

## Next Steps

After successful deployment:

1. **Update Frontend URLs** in `api-client.js`
2. **Test Everything** - Create posts, login, etc.
3. **Deploy Frontend** to GitHub Pages
4. **Set Up Backups** (if using paid tier)
5. **Monitor Logs** for errors
6. **Add Custom Domain** (optional)

## Alternative: Auto-Initialize Admin

Add this to your environment variables in Render:

| Key | Value |
|-----|-------|
| `AUTO_CREATE_ADMIN` | `true` |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `your-secure-password` |

Then create `server/scripts/auto-init.js`:
```javascript
require('dotenv').config();
const { initDatabase } = require('../config/database');
const bcrypt = require('bcryptjs');
const { db } = require('../config/database');

async function autoInit() {
    if (process.env.AUTO_CREATE_ADMIN === 'true') {
        initDatabase();
        const username = process.env.ADMIN_USERNAME || 'admin';
        const password = process.env.ADMIN_PASSWORD;

        if (password) {
            const hash = await bcrypt.hash(password, 12);
            db.prepare('INSERT OR IGNORE INTO users (username, password_hash) VALUES (?, ?)')
              .run(username, hash);
            console.log('Admin user auto-created');
        }
    }
}

autoInit();
```

Update `server/index.js` to run this on startup.

## Success!

Your backend is now deployed and accessible at:
```
https://personal-website-xxxx.onrender.com/api
```

You can now use this URL in your frontend to load blog posts!

---

**Questions?** Check the Render docs: https://render.com/docs
