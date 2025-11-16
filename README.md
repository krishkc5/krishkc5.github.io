# Krishna's Portfolio Website

Professional portfolio website with integrated blog system powered by Firebase.

## 🌐 Live Site

**Portfolio**: [https://krishkc5.github.io](https://krishkc5.github.io)

**Admin Panel**: [https://krishkc5.github.io/admin-firebase.html](https://krishkc5.github.io/admin-firebase.html)

## ✨ Features

- **Clean, Professional Design**: Modern dark theme with Inter font
- **Animated Background**: Canvas-based particle animation with performance optimization
- **Firebase Blog**: Real-time blog post management
- **Secure Admin Panel**: Firebase Authentication
- **Responsive**: Mobile-first design that works on all devices
- **Fast**: Optimized performance, GitHub Pages hosting
- **Free**: No hosting costs, Firebase free tier
- **Accessible**: ARIA labels, semantic HTML, keyboard navigation

## 🚀 Quick Start

### For Visitors
Just visit [https://krishkc5.github.io](https://krishkc5.github.io)

### For You (Admin)

**First Time Setup** (~10 minutes):
1. Follow [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for step-by-step Firebase configuration
2. Create your admin account in Firebase Console
3. Update `firebase-config.js` with your Firebase credentials

**Managing Blog Posts**:
1. Go to [admin-firebase.html](https://krishkc5.github.io/admin-firebase.html)
2. Login with your Firebase credentials
3. Create, edit, or delete posts
4. Posts appear automatically on the homepage

**Quick Reference**: See [FIREBASE_QUICK.md](FIREBASE_QUICK.md)

## 📁 Project Structure

```
.
├── index.html              # Main portfolio page
├── admin-firebase.html     # Blog admin panel (Firebase)
├── firebase-config.js      # Firebase configuration
├── styles.css             # Website styling
├── script.js              # Canvas background animation
├── FIREBASE_SETUP.md      # Complete Firebase setup guide
├── FIREBASE_QUICK.md      # Quick reference
└── README.md              # This file
```

## 🔧 Technology Stack

**Frontend:**
- HTML5, CSS3 (Grid, Flexbox)
- Vanilla JavaScript (ES6+)
- Canvas API for animations
- Inter font from Google Fonts

**Backend:**
- Firebase Firestore (Database)
- Firebase Authentication (Login)

**Hosting:**
- GitHub Pages (Free)

## 💰 Cost

**Total: $0/month**

Firebase free tier includes:
- 50,000 reads/day
- 20,000 writes/day
- 1 GB storage
- Unlimited authentication

For a personal portfolio, you'll never exceed these limits.

## Customization

### Changing Colors

Edit the CSS variables in `styles.css` and `admin-styles.css`:

```css
:root {
    --bg-dark: #0a0e27;
    --accent-blue: #4a90e2;
    --accent-purple: #7c3aed;
    /* ... more variables */
}
```

### Modifying Content

- Edit `index.html` to update:
  - Personal information
  - Skills
  - Experience
  - Projects
  - Contact links

### Adjusting Animation

In `script.js`, modify the `CanvasBackground` class:

```javascript
// Change particle count
const particleCount = Math.floor((this.canvas.width * this.canvas.height) / 12000);

// Adjust connection distance
const maxDistance = 120;

// Modify particle speed
vx: (Math.random() - 0.5) * 0.3
```

## Performance Optimization

The site includes several optimizations:

1. **Visibility API**: Animation pauses when tab is not visible
2. **Efficient Rendering**: Only draws connections within threshold distance
3. **Responsive Particle Count**: Adjusts based on viewport size
4. **Error Handling**: Graceful degradation if features fail
5. **Input Validation**: Prevents invalid data

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires:
- ES6+ JavaScript support
- Canvas API
- Web Crypto API (for password hashing)
- CSS Grid and Flexbox

## Accessibility Features

- Semantic HTML5 elements
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Alt text for images (when added)
- Color contrast compliance
- Responsive text sizing

## 🚀 Deployment

### Update Site
```bash
# Make changes to files
git add .
git commit -m "Update portfolio"
git push origin main
```

Changes appear in ~1 minute at [https://krishkc5.github.io](https://krishkc5.github.io)

### Firebase Setup
See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for complete instructions.

## 🆘 Troubleshooting

**Posts not showing?**
- Check that posts are marked as "Published"
- Verify `firebase-config.js` has correct credentials
- Check browser console for errors

**Can't login to admin?**
- Verify user exists in Firebase Console → Authentication
- Check Email/Password provider is enabled
- Try password reset in Firebase Console

**Firebase errors?**
- Check Firestore security rules are configured correctly
- Verify Firebase project is active
- Check network connectivity

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) troubleshooting section for more help.

## 📚 Documentation

- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) - Complete Firebase setup guide (10 minutes)
- [FIREBASE_QUICK.md](FIREBASE_QUICK.md) - Quick reference for common tasks
- [SIMPLE_DEPLOY.md](SIMPLE_DEPLOY.md) - Alternative deployment options

## 🎯 Future Enhancements

Possible additions:
- [ ] Rich text editor (TinyMCE/Quill) for blog posts
- [ ] Image upload to Firebase Storage
- [ ] Blog post comments
- [ ] Search functionality
- [ ] RSS feed
- [ ] Blog post categories/archive
- [ ] Analytics dashboard
- [ ] Custom domain
- [ ] Individual blog post pages with unique URLs

## 📧 Contact

**Krishna Chemudupati**
- Email: krishkc@seas.upenn.edu
- Phone: (407) 808-7141
- GitHub: [krishkc5](https://github.com/krishkc5)

## 📄 License

This is a personal portfolio website. Feel free to use the structure as inspiration for your own portfolio.

---

**Built with Firebase, JavaScript, and GitHub Pages**
