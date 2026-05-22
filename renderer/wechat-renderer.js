/**
 * 微信公众号专用 Markdown 渲染器
 * 直接从 Markdown 源文本渲染成带完整内联样式的 HTML
 * 支持主题样式配置
 */

window.wechatRenderer = {
  /**
   * 将 Markdown 渲染为微信公众号专用 HTML
   * @param {string} markdown - Markdown 源文本
   * @param {object} template - 主题配置对象
   * @returns {string} 带完整内联样式的 HTML
   */
  renderMarkdownForWeChat(markdown, template) {
    if (!markdown || markdown.trim() === '') {
      throw new Error('Markdown 内容为空');
    }

    // 如果没有传入主题，使用默认主题
    if (!template && window.templates) {
      template = window.templates.default;
    }

    const styles = template?.styles || {};

    console.log('[WeChatRenderer] Using template:', template?.name || 'default');
    console.log('[WeChatRenderer] Markdown length:', markdown.length);

    // 配置 marked 渲染器
    const renderer = new marked.Renderer();

    // 段落：用 section 包裹，应用主题样式
    renderer.paragraph = (text) => {
      return `<section style="margin: 20px 0; padding: 0; line-height: 2; font-size: ${styles.bodySize || '16px'}; color: ${styles.bodyColor || '#333'}; font-family: ${styles.bodyFont || 'sans-serif'}; display: block; clear: both; min-height: 2em;">${text}</section>`;
    };

    // 标题：用 section 包裹
    renderer.heading = (text, level) => {
      let style = '';
      if (level === 1) {
        style = `font-size: ${styles.titleSize || '32px'}; font-weight: ${styles.titleWeight || '700'}; color: ${styles.titleColor || '#1a1a1a'}; margin: 30px 0 20px 0; font-family: ${styles.titleFont || 'sans-serif'}; display: block; clear: both; line-height: 1.5; padding: 10px 0;`;
      } else if (level === 2) {
        const borderColor = styles.h2BorderColor || '#e2e8f0';
        style = `font-size: ${styles.h2Size || '24px'}; font-weight: ${styles.h2Weight || '600'}; color: ${styles.h2Color || '#1a1a1a'}; margin: 30px 0 15px 0; padding: 10px 0 10px 0; border-bottom: 2px solid ${borderColor}; font-family: ${styles.h2Font || 'sans-serif'}; display: block; clear: both; line-height: 1.5;`;
      } else if (level === 3) {
        style = `font-size: ${styles.h3Size || '20px'}; font-weight: ${styles.h3Weight || '600'}; color: ${styles.h3Color || '#333'}; margin: 25px 0 12px 0; padding: 10px 0; font-family: ${styles.bodyFont || 'sans-serif'}; display: block; clear: both; line-height: 1.5;`;
      } else {
        style = `font-size: 18px; font-weight: 600; color: ${styles.bodyColor || '#333'}; margin: 20px 0 10px 0; padding: 10px 0; font-family: ${styles.bodyFont || 'sans-serif'}; display: block; clear: both; line-height: 1.5;`;
      }
      return `<section style="${style}">${text}</section>`;
    };

    // 列表：用 section 包裹
    renderer.list = (body, ordered) => {
      const tag = ordered ? 'ol' : 'ul';
      const listStyle = ordered
        ? `list-style-type: decimal; padding-left: 30px; margin: 20px 0;`
        : `list-style-type: disc; padding-left: 30px; margin: 20px 0;`;
      return `<section style="display: block; clear: both;"><${tag} style="${listStyle} color: ${styles.bodyColor || '#333'}; font-size: ${styles.bodySize || '16px'}; line-height: 2;">${body}</${tag}></section>`;
    };

    renderer.listitem = (text) => {
      return `<li style="margin: 12px 0; padding: 5px 0; display: list-item; min-height: 2em; line-height: 2;">${text}</li>`;
    };

    // 代码块：用 section 包裹
    renderer.code = (code, language) => {
      const bgColor = styles.codeBlockBg || '#f6f8fa';
      const borderColor = styles.codeBlockBorder || '#e1e4e8';
      const textColor = styles.codeColor || '#24292e';
      return `<section style="display: block; clear: both; margin: 20px 0;"><pre style="background: ${bgColor}; border: 1px solid ${borderColor}; border-radius: 6px; padding: 16px; overflow-x: auto; margin: 0;"><code style="font-family: 'Consolas', 'Monaco', monospace; font-size: 14px; color: ${textColor}; line-height: 1.6; display: block;">${this.escapeHtml(code)}</code></pre></section>`;
    };

    // 行内代码
    renderer.codespan = (code) => {
      const bgColor = styles.codeBg || '#f6f8fa';
      const textColor = styles.codeColor || '#d73a49';
      return `<code style="background: ${bgColor}; color: ${textColor}; padding: 2px 6px; border-radius: 3px; font-family: 'Consolas', 'Monaco', monospace; font-size: 0.9em;">${this.escapeHtml(code)}</code>`;
    };

    // 引用块：用 section 包裹
    renderer.blockquote = (quote) => {
      const borderColor = styles.blockquoteBorderColor || '#4fc3f7';
      const bgColor = styles.blockquoteBg === 'transparent' ? '#f6f8fa' : (styles.blockquoteBg || '#f6f8fa');
      const textColor = styles.blockquoteColor || '#6a737d';
      return `<section style="display: block; clear: both; margin: 20px 0;"><blockquote style="border-left: 4px solid ${borderColor}; background: ${bgColor}; padding: 15px 20px; margin: 0; color: ${textColor}; font-style: italic; line-height: 1.8;">${quote}</blockquote></section>`;
    };

    // 分割线：用 section 包裹
    renderer.hr = () => {
      const color = styles.hrColor || '#e1e4e8';
      return `<section style="display: block; clear: both; margin: 30px 0;"><hr style="border: none; border-top: 2px solid ${color}; margin: 0;"/></section>`;
    };

    // 表格：用 section 包裹
    renderer.table = (header, body) => {
      const borderColor = styles.tableBorderColor || '#e1e4e8';
      return `<section style="display: block; clear: both; margin: 20px 0; overflow-x: auto;"><table style="border-collapse: collapse; width: 100%; border: 1px solid ${borderColor};">${header}${body}</table></section>`;
    };

    renderer.tablerow = (content) => {
      return `<tr>${content}</tr>`;
    };

    renderer.tablecell = (content, flags) => {
      const tag = flags.header ? 'th' : 'td';
      const borderColor = styles.tableBorderColor || '#e1e4e8';
      const style = flags.header
        ? `background: ${styles.tableHeaderBg || '#f6f8fa'}; color: ${styles.tableHeaderColor || '#24292e'}; font-weight: 600; padding: 12px; border: 1px solid ${borderColor}; text-align: left;`
        : `padding: 12px; border: 1px solid ${borderColor}; color: ${styles.bodyColor || '#333'};`;
      return `<${tag} style="${style}">${content}</${tag}>`;
    };

    // 强调
    renderer.strong = (text) => {
      return `<strong style="font-weight: bold; color: ${styles.strongColor || '#1a1a1a'};">${text}</strong>`;
    };

    renderer.em = (text) => {
      return `<em style="font-style: italic; color: ${styles.emColor || '#4fc3f7'};">${text}</em>`;
    };

    // 链接
    renderer.link = (href, title, text) => {
      const linkColor = styles.linkColor || '#0969da';
      const titleAttr = title ? ` title="${title}"` : '';
      return `<a href="${href}"${titleAttr} style="color: ${linkColor}; text-decoration: none; border-bottom: 1px solid ${linkColor};">${text}</a>`;
    };

    // 图片：用 section 包裹
    renderer.image = (href, title, text) => {
      const titleAttr = title ? ` title="${title}"` : '';
      const altAttr = text ? ` alt="${text}"` : '';
      return `<section style="display: block; clear: both; margin: 20px 0; text-align: center;"><img src="${href}"${altAttr}${titleAttr} style="max-width: 100%; height: auto; border-radius: 4px;"/></section>`;
    };

    // 配置 marked
    marked.setOptions({
      renderer: renderer,
      gfm: true,
      breaks: true,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false
    });

    // 渲染 Markdown
    const html = marked.parse(markdown);

    console.log('[WeChatRenderer] Rendered HTML length:', html.length);
    console.log('[WeChatRenderer] HTML sample:', html.substring(0, 300));

    return html;
  },

  /**
   * HTML 转义
   */
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
};

console.log('[WeChatRenderer] Module loaded');
