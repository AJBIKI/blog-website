import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Converts markdown text to safe HTML
 * @param markdown - The markdown string to convert
 * @returns Sanitized HTML string
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  // Configure marked with secure defaults
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  // Convert markdown to HTML
  const html = await marked(markdown);

  // Sanitize HTML with DOMPurify
  const sanitizedHtml = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'a', 'img', 'code', 'pre', 'blockquote',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
    ],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
  });

  return sanitizedHtml;
}