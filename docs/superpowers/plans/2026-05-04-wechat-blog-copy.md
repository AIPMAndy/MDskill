# Implementation Plan: WeChat & Blog Copy Feature

**Created:** 2026-05-04  
**Status:** Ready for Implementation  
**Design Doc:** [docs/superpowers/specs/2026-05-04-wechat-blog-copy-design.md](../specs/2026-05-04-wechat-blog-copy-design.md)  
**Estimated Duration:** 4 days  
**Complexity:** Medium-High

---

## Overview

This plan implements three new professional features for MDSKILL:
1. **WeChat Official Account Copy** - Fully inlined styles compliant with WeChat CSS whitelist
2. **Blog Platform Copy** - Optimized HTML for general blog platforms
3. **HTML Source Export** - Raw HTML with embedded styles
4. **Theme Expansion** - Add 13 new themes from PageSkill (total 21 themes)
5. **Theme Preview Panel** - Visual theme selector with live previews

All features are **Professional Edition exclusive**.

---

## Implementation Phases

### Phase 1: Core Copy Utilities Module (Day 1)
**Goal:** Build the foundation for all copy operations

#### 1.1 Create `renderer/copy-utils.js`
**Estimated Lines:** ~400  
**Dependencies:** None

**Tasks:**
- [ ] Create file structure with module exports
- [ ] Implement `inlineComputedStyles(element)` function
  - Clone DOM element deeply
  - Traverse all nodes recursively
  - Get computed styles via `window.getComputedStyle()`
  - Apply styles inline to `style` attribute
  - Remove `class` and `id` attributes
  - Handle special cases: `<pre>`, `<code>`, `<table>`
- [ ] Implement `copyForWeChat(htmlContent, themeName)` function
  - Create temporary container
  - Render HTML with current theme
  - Call `inlineComputedStyles()`
  - Apply WeChat CSS whitelist filtering
  - Sanitize: remove `<script>`, `<style>`, event handlers
  - Copy to clipboard via `navigator.clipboard.writeText()`
  - Return success/failure status
- [ ] Implement `copyForBlog(htmlContent, themeName)` function
  - Similar to WeChat but less restrictive
  - Keep semantic HTML structure
  - Inline critical styles only
  - Preserve `class` for blog platform compatibility
- [ ] Implement `copyHTMLSource(htmlContent, themeName)` function
  - Generate complete HTML document
  - Embed `<style>` block with theme CSS
  - Include meta tags and charset
  - Copy full source to clipboard
- [ ] Implement `showToast(message, type)` function
  - Create toast element dynamically
  - Position: bottom-center, fixed
  - Auto-dismiss after 3 seconds
  - Support types: 'success', 'error', 'info'
  - Smooth fade-in/fade-out animation

**Testing:**
- Unit test each function with sample HTML
- Verify clipboard operations work
- Test WeChat whitelist filtering accuracy

**Files Modified:**
- `renderer/copy-utils.js` (new, ~400 lines)

---

### Phase 2: Theme Expansion (Day 1-2)
**Goal:** Integrate 13 PageSkill themes into MDSKILL

#### 2.1 Extend `renderer/templates.js`
**Current Lines:** 483  
**Estimated Addition:** ~600 lines  
**Final Size:** ~1083 lines

**Tasks:**
- [ ] Study PageSkill theme structure (`/tmp/pageskill/src/templates/index.ts`)
- [ ] Convert TypeScript interfaces to JavaScript objects
- [ ] Add 13 new theme definitions:
  
  **Business Category (3 themes):**
  - [ ] `professional` - Clean corporate style
  - [ ] `executive` - High-end business reports
  - [ ] `consulting` - Consulting presentation style
  
  **Creative Category (3 themes):**
  - [ ] `magazine` - Magazine layout with columns
  - [ ] `artistic` - Creative with decorative elements
  - [ ] `playful` - Colorful and energetic
  
  **Tech Category (3 themes):**
  - [ ] `code` - Developer-focused monospace
  - [ ] `terminal` - Terminal/console aesthetic
  - [ ] `cyberpunk` - Futuristic neon style
  
  **Minimal Category (2 themes):**
  - [ ] `zen` - Ultra-minimal whitespace
  - [ ] `paper` - Paper-like texture
  
  **Story Category (2 themes):**
  - [ ] `novel` - Book-like reading experience
  - [ ] `journal` - Personal diary style

