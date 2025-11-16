# Krishna Chemudupati - Personal Portfolio

A modern, performant personal portfolio website for showcasing research, projects, and blog posts.

## Features

- **Modern Design**: Clean, professional interface with dark theme
- **Interactive Background**: Canvas-based particle network animation
- **Responsive**: Mobile-first design that works on all devices
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation
- **Performance Optimized**:
  - Visibility API to pause animations when tab is inactive
  - Efficient particle system with O(n²) connection algorithm
  - Modular code split into separate CSS/JS files
- **Blog Management**: Admin interface for creating and managing blog posts
- **Security**: Input sanitization and validation throughout

## Project Structure

```
personal_website/
├── index.html           # Main portfolio page
├── admin.html          # Blog admin interface
├── styles.css          # Main portfolio styles
├── admin-styles.css    # Admin interface styles
├── script.js           # Main portfolio JavaScript
├── admin.js            # Admin interface logic
└── README.md           # This file
```

## Getting Started

### Viewing the Portfolio

Simply open `index.html` in a web browser.

### Setting Up Blog Admin

1. Open `admin.html` in a web browser
2. Open the browser console (F12)
3. Run the following command to set your admin password:
   ```javascript
   await setupAdminPassword("your-secure-password-here")
   ```
4. Login with:
   - Username: `admin`
   - Password: `your-secure-password-here`

### Creating Blog Posts

1. Log into the admin interface
2. Click "New Post" tab
3. Fill in the form:
   - Title (required)
   - Date (required)
   - Tags (press Enter to add)
   - Excerpt (required, max 500 characters)
   - Content (required)
4. Click "Preview" to see how it will look
5. Click "Save Post" to publish

### Managing Posts

1. Click "Manage Posts" tab
2. View all published posts
3. Click "Edit" to modify a post
4. Click "Delete" to remove a post (with confirmation)

## Security Notes

**IMPORTANT**: The current blog admin system uses client-side authentication, which is **NOT SECURE for production use**. This is intended for personal use only.

### Current Limitations:

- Password hash stored in browser localStorage (accessible to anyone)
- No server-side validation
- No rate limiting
- Blog posts stored only in localStorage (can be lost)

### For Production Use:

You should implement a proper backend with:
- Server-side authentication (JWT, sessions, OAuth)
- Database storage (PostgreSQL, MongoDB, etc.)
- API endpoints for CRUD operations
- HTTPS/TLS encryption
- CSRF protection
- Rate limiting
- Input validation and sanitization on the server

### Recommended Tech Stack:

- **Backend**: Node.js + Express, Python + Flask/FastAPI, or similar
- **Database**: PostgreSQL, MongoDB, or Firebase
- **Auth**: Passport.js, Auth0, or Firebase Auth
- **Hosting**: Vercel, Netlify, Heroku, or AWS

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

## Deployment

### GitHub Pages

1. Create a repository named `username.github.io`
2. Push your code to the `main` branch
3. Enable GitHub Pages in repository settings
4. Your site will be live at `https://username.github.io`

### Netlify

1. Create account at netlify.com
2. Drag and drop your project folder
3. Site will be deployed instantly

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in project directory
3. Follow prompts

## Future Enhancements

- [ ] Implement proper backend authentication
- [ ] Add database for blog posts
- [ ] Create individual blog post pages
- [ ] Add image upload functionality
- [ ] Implement markdown support for blog content
- [ ] Add search functionality
- [ ] Include analytics integration
- [ ] Add RSS feed for blog
- [ ] Implement comments system
- [ ] Add dark/light theme toggle

## License

© 2025 Krishna Chemudupati. All rights reserved.

## Contact

- Email: krishkc@seas.upenn.edu
- Phone: +1 (407) 808-7141
- LinkedIn: [Add your link]
- GitHub: [Add your link]

## Changelog

### Version 2.0.0 (Current)
- Complete redesign with modern, authentic styling
- Modular code structure (separate CSS/JS files)
- Improved security with input sanitization
- Enhanced accessibility features
- Performance optimizations (visibility API, efficient algorithms)
- Better error handling and validation
- Comprehensive documentation

### Version 1.0.0
- Initial release with single-file architecture
- Basic blog functionality
- Animated background
- Responsive design
