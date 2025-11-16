# 🚀 Render.com Quick Deploy Checklist

## ✅ Before You Start

Make sure you have:
- [x] Code pushed to GitHub
- [x] Render.com account (sign up with GitHub)
- [x] 5 minutes

## 📋 Configuration Values (Copy These)

### Service Settings
```
Name: personal-website
Region: Oregon (US West)
Branch: main
Language: Docker
```

### Environment Variables (Copy-Paste Ready)

```bash
NODE_ENV=production
JWT_SECRET=8f3d9c2e1a7b6f5e4d3c2b1a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a
JWT_EXPIRES_IN=24h
PORT=3000
ALLOWED_ORIGINS=https://krishkc5.github.io,http://localhost:3000,http://127.0.0.1:3000
```

⚠️ **Change JWT_SECRET** to your own random string!

Generate one:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## 🎯 Deployment Steps

1. **Render.com** → New + → Web Service
2. **Connect** your GitHub repo: `krishkc5/krishkc5.github.io`
3. **Select Language**: Docker
4. **Add Environment Variables** (from above)
5. **Click** "Create Web Service"
6. **Wait** 2-5 minutes for deployment

## 🔧 After Deployment

### Initialize Database & Admin

In Render dashboard:
1. Go to **Shell** tab
2. Run:
   ```bash
   npm run init-db
   node server/scripts/setup-admin.js
   ```

Your admin credentials:
- Username: `admin`
- Password: `SecureAdmin123!` (or what you set)

### Update Frontend

Your Render URL will be something like:
```
https://personal-website-xxxx.onrender.com
```

**Option 1: Hardcode in api-client.js**
```javascript
constructor(baseURL = 'https://personal-website-xxxx.onrender.com/api') {
```

**Option 2: Auto-detect (Recommended)**
```javascript
constructor(baseURL = null) {
    this.baseURL = baseURL || (
        window.location.hostname === 'localhost'
            ? 'http://localhost:3000/api'
            : 'https://personal-website-xxxx.onrender.com/api'
    );
    this.token = localStorage.getItem('authToken');
}
```

## ✅ Test Deployment

```bash
# Replace xxxx with your actual URL
curl https://personal-website-xxxx.onrender.com/api/health
```

Should return: `{"status":"ok",...}`

## 📝 Final Steps

1. Push updated frontend to GitHub:
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

2. Enable GitHub Pages (if not already)
   - Repo → Settings → Pages
   - Source: main branch
   - Save

3. Test everything at `https://krishkc5.github.io`

## 🆘 Quick Troubleshooting

**Build fails?**
- Check Render logs for error
- Verify Dockerfile exists
- Ensure package.json is committed

**Database errors?**
- Run `npm run init-db` in Shell
- Create admin: `node server/scripts/setup-admin.js`

**CORS errors?**
- Update `ALLOWED_ORIGINS` in Environment tab
- Include your GitHub Pages URL
- Save and wait for redeploy

**Service sleeping?**
- Free tier sleeps after 15 min
- First request takes ~30 seconds
- Upgrade to $7/month for always-on

## 💰 Cost

- **Free Tier**: $0/month (sleeps after 15 min)
- **Starter**: $7/month (always on, persistent storage)

## 📚 Full Guide

For detailed instructions, see:
- [RENDER_DEPLOY.md](RENDER_DEPLOY.md) - Complete guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - All platforms

---

**That's it!** Your backend will be live in 5 minutes. 🎉