- [ ] For each theme, define:
  ```javascript
  {
    id: 'theme-id',
    name: 'Theme Name',
    description: 'Brief description',
    category: 'business|creative|tech|minimal|story',
    isPro: true,  // All new themes are Pro
    styles: {
      // 60+ style properties covering:
      // - Page layout (background, padding, max-width)
      // - Typography (h1-h6, paragraph, blockquote)
      // - Code blocks (pre, code, inline code)
      // - Lists (ul, ol, li)
      // - Tables (table, thead, tbody, tr, th, td)
      // - Images (img, figure, figcaption)
      // - Links (a, a:hover)
      // - Horizontal rules (hr)
      // - Special elements (mark, kbd, etc.)
    }
  }
  ```

- [ ] Mark existing 8 themes:
  - Keep `default` as free
  - Mark others as `isPro: true` (github, vue, juejin, smartblue, cyanosis, channing-cyan, fancy)

- [ ] Add theme categories array:
  ```javascript
  export const themeCategories = [
    { id: 'all', name: '全部主题' },
    { id: 'business', name: '商务' },
    { id: 'creative', name: '创意' },
    { id: 'tech', name: '技术' },
    { id: 'minimal', name: '极简' },
    { id: 'story', name: '故事' }
  ];
  ```

**Testing:**
- Render sample markdown with each theme
- Verify visual consistency with PageSkill
- Test theme switching in UI
- Verify Pro license check for new themes

**Files Modified:**
- `renderer/templates.js` (+600 lines, total ~1083 lines)

---

### Phase 3: UI Integration (Day 2-3)
**Goal:** Add copy buttons, menu items, and keyboard shortcuts

#### 3.1 Update `renderer/renderer.js`
**Current Lines:** 498  
**Estimated Addition:** ~100 lines  
**Final Size:** ~598 lines

**Tasks:**
- [ ] Import `copy-utils.js` functions
- [ ] Add toolbar copy buttons (after existing buttons):
  ```html
  <button id="copy-wechat-btn" title="复制到微信公众号 (⌘⇧W)">
    <i class="icon-wechat"></i> 微信
  </button>
  <button id="copy-blog-btn" title="复制到博客 (⌘⇧B)">
    <i class="icon-blog"></i> 博客
  </button>
  <button id="copy-html-btn" title="复制HTML源码 (⌘⇧H)">
    <i class="icon-code"></i> HTML
  </button>
  ```
- [ ] Add button styles to existing CSS
- [ ] Implement event handlers:
  ```javascript
  document.getElementById('copy-wechat-btn').addEventListener('click', async () => {
    if (!window.licenseManager.isPro()) {
      showToast('此功能需要专业版授权', 'error');
      return;
    }
    const html = previewElement.innerHTML;
    const theme = currentTheme;
    const success = await copyForWeChat(html, theme);
    if (success) {
      showToast('已复制到剪贴板，可直接粘贴到微信公众号编辑器', 'success');
    } else {
      showToast('复制失败，请重试', 'error');
    }
  });
  // Similar for copy-blog-btn and copy-html-btn
  ```
- [ ] Add keyboard shortcut listeners:
  ```javascript
  document.addEventListener('keydown', (e) => {
    if (e.metaKey && e.shiftKey) {
      if (e.key === 'W') {
        e.preventDefault();
        document.getElementById('copy-wechat-btn').click();
      } else if (e.key === 'B') {
        e.preventDefault();
        document.getElementById('copy-blog-btn').click();
      } else if (e.key === 'H') {
        e.preventDefault();
        document.getElementById('copy-html-btn').click();
      }
    }
  });
  ```
- [ ] Update theme selector to show categories
- [ ] Add Pro badge to theme options

**Testing:**
- Click each button and verify clipboard content
- Test keyboard shortcuts
- Verify Pro license checks work
- Test with different themes

**Files Modified:**
- `renderer/renderer.js` (+100 lines, total ~598 lines)

#### 3.2 Update `main.js`
**Current Lines:** 410  
**Estimated Addition:** ~30 lines  
**Final Size:** ~440 lines

**Tasks:**
- [ ] Add "Export" submenu to main menu:
  ```javascript
  {
    label: '导出',
    submenu: [
      {
        label: '复制到微信公众号',
        accelerator: 'CmdOrCtrl+Shift+W',
        click: () => {
          mainWindow.webContents.send('copy-wechat');
        }
      },
      {
        label: '复制到博客',
        accelerator: 'CmdOrCtrl+Shift+B',
        click: () => {
          mainWindow.webContents.send('copy-blog');
        }
      },
      {
        label: '复制HTML源码',
        accelerator: 'CmdOrCtrl+Shift+H',
        click: () => {
          mainWindow.webContents.send('copy-html');
        }
      },
      { type: 'separator' },
      {
        label: '导出为PDF',
        accelerator: 'CmdOrCtrl+P',
        click: exportPDF  // Existing function
      }
    ]
  }
  ```
- [ ] Add IPC handlers in `renderer.js` to receive menu events:
  ```javascript
  ipcRenderer.on('copy-wechat', () => {
    document.getElementById('copy-wechat-btn').click();
  });
  // Similar for copy-blog and copy-html
  ```

