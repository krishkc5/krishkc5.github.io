// Admin Interface Logic with Security Improvements
// NOTE: This is still a client-side implementation. For production use,
// implement a proper backend with server-side authentication.

class BlogAdmin {
    constructor() {
        this.posts = [];
        this.currentTags = [];
        this.editingId = null;
        this.init();
    }

    init() {
        this.loadPosts();
        this.setupEventListeners();
        this.initCanvas();
    }

    setupEventListeners() {
        // Login
        document.getElementById('loginForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Tag input
        document.getElementById('tagInput')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addTag();
            }
        });

        // Form submission
        document.getElementById('postForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePost();
        });
    }

    async handleLogin() {
        const username = this.sanitizeInput(document.getElementById('username').value);
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('loginError');

        try {
            // In a real implementation, this would call your backend API
            // For now, using environment variable or secure configuration
            const hash = await this.hashPassword(password);

            // WARNING: This is NOT secure for production!
            // You MUST implement proper backend authentication
            const storedHash = localStorage.getItem('adminPasswordHash');

            if (!storedHash) {
                errorEl.textContent = 'Admin password not configured. See console for setup instructions.';
                console.log('Run: await setupAdminPassword("your-secure-password")');
                return;
            }

            if (hash === storedHash && username === 'admin') {
                this.showAdminInterface();
            } else {
                errorEl.textContent = 'Invalid credentials';
                document.getElementById('password').value = '';
            }
        } catch (error) {
            console.error('Login error:', error);
            errorEl.textContent = 'An error occurred during login';
        }
    }

    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showAdminInterface() {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminInterface').classList.remove('display-none');
        document.getElementById('adminInterface').style.display = 'block';
        this.loadBlogList();
    }

    logout() {
        document.getElementById('loginContainer').style.display = 'flex';
        document.getElementById('adminInterface').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('loginError').textContent = '';
    }

    showTab(tabName) {
        document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
        document.getElementById(`${tabName}Tab`)?.classList.add('active');

        if (tabName === 'manage') {
            this.loadBlogList();
        }
    }

    addTag() {
        const input = document.getElementById('tagInput');
        const tag = this.sanitizeInput(input.value.trim());

        if (tag && !this.currentTags.includes(tag)) {
            this.currentTags.push(tag);
            this.renderTags();
            input.value = '';
        }
    }

    removeTag(tag) {
        this.currentTags = this.currentTags.filter(t => t !== tag);
        this.renderTags();
    }

    renderTags() {
        const container = document.getElementById('tagList');
        container.innerHTML = '';

        this.currentTags.forEach(tag => {
            const tagEl = document.createElement('div');
            tagEl.className = 'tag';

            const text = document.createElement('span');
            text.textContent = tag;

            const remove = document.createElement('span');
            remove.className = 'remove';
            remove.textContent = '×';
            remove.onclick = () => this.removeTag(tag);

            tagEl.appendChild(text);
            tagEl.appendChild(remove);
            container.appendChild(tagEl);
        });
    }

    validatePost(title, date, excerpt, content) {
        const errors = [];

        if (!title || title.trim().length === 0) {
            errors.push('Title is required');
        }

        if (!date) {
            errors.push('Date is required');
        }

        if (!excerpt || excerpt.trim().length === 0) {
            errors.push('Excerpt is required');
        } else if (excerpt.length > 500) {
            errors.push('Excerpt must be less than 500 characters');
        }

        if (!content || content.trim().length === 0) {
            errors.push('Content is required');
        }

        return errors;
    }

    savePost() {
        const title = this.sanitizeInput(document.getElementById('postTitle').value);
        const date = document.getElementById('postDate').value;
        const excerpt = this.sanitizeInput(document.getElementById('postExcerpt').value);
        const content = this.sanitizeInput(document.getElementById('postContent').value);

        const errors = this.validatePost(title, date, excerpt, content);

        if (errors.length > 0) {
            alert('Please fix the following errors:\n' + errors.join('\n'));
            return;
        }

        const post = {
            id: this.editingId || Date.now().toString(),
            title,
            date,
            excerpt,
            content,
            tags: [...this.currentTags],
            created: this.editingId ?
                this.posts.find(p => p.id === this.editingId).created :
                new Date().toISOString(),
            modified: new Date().toISOString()
        };

        try {
            if (this.editingId) {
                const index = this.posts.findIndex(p => p.id === this.editingId);
                this.posts[index] = post;
            } else {
                this.posts.unshift(post);
            }

            this.savePosts();
            this.generateBlogHTML();

            const message = this.editingId ? 'Post updated successfully!' : 'Post saved successfully!';
            this.showMessage(message, 'success');

            this.clearForm();
            this.showTab('manage');
        } catch (error) {
            console.error('Error saving post:', error);
            this.showMessage('Error saving post. Please try again.', 'error');
        }
    }

    loadPosts() {
        try {
            const stored = localStorage.getItem('blogPosts');
            this.posts = stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading posts:', error);
            this.posts = [];
        }
    }

    savePosts() {
        try {
            localStorage.setItem('blogPosts', JSON.stringify(this.posts));
        } catch (error) {
            console.error('Error saving posts:', error);
            throw new Error('Failed to save posts');
        }
    }

    loadBlogList() {
        const container = document.getElementById('blogListContainer');

        if (this.posts.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No blog posts yet. Create your first post!</p>';
            return;
        }

        container.innerHTML = '';
        this.posts.forEach(post => {
            const item = this.createBlogListItem(post);
            container.appendChild(item);
        });
    }

    createBlogListItem(post) {
        const item = document.createElement('div');
        item.className = 'blog-item';

        const info = document.createElement('div');
        info.className = 'blog-item-info';

        const title = document.createElement('h3');
        title.textContent = post.title;

        const meta = document.createElement('div');
        meta.className = 'blog-item-meta';
        meta.textContent = new Date(post.date).toLocaleDateString();

        info.appendChild(title);
        info.appendChild(meta);

        const actions = document.createElement('div');
        actions.className = 'blog-item-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn btn-secondary btn-small';
        editBtn.textContent = 'Edit';
        editBtn.onclick = () => this.editPost(post.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger btn-small';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => this.deletePost(post.id);

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        item.appendChild(info);
        item.appendChild(actions);

        return item;
    }

    editPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        this.editingId = postId;
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postDate').value = post.date;
        document.getElementById('postExcerpt').value = post.excerpt;
        document.getElementById('postContent').value = post.content;
        this.currentTags = [...post.tags];
        this.renderTags();

        this.showTab('editor');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    deletePost(postId) {
        if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            try {
                this.posts = this.posts.filter(p => p.id !== postId);
                this.savePosts();
                this.generateBlogHTML();
                this.loadBlogList();
                this.showMessage('Post deleted successfully', 'success');
            } catch (error) {
                console.error('Error deleting post:', error);
                this.showMessage('Error deleting post', 'error');
            }
        }
    }

    clearForm() {
        document.getElementById('postForm').reset();
        this.currentTags = [];
        this.editingId = null;
        this.renderTags();
        document.getElementById('postDate').value = new Date().toISOString().split('T')[0];
        document.getElementById('previewPanel').style.display = 'none';
    }

    previewPost() {
        const title = document.getElementById('postTitle').value;
        const date = document.getElementById('postDate').value;
        const excerpt = document.getElementById('postExcerpt').value;
        const content = document.getElementById('postContent').value;

        if (!title || !date || !excerpt || !content) {
            alert('Please fill in all fields before previewing');
            return;
        }

        const preview = document.getElementById('previewContent');
        const panel = document.getElementById('previewPanel');

        const formattedDate = new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        preview.innerHTML = `
            <div class="preview-date">${this.escapeHtml(formattedDate)}</div>
            <h2>${this.escapeHtml(title)}</h2>
            <div class="preview-tags">
                ${this.currentTags.map(tag => `<span class="preview-tag">${this.escapeHtml(tag)}</span>`).join('')}
            </div>
            <p><strong>Excerpt:</strong> ${this.escapeHtml(excerpt)}</p>
            <hr style="margin: 1.5rem 0; border: 0; border-top: 1px solid var(--border);">
            <div class="preview-content">${this.escapeHtml(content).replace(/\n/g, '<br>')}</div>
        `;

        panel.style.display = 'block';
        panel.scrollIntoView({ behavior: 'smooth' });
    }

    generateBlogHTML() {
        const html = this.posts.map(post => `
            <article class="blog-card">
                <div class="date">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <h3>${post.title}</h3>
                <div class="blog-tags">
                    ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
                <p class="excerpt">${post.excerpt}</p>
            </article>
        `).join('');

        localStorage.setItem('generatedBlogHTML', html);
        console.log('Blog HTML generated and saved to localStorage');
    }

    showMessage(message, type) {
        const existingMsg = document.querySelector('.admin-message');
        if (existingMsg) existingMsg.remove();

        const msg = document.createElement('div');
        msg.className = `admin-message ${type === 'success' ? 'success-message' : 'error-message'}`;
        msg.textContent = message;
        msg.style.position = 'fixed';
        msg.style.top = '20px';
        msg.style.right = '20px';
        msg.style.padding = '1rem 1.5rem';
        msg.style.borderRadius = '6px';
        msg.style.zIndex = '1000';
        msg.style.background = type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)';
        msg.style.color = 'white';

        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
    }

    initCanvas() {
        const canvas = document.getElementById('bgCanvas');
        if (canvas && typeof CanvasBackground !== 'undefined') {
            new CanvasBackground(canvas);
        }
    }
}

// Global functions for buttons
let blogAdmin;

function showTab(tab) {
    blogAdmin.showTab(tab);
}

function logout() {
    blogAdmin.logout();
}

function savePost() {
    blogAdmin.savePost();
}

function previewPost() {
    blogAdmin.previewPost();
}

function clearForm() {
    blogAdmin.clearForm();
}

// Setup function for initial password configuration
async function setupAdminPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    localStorage.setItem('adminPasswordHash', hash);
    console.log('Admin password configured successfully!');
    console.log('You can now login with username: admin');
    return hash;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    blogAdmin = new BlogAdmin();

    // Set default date
    const dateInput = document.getElementById('postDate');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }

    // Console instructions
    console.log('🔐 Blog Admin System');
    console.log('To set up admin password, run: await setupAdminPassword("your-secure-password")');
    console.log('Then login with username: admin and your password');
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});
