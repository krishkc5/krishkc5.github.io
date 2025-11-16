// Production Admin Interface with Backend API
class BlogAdminProduction {
    constructor() {
        this.api = new BlogAPI(window.location.origin + '/api');
        this.posts = [];
        this.currentTags = [];
        this.editingId = null;
        this.init();
    }

    async init() {
        // Check if already logged in
        const token = localStorage.getItem('authToken');
        if (token) {
            const result = await this.api.verifyToken();
            if (result.valid) {
                this.showAdminInterface();
                return;
            }
        }

        this.setupEventListeners();
        this.initCanvas();
    }

    setupEventListeners() {
        // Login form
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

        // Post form
        document.getElementById('postForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePost();
        });
    }

    async handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('loginError');
        const submitBtn = document.querySelector('#loginForm button[type="submit"]');

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Signing in...';
            errorEl.textContent = '';

            await this.api.login(username, password);
            this.showAdminInterface();
        } catch (error) {
            errorEl.textContent = error.message;
            document.getElementById('password').value = '';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
        }
    }

    async showAdminInterface() {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminInterface').style.display = 'block';
        await this.loadBlogList();
    }

    logout() {
        this.api.logout();
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

    // Tag management
    addTag() {
        const input = document.getElementById('tagInput');
        const tag = input.value.trim();

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

    // Post CRUD operations
    async loadBlogList() {
        const container = document.getElementById('blogListContainer');

        try {
            container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">Loading...</p>';

            this.posts = await this.api.getAllPosts();

            if (this.posts.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">No blog posts yet. Create your first post!</p>';
                return;
            }

            container.innerHTML = '';
            this.posts.forEach(post => {
                const item = this.createBlogListItem(post);
                container.appendChild(item);
            });
        } catch (error) {
            console.error('Error loading posts:', error);
            container.innerHTML = `<p style="text-align: center; color: var(--accent-red); padding: 2rem;">Error loading posts: ${error.message}</p>`;
        }
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
        meta.textContent = `${new Date(post.date).toLocaleDateString()} • ${post.published ? 'Published' : 'Draft'}`;

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

    async savePost() {
        const title = document.getElementById('postTitle').value.trim();
        const date = document.getElementById('postDate').value;
        const excerpt = document.getElementById('postExcerpt').value.trim();
        const content = document.getElementById('postContent').value.trim();

        if (!title || !date || !excerpt || !content) {
            alert('Please fill in all required fields');
            return;
        }

        const postData = {
            title,
            date,
            excerpt,
            content,
            tags: this.currentTags,
            published: true
        };

        try {
            const submitBtn = document.querySelector('.btn-primary');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Saving...';

            if (this.editingId) {
                await this.api.updatePost(this.editingId, postData);
                this.showMessage('Post updated successfully!', 'success');
            } else {
                await this.api.createPost(postData);
                this.showMessage('Post created successfully!', 'success');
            }

            this.clearForm();
            this.showTab('manage');
        } catch (error) {
            console.error('Error saving post:', error);
            this.showMessage('Error saving post: ' + error.message, 'error');
        } finally {
            const submitBtn = document.querySelector('.btn-primary');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Save Post';
        }
    }

    async editPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        this.editingId = postId;
        document.getElementById('postTitle').value = post.title;
        document.getElementById('postDate').value = post.date;
        document.getElementById('postExcerpt').value = post.excerpt;
        document.getElementById('postContent').value = post.content;
        this.currentTags = [...(post.tags || [])];
        this.renderTags();

        this.showTab('editor');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async deletePost(postId) {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        try {
            await this.api.deletePost(postId);
            this.showMessage('Post deleted successfully', 'success');
            await this.loadBlogList();
        } catch (error) {
            console.error('Error deleting post:', error);
            this.showMessage('Error deleting post: ' + error.message, 'error');
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

        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };

        preview.innerHTML = `
            <div class="preview-date">${escapeHtml(formattedDate)}</div>
            <h2>${escapeHtml(title)}</h2>
            <div class="preview-tags">
                ${this.currentTags.map(tag => `<span class="preview-tag">${escapeHtml(tag)}</span>`).join('')}
            </div>
            <p><strong>Excerpt:</strong> ${escapeHtml(excerpt)}</p>
            <hr style="margin: 1.5rem 0; border: 0; border-top: 1px solid var(--border);">
            <div class="preview-content">${escapeHtml(content).replace(/\n/g, '<br>')}</div>
        `;

        panel.style.display = 'block';
        panel.scrollIntoView({ behavior: 'smooth' });
    }

    showMessage(message, type) {
        const existingMsg = document.querySelector('.admin-message');
        if (existingMsg) existingMsg.remove();

        const msg = document.createElement('div');
        msg.className = `admin-message ${type === 'success' ? 'success-message' : 'error-message'}`;
        msg.textContent = message;
        msg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            z-index: 1000;
            background: ${type === 'success' ? 'var(--accent-green)' : 'var(--accent-red)'};
            color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;

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

// Global functions for button onclick handlers
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

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    blogAdmin = new BlogAdminProduction();

    // Set default date
    const dateInput = document.getElementById('postDate');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
});