**Testing:**
- Test menu items trigger copy operations
- Verify keyboard shortcuts work from menu
- Test on macOS and Windows (if applicable)

**Files Modified:**
- `main.js` (+30 lines, total ~440 lines)
- `renderer/renderer.js` (+10 lines for IPC handlers)

---

### Phase 4: Theme Preview Panel (Day 3-4)
**Goal:** Build visual theme selector with live previews

#### 4.1 Create `renderer/theme-preview.html`
**Estimated Lines:** ~100

**Tasks:**
- [ ] Create modal overlay structure:
  ```html
  <div id="theme-preview-modal" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h2>选择主题</h2>
        <button class="close-btn">&times;</button>
      </div>
      <div class="modal-body">
        <div class="category-tabs">
          <!-- Category filter tabs -->
        </div>
        <div class="theme-grid">
          <!-- Theme preview cards -->
        </div>
      </div>
    </div>
  </div>
  ```
- [ ] Add CSS for modal, grid layout, and cards
- [ ] Design theme card:
  - Thumbnail preview (rendered sample)
  - Theme name
  - Description
  - Pro badge (if applicable)
  - Hover effect
  - Selected state

**Files Created:**
- `renderer/theme-preview.html` (new, ~100 lines)

#### 4.2 Create `renderer/theme-preview.js`
**Estimated Lines:** ~100

**Tasks:**
- [ ] Import themes from `templates.js`
- [ ] Implement `renderThemeGrid(category)` function
  - Filter themes by category
  - Generate preview cards dynamically
  - Render sample markdown for each theme
  - Attach click handlers
- [ ] Implement `openThemePreview()` function
  - Show modal
  - Render grid with current category
  - Highlight current theme
- [ ] Implement `closeThemePreview()` function
- [ ] Implement `selectTheme(themeId)` function
  - Check Pro license if needed
  - Apply theme to editor
  - Close modal
  - Save preference
- [ ] Add category tab switching logic

**Testing:**
- Open preview panel and verify all themes render
- Test category filtering
- Test theme selection
- Verify Pro license checks
- Test modal close behavior

**Files Created:**
- `renderer/theme-preview.js` (new, ~100 lines)

#### 4.3 Integrate into `renderer/renderer.js`
**Estimated Addition:** ~20 lines

**Tasks:**
- [ ] Import theme preview module
- [ ] Replace existing theme dropdown with "选择主题" button
- [ ] Bind button click to `openThemePreview()`
- [ ] Load theme preview HTML into DOM on startup

**Files Modified:**
- `renderer/renderer.js` (+20 lines)

---

### Phase 5: Testing & Optimization (Day 4)
**Goal:** Comprehensive testing and performance optimization

#### 5.1 Functional Testing
**Tasks:**
- [ ] Test all three copy formats with various markdown samples:
  - Simple text with headings
  - Code blocks (inline and fenced)
  - Tables
  - Lists (ordered, unordered, nested)
  - Images
  - Blockquotes
  - Links
- [ ] Test with all 21 themes
- [ ] Verify WeChat paste works in official editor
- [ ] Test blog paste in common platforms (WordPress, Medium, etc.)
- [ ] Test HTML source export opens correctly in browsers
- [ ] Test Pro license checks for all features
- [ ] Test keyboard shortcuts on macOS
- [ ] Test menu items trigger correct actions
- [ ] Test theme preview panel:
  - Category filtering
  - Theme selection
  - Pro badge display
  - Modal open/close

#### 5.2 Edge Case Testing
**Tasks:**
- [ ] Test with very long documents (10,000+ words)
- [ ] Test with documents containing special characters
- [ ] Test with empty document
- [ ] Test rapid theme switching
- [ ] Test rapid copy operations
- [ ] Test clipboard operations when clipboard is locked
- [ ] Test with expired Pro license
- [ ] Test with no license (free version)

#### 5.3 Performance Optimization
**Tasks:**
- [ ] Profile `inlineComputedStyles()` performance
  - Optimize DOM traversal if needed
  - Consider caching computed styles
- [ ] Profile theme preview rendering
  - Lazy load theme previews
  - Use virtual scrolling if needed
- [ ] Minimize memory usage during copy operations
  - Clean up temporary DOM elements
  - Release clipboard references
- [ ] Optimize CSS for theme preview modal
  - Use CSS transforms for animations
  - Minimize reflows

#### 5.4 Code Quality
**Tasks:**
- [ ] Add JSDoc comments to all public functions
- [ ] Add error handling for all async operations
- [ ] Add input validation for all functions
- [ ] Run ESLint and fix warnings
- [ ] Remove console.log statements
- [ ] Add TODO comments for future improvements

