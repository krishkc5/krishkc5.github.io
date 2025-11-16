const express = require('express');
const { db } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');
const { validatePost, validatePostId } = require('../middleware/validation');

const router = express.Router();

// Helper function to create slug from title
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

// Helper function to get post with tags
function getPostWithTags(postId) {
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);
    if (!post) return null;

    const tags = db.prepare(`
        SELECT t.name
        FROM tags t
        JOIN post_tags pt ON t.id = pt.tag_id
        WHERE pt.post_id = ?
    `).all(postId);

    return {
        ...post,
        tags: tags.map(t => t.name),
        published: Boolean(post.published)
    };
}

// Get all published posts (public endpoint)
router.get('/', (req, res) => {
    try {
        const posts = db.prepare(`
            SELECT id, title, slug, excerpt, date, created_at, modified_at
            FROM posts
            WHERE published = 1
            ORDER BY date DESC
        `).all();

        // Add tags to each post
        const postsWithTags = posts.map(post => {
            const tags = db.prepare(`
                SELECT t.name
                FROM tags t
                JOIN post_tags pt ON t.id = pt.tag_id
                WHERE pt.post_id = ?
            `).all(post.id);

            return {
                ...post,
                tags: tags.map(t => t.name)
            };
        });

        res.json(postsWithTags);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Get single post by slug (public endpoint)
router.get('/slug/:slug', (req, res) => {
    try {
        const post = db.prepare(`
            SELECT * FROM posts
            WHERE slug = ? AND published = 1
        `).get(req.params.slug);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const tags = db.prepare(`
            SELECT t.name
            FROM tags t
            JOIN post_tags pt ON t.id = pt.tag_id
            WHERE pt.post_id = ?
        `).all(post.id);

        res.json({
            ...post,
            tags: tags.map(t => t.name)
        });
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});

// Get all posts including unpublished (admin only)
router.get('/admin/all', authenticateToken, (req, res) => {
    try {
        const posts = db.prepare(`
            SELECT * FROM posts
            ORDER BY date DESC
        `).all();

        const postsWithTags = posts.map(post => {
            const tags = db.prepare(`
                SELECT t.name
                FROM tags t
                JOIN post_tags pt ON t.id = pt.tag_id
                WHERE pt.post_id = ?
            `).all(post.id);

            return {
                ...post,
                tags: tags.map(t => t.name),
                published: Boolean(post.published)
            };
        });

        res.json(postsWithTags);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

// Create new post (admin only)
router.post('/', authenticateToken, validatePost, (req, res) => {
    try {
        const { title, excerpt, content, date, tags } = req.body;
        const slug = createSlug(title);

        // Check if slug already exists
        const existing = db.prepare('SELECT id FROM posts WHERE slug = ?').get(slug);
        if (existing) {
            return res.status(400).json({ error: 'A post with this title already exists' });
        }

        // Insert post
        const result = db.prepare(`
            INSERT INTO posts (title, slug, excerpt, content, date, author_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(title, slug, excerpt, content, date, req.user.userId);

        const postId = result.lastInsertRowid;

        // Insert tags
        if (tags && tags.length > 0) {
            const insertTag = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)');
            const getTagId = db.prepare('SELECT id FROM tags WHERE name = ?');
            const linkTag = db.prepare('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)');

            for (const tagName of tags) {
                insertTag.run(tagName);
                const tag = getTagId.get(tagName);
                linkTag.run(postId, tag.id);
            }
        }

        const post = getPostWithTags(postId);
        res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Update post (admin only)
router.put('/:id', authenticateToken, validatePostId, validatePost, (req, res) => {
    try {
        const { id } = req.params;
        const { title, excerpt, content, date, tags, published } = req.body;

        // Check if post exists
        const existing = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
        if (!existing) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const slug = createSlug(title);

        // Check if new slug conflicts with another post
        const conflicting = db.prepare('SELECT id FROM posts WHERE slug = ? AND id != ?').get(slug, id);
        if (conflicting) {
            return res.status(400).json({ error: 'A post with this title already exists' });
        }

        // Update post
        db.prepare(`
            UPDATE posts
            SET title = ?, slug = ?, excerpt = ?, content = ?, date = ?,
                published = ?, modified_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(title, slug, excerpt, content, date, published ? 1 : 0, id);

        // Update tags - remove old ones and add new ones
        db.prepare('DELETE FROM post_tags WHERE post_id = ?').run(id);

        if (tags && tags.length > 0) {
            const insertTag = db.prepare('INSERT OR IGNORE INTO tags (name) VALUES (?)');
            const getTagId = db.prepare('SELECT id FROM tags WHERE name = ?');
            const linkTag = db.prepare('INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)');

            for (const tagName of tags) {
                insertTag.run(tagName);
                const tag = getTagId.get(tagName);
                linkTag.run(id, tag.id);
            }
        }

        const post = getPostWithTags(id);
        res.json(post);
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Failed to update post' });
    }
});

// Delete post (admin only)
router.delete('/:id', authenticateToken, validatePostId, (req, res) => {
    try {
        const { id } = req.params;

        const result = db.prepare('DELETE FROM posts WHERE id = ?').run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

module.exports = router;
