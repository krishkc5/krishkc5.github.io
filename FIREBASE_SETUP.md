# Firebase Setup Guide

This guide will help you set up Firebase for your portfolio blog in **under 10 minutes**.

## Why Firebase?

- ✅ **100% Free** for your use case (Generous free tier)
- ✅ **No server management** - Firebase handles everything
- ✅ **Real-time updates** - Posts appear instantly
- ✅ **Built-in authentication** - Secure login out of the box
- ✅ **Global CDN** - Fast worldwide
- ✅ **Works with GitHub Pages** - Perfect for static sites

## Step 1: Create Firebase Project (2 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `portfolio-blog` (or your choice)
4. **Disable Google Analytics** (not needed for this)
5. Click **"Create project"**
6. Wait ~30 seconds for project creation

## Step 2: Register Your Web App (1 minute)

1. In your Firebase project, click the **Web icon** `</>`
2. Enter app nickname: `Portfolio Website`
3. **Check** "Also set up Firebase Hosting" (optional but recommended)
4. Click **"Register app"**
5. **Copy the configuration code** - you'll need this!

It looks like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "portfolio-blog-xxxxx.firebaseapp.com",
  projectId: "portfolio-blog-xxxxx",
  storageBucket: "portfolio-blog-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## Step 3: Enable Firestore Database (2 minutes)

1. In Firebase console, go to **Build → Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll configure rules next)
4. Choose a location close to you (e.g., `us-east1`)
5. Click **"Enable"**

### Configure Security Rules

In the **Rules** tab, replace the content with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read published posts
    match /posts/{postId} {
      allow read: if resource.data.published == true;
      allow write: if request.auth != null;
    }
  }
}
```

Click **"Publish"** to save the rules.

## Step 4: Enable Authentication (1 minute)

1. Go to **Build → Authentication**
2. Click **"Get started"**
3. Click **"Email/Password"** under Sign-in providers
4. **Enable** the toggle
5. Click **"Save"**

### Create Your Admin User

1. Click the **"Users"** tab
2. Click **"Add user"**
3. Enter your email: `your@email.com`
4. Enter a secure password
5. Click **"Add user"**

**Save these credentials!** You'll use them to log into the admin panel.

## Step 5: Update Your Website (2 minutes)

### Update firebase-config.js

Open `firebase-config.js` and replace `YOUR_XXX` placeholders with your actual Firebase config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

window.firebaseAuth = auth;
window.firebaseDB = db;
```

## Step 6: Test Locally (2 minutes)

1. Open `admin-firebase.html` in your browser
2. Login with the email/password you created
3. Create a test blog post
4. Mark it as "Published"
5. Click "Save Post"

### View on Your Site

1. Open `index.html` in your browser
2. Scroll to the blog section
3. You should see your test post!

## Step 7: Deploy to GitHub Pages (1 minute)

```bash
# Commit your changes
git add firebase-config.js admin-firebase.html index.html
git commit -m "Add Firebase backend for blog"
git push origin main
```

Your site will be live at `https://krishkc5.github.io` in ~1 minute!

## File Structure

After setup, you should have:

```
your-project/
├── index.html              # Main portfolio (updated to use Firebase)
├── admin-firebase.html     # Admin interface for managing posts
├── firebase-config.js      # Your Firebase configuration
├── styles.css             # Your styles
├── script.js              # Canvas background
└── FIREBASE_SETUP.md      # This guide
```

## Usage

### Creating Blog Posts

1. Go to `https://krishkc5.github.io/admin-firebase.html`
2. Login with your admin credentials
3. Fill in the post form:
   - **Title**: Your post title
   - **Excerpt**: Short description (shown on homepage)
   - **Content**: Full post content (optional)
   - **Tags**: Type tags and press Enter
   - **Published**: Check to make it visible
4. Click "Save Post"

### Managing Posts

- **Edit**: Click "Edit" button next to any post
- **Delete**: Click "Delete" button (will ask for confirmation)
- **Draft**: Uncheck "Published" to hide from public

### Viewing Posts

Posts automatically appear on your homepage at `https://krishkc5.github.io` in the blog section.

## Security Notes

### What's Safe to Commit

✅ **Safe to commit to GitHub:**
- `firebase-config.js` (contains your config)
- `admin-firebase.html` (your admin interface)
- All other files

Your Firebase API key is **safe to expose** in client-side code. Firebase Security Rules protect your data, not the API key.

### What's Protected

🔒 **Protected by Firebase:**
- Only authenticated users can create/edit/delete posts
- Public can only read published posts
- Your admin password is never stored in code

### Changing Your Password

1. Go to Firebase Console → Authentication → Users
2. Click on your user
3. Click **"Reset password"** or **"Delete user"**
4. Create new user with new password if needed

## Cost

Firebase free tier includes:
- **Firestore**: 50,000 reads/day, 20,000 writes/day
- **Authentication**: Unlimited users
- **Hosting**: 10 GB/month

For a personal portfolio blog, you'll **never hit these limits**. It's completely free.

## Troubleshooting

### "Permission denied" errors

**Problem**: Can't read/write to Firestore

**Solution**: Check your Firestore Rules:
1. Go to Firestore → Rules
2. Make sure rules match the ones in Step 3
3. Click "Publish"

### Admin login not working

**Problem**: Can't login to admin panel

**Solutions**:
1. Verify you created a user in Firebase Console → Authentication
2. Check that Email/Password provider is enabled
3. Make sure you're using the correct email/password
4. Check browser console for error messages

### Posts not showing on homepage

**Problem**: Created posts but they don't appear

**Solutions**:
1. Make sure post is marked as "Published"
2. Check browser console for errors
3. Verify `firebase-config.js` has correct credentials
4. Wait a few seconds - Firestore has slight delay

### Firebase not loading

**Problem**: Errors about "firebase is not defined"

**Solutions**:
1. Check that Firebase SDK scripts are loaded in HTML
2. Verify `firebase-config.js` is included after Firebase SDK
3. Open browser console and check for network errors
4. Try clearing browser cache

## Advanced: Custom Domain

If you have a custom domain (e.g., `krishna.dev`):

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the DNS setup instructions
4. Firebase will provision SSL certificate automatically

## Next Steps

Now that Firebase is set up:

1. ✅ Create some real blog posts
2. ✅ Bookmark your admin panel URL
3. ✅ Share your portfolio!
4. 🎯 Optional: Add rich text editor (TinyMCE, Quill)
5. 🎯 Optional: Add image uploads to Firebase Storage
6. 🎯 Optional: Add comments with Firebase

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## Summary

You now have:
- ✅ Firebase backend with Firestore database
- ✅ Secure authentication
- ✅ Admin panel for managing posts
- ✅ Blog section on your portfolio
- ✅ Everything deployed and live

**Total cost: $0/month** 🎉

---

**Questions?** Check the Firebase docs or the browser console for error messages.
