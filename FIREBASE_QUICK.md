# Firebase Quick Reference

## Admin Panel

**URL**: `https://krishkc5.github.io/admin-firebase.html`

**Login**: Use the email/password you created in Firebase Console

## Quick Setup Checklist

- [ ] Create Firebase project at https://console.firebase.google.com/
- [ ] Enable Firestore Database (production mode)
- [ ] Enable Email/Password Authentication
- [ ] Create admin user in Authentication → Users
- [ ] Copy Firebase config to `firebase-config.js`
- [ ] Update security rules in Firestore
- [ ] Test locally with `admin-firebase.html`
- [ ] Deploy to GitHub Pages

## Firebase Config Template

```javascript
// firebase-config.js
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
window.firebaseAuth = auth;
window.firebaseDB = db;
```

## Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if resource.data.published == true;
      allow write: if request.auth != null;
    }
  }
}
```

## Common Tasks

### Create a Blog Post

1. Open `admin-firebase.html`
2. Login
3. Fill in title, excerpt, content
4. Add tags (press Enter after each)
5. Check "Published"
6. Click "Save Post"

### Edit a Post

1. Open admin panel
2. Scroll to "Your Posts"
3. Click "Edit" on the post
4. Make changes
5. Click "Save Post"

### Change Password

1. Go to Firebase Console
2. Authentication → Users
3. Click your user → Reset password

## Files Overview

| File | Purpose |
|------|---------|
| `index.html` | Main portfolio page (loads posts from Firebase) |
| `admin-firebase.html` | Admin interface for creating/editing posts |
| `firebase-config.js` | Your Firebase project configuration |
| `styles.css` | Website styles |
| `script.js` | Canvas background animation |

## Firebase Console URLs

- **Project Overview**: https://console.firebase.google.com/project/YOUR_PROJECT
- **Firestore**: https://console.firebase.google.com/project/YOUR_PROJECT/firestore
- **Authentication**: https://console.firebase.google.com/project/YOUR_PROJECT/authentication

## Free Tier Limits

- **Firestore**: 50,000 reads/day, 20,000 writes/day, 1 GB storage
- **Authentication**: Unlimited
- **Hosting**: 10 GB/month, 360 MB/day

For a personal blog, you'll never hit these limits.

## Deploy to GitHub Pages

```bash
git add .
git commit -m "Add Firebase backend"
git push origin main
```

Live in ~1 minute at `https://krishkc5.github.io`

## Troubleshooting

**Can't login?**
- Check Firebase Console → Authentication → Users
- Verify Email/Password provider is enabled
- Try resetting password

**Posts not showing?**
- Make sure "Published" is checked
- Check browser console for errors
- Verify firebase-config.js has correct credentials

**Permission denied?**
- Update Firestore security rules
- Make sure you're logged in for write operations

---

**Full guide**: See [FIREBASE_SETUP.md](FIREBASE_SETUP.md)