#### 5.5 Documentation
**Tasks:**
- [ ] Update README.md with new features
- [ ] Add usage examples for copy features
- [ ] Document keyboard shortcuts
- [ ] Add screenshots of theme preview panel
- [ ] Update feature comparison table (Free vs Pro)
- [ ] Write changelog entry for v1.3.0

---

## File Change Summary

| File | Current Lines | Added Lines | Final Lines | Status |
|------|--------------|-------------|-------------|--------|
| `renderer/copy-utils.js` | 0 | 400 | 400 | New |
| `renderer/templates.js` | 483 | 600 | 1083 | Modified |
| `renderer/renderer.js` | 498 | 130 | 628 | Modified |
| `main.js` | 410 | 30 | 440 | Modified |
| `renderer/theme-preview.html` | 0 | 100 | 100 | New |
| `renderer/theme-preview.js` | 0 | 100 | 100 | New |
| **Total** | **1391** | **1360** | **2751** | - |

---

## Dependencies

### External Libraries
- None (all features use native browser APIs)

### Internal Dependencies
- `license-manager.js` - Pro license verification
- `marked.js` - Markdown parsing (existing)
- `highlight.js` - Code syntax highlighting (existing)

---

## Risk Assessment

### High Risk
- **WeChat CSS Whitelist Compliance**: WeChat may reject styles not in whitelist
  - Mitigation: Strict filtering, manual testing in WeChat editor
- **Clipboard API Compatibility**: Older browsers may not support `navigator.clipboard`
  - Mitigation: Fallback to `document.execCommand('copy')`

### Medium Risk
- **Theme Conversion Accuracy**: PageSkill themes may not translate perfectly
  - Mitigation: Manual review of each theme, adjust as needed
- **Performance with Large Documents**: Inlining styles for 10,000+ words may be slow
  - Mitigation: Show loading indicator, optimize DOM traversal

### Low Risk
- **Keyboard Shortcut Conflicts**: May conflict with system shortcuts
  - Mitigation: Use uncommon combinations (Cmd+Shift+W/B/H)
- **Theme Preview Modal UX**: May be overwhelming with 21 themes
  - Mitigation: Category filtering, search functionality (future)

---

## Success Criteria

### Functional Requirements
- ✅ All three copy formats work correctly
- ✅ WeChat paste works in official editor without style loss
- ✅ Blog paste works in WordPress, Medium, etc.
- ✅ HTML source export opens correctly in browsers
- ✅ All 21 themes render correctly
- ✅ Theme preview panel displays all themes
- ✅ Pro license checks work for all features
- ✅ Keyboard shortcuts work as expected
- ✅ Menu items trigger correct actions

### Non-Functional Requirements
- ✅ Copy operations complete in < 2 seconds for typical documents
- ✅ Theme preview panel loads in < 1 second
- ✅ No memory leaks during repeated operations
- ✅ Code passes ESLint with no warnings
- ✅ All functions have JSDoc comments
- ✅ README.md updated with new features

---

## Rollout Plan

### Version 1.3.0 Release
1. Complete all implementation phases
2. Run full test suite
3. Update version in `package.json`
4. Update README.md and CHANGELOG.md
5. Build DMG for macOS
6. Test DMG installation
7. Create GitHub release with release notes
8. Tag commit as `v1.3.0`
9. Push to GitHub

### Post-Release
1. Monitor user feedback
2. Fix critical bugs in patch releases (v1.3.1, v1.3.2, etc.)
3. Plan future enhancements:
   - Theme search functionality
   - Custom theme editor
   - More export formats (Markdown, Word, etc.)
   - Batch export for multiple files

---

## Execution Options

### Option A: Subagent-Driven Implementation (Recommended)
- Spawn specialized agents for each phase
- Parallel execution where possible
- Faster completion (estimated 2-3 hours)
- Better error isolation

### Option B: Inline Execution
- Implement step-by-step in main conversation
- Sequential execution
- Slower completion (estimated 4-6 hours)
- More context retention

**Recommendation:** Use Option A for faster delivery. Spawn agents for:
1. Phase 1 (copy-utils.js)
2. Phase 2 (templates.js)
3. Phase 3 (UI integration)
4. Phase 4 (theme preview)

Then run Phase 5 (testing) in main conversation to review all changes.

---

## Next Steps

1. **User Approval**: Review this plan and approve
2. **Execution**: Choose Option A or B
3. **Implementation**: Execute phases 1-4
4. **Testing**: Run comprehensive tests (Phase 5)
5. **Release**: Build and release v1.3.0

**Ready to proceed?** Reply with:
- "Start with Option A" (subagent-driven)
- "Start with Option B" (inline execution)
- Or provide feedback on the plan
