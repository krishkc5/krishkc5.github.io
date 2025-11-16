// Production-ready API client for blog management
class BlogAPI {
    constructor(baseURL = '/api') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('authToken');
    }

    // Helper method for making requests
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Auth methods
    async login(username, password) {
        try {
            const data = await this.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });

            this.token = data.token;
            localStorage.setItem('authToken', data.token);
            return data;
        } catch (error) {
            throw new Error('Login failed: ' + error.message);
        }
    }

    async verifyToken() {
        try {
            return await this.request('/auth/verify');
        } catch (error) {
            this.logout();
            return { valid: false };
        }
    }

    logout() {
        this.token = null;
        localStorage.removeItem('authToken');
    }

    // Post methods
    async getPosts() {
        return await this.request('/posts');
    }

    async getPostBySlug(slug) {
        return await this.request(`/posts/slug/${slug}`);
    }

    async getAllPosts() {
        return await this.request('/posts/admin/all');
    }

    async createPost(postData) {
        return await this.request('/posts', {
            method: 'POST',
            body: JSON.stringify(postData)
        });
    }

    async updatePost(id, postData) {
        return await this.request(`/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify(postData)
        });
    }

    async deletePost(id) {
        return await this.request(`/posts/${id}`, {
            method: 'DELETE'
        });
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BlogAPI;
}
