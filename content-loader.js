// Simple Markdown Parser and Content Loader
class ContentLoader {
    constructor() {
        this.cache = {};
    }

    // Parse simple markdown to HTML
    parseMarkdown(md) {
        if (!md) return '';

        let html = md
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            // Line breaks
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        return `<p>${html}</p>`;
    }

    // Parse frontmatter (YAML-like format at top of markdown files)
    parseFrontmatter(content) {
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);

        if (!match) {
            return { data: {}, content: content };
        }

        const [, frontmatter, markdown] = match;
        const data = {};

        frontmatter.split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length) {
                let value = valueParts.join(':').trim();
                // Remove quotes if present
                value = value.replace(/^["']|["']$/g, '');
                // Parse arrays
                if (value.startsWith('[') && value.endsWith(']')) {
                    value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
                }
                data[key.trim()] = value;
            }
        });

        return { data, content: markdown };
    }

    // Load markdown files from a folder
    async loadFolder(folderPath) {
        if (this.cache[folderPath]) {
            return this.cache[folderPath];
        }

        try {
            // Get list of files in the folder
            const response = await fetch(`${folderPath}/index.json`);
            if (!response.ok) {
                console.warn(`No index.json found for ${folderPath}`);
                return [];
            }

            const fileList = await response.json();
            const items = [];

            for (const filename of fileList) {
                try {
                    const fileResponse = await fetch(`${folderPath}/${filename}`);
                    if (fileResponse.ok) {
                        const content = await fileResponse.text();
                        const { data, content: markdown } = this.parseFrontmatter(content);
                        const html = this.parseMarkdown(markdown);

                        items.push({
                            filename,
                            ...data,
                            content: html,
                            raw: markdown
                        });
                    }
                } catch (err) {
                    console.error(`Error loading ${filename}:`, err);
                }
            }

            // Sort by order if specified
            items.sort((a, b) => (a.order || 999) - (b.order || 999));

            this.cache[folderPath] = items;
            return items;

        } catch (error) {
            console.error(`Error loading folder ${folderPath}:`, error);
            return [];
        }
    }

    // Clear cache
    clearCache() {
        this.cache = {};
    }
}

// Export for use
window.ContentLoader = ContentLoader;
