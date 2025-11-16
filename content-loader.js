// Simple Markdown Parser and Content Loader
class ContentLoader {
    constructor() {
        this.cache = {};
    }

    // Parse simple markdown to HTML
    parseMarkdown(md) {
        if (!md) return '';

        // Trim the markdown
        md = md.trim();

        // Split into blocks (paragraphs, lists, etc.)
        const lines = md.split('\n');
        let html = '';
        let inList = false;
        let currentParagraph = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Handle list items
            if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
                if (currentParagraph) {
                    html += `<p>${this.parseInline(currentParagraph)}</p>`;
                    currentParagraph = '';
                }
                if (!inList) {
                    html += '<ul>';
                    inList = true;
                }
                html += `<li>${this.parseInline(line.trim().substring(2))}</li>`;
            } else if (line.trim() === '') {
                // Empty line - end current paragraph
                if (currentParagraph) {
                    html += `<p>${this.parseInline(currentParagraph)}</p>`;
                    currentParagraph = '';
                }
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
            } else {
                // Regular text - add to current paragraph
                if (inList) {
                    html += '</ul>';
                    inList = false;
                }
                if (currentParagraph) currentParagraph += ' ';
                currentParagraph += line.trim();
            }
        }

        // Close any remaining paragraph or list
        if (currentParagraph) {
            html += `<p>${this.parseInline(currentParagraph)}</p>`;
        }
        if (inList) {
            html += '</ul>';
        }

        return html;
    }

    // Parse inline markdown (bold, italic, links)
    parseInline(text) {
        return text
            // Bold
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Italic (but not if part of **)
            .replace(/\*(?!\*)(.*?)\*/g, '<em>$1</em>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
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
