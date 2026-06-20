# 搜索定位功能修复 - 2026-06-20

## 问题描述

用户反馈：搜索功能输入关键词后定位不准确，只有左边的 Markdown 编辑器定位，右边的预览面板没有同步定位到具体位置。

## 问题根因

`renderer/document-search.js` 中的 `jumpToMatch()` 函数只实现了左侧编辑器的滚动定位，缺少右侧预览面板的同步滚动逻辑。

## 解决方案

### 1. 新增 `scrollPreviewToMatch()` 函数

**位置**: `renderer/document-search.js:412-469`

**功能**:
- 提取搜索匹配的文本和所在行
- 在预览 HTML 中查找包含该文本的元素
- 使用智能匹配算法：
  - 优先级1: 匹配包含完整行文本的元素（最精确）
  - 优先级2: 匹配包含关键词的元素，按匹配度评分
- 滚动到目标元素，使其位于视口中央
- 添加 2 秒的黄色高亮提示

**匹配策略**:
```javascript
// 优先匹配完整行
if (elementText.includes(lineText.trim())) {
  targetElement = element;
  break;
}

// 次优匹配关键词，计算匹配度得分
if (elementText.includes(matchText)) {
  const score = matchText.length / elementText.length;
  if (score > bestMatch.score) {
    bestMatch = { element, score };
  }
}
```

### 2. 修改 `jumpToMatch()` 函数

**位置**: `renderer/document-search.js:379-410`

**变更**: 在原有编辑器滚动逻辑后添加：
```javascript
// 同时滚动预览面板到对应位置
this.scrollPreviewToMatch(match, editor);
```

### 3. 添加 CSS 高亮样式

**位置**: `renderer/styles.css:678-692`

**新增样式**:
```css
/* 搜索高亮效果 */
.search-highlight-active::selection {
  background-color: #ffd700 !important;
  color: #000000 !important;
}

/* 预览面板搜索高亮 */
.preview-search-highlight {
  background-color: rgba(255, 215, 0, 0.3) !important;
  transition: background-color 0.3s ease;
  border-radius: 4px;
  padding: 2px 0;
}
```

## 修改文件清单

1. ✅ `renderer/document-search.js` - 添加预览滚动逻辑
2. ✅ `renderer/styles.css` - 添加高亮样式

## 测试建议

### 测试用例

1. **基本搜索定位**
   - 打开包含多个段落的 Markdown 文档
   - 使用 Cmd+F 打开搜索
   - 输入关键词（如"测试"）
   - 验证：左右两侧同时滚动到第一个匹配位置

2. **多结果导航**
   - 搜索出现多次的关键词
   - 点击"下一个"按钮
   - 验证：左右两侧同时跳转到下一个匹配

3. **不同元素类型**
   - 搜索在标题中的关键词 → 验证定位准确
   - 搜索在列表中的关键词 → 验证定位准确
   - 搜索在代码块中的关键词 → 验证定位准确
   - 搜索在引用块中的关键词 → 验证定位准确

4. **高亮效果**
   - 验证预览面板出现 2 秒黄色背景高亮
   - 验证编辑器选区高亮为金色

5. **边界情况**
   - 搜索文档开头的内容
   - 搜索文档结尾的内容
   - 搜索空格、特殊字符

### 测试文档

已创建测试文档：`/Users/andy/Desktop/search-test.md`

包含多种元素类型：标题、段落、列表、代码块、引用块，便于全面测试。

## 技术细节

### 为什么使用双层匹配策略？

1. **完整行匹配**：Markdown 的一行通常对应 HTML 的一个元素（段落、标题等），匹配度最高
2. **关键词匹配**：当行匹配失败时（如关键词在列表项、代码中），回退到关键词匹配
3. **得分机制**：避免匹配到包含大量文本的容器元素，优先匹配最贴近的小元素

### 为什么用 `scrollIntoView()` 而不是手动计算？

- `scrollIntoView()` 是浏览器原生 API，性能好
- `block: 'center'` 让目标元素位于视口中央，用户体验最佳
- `behavior: 'smooth'` 提供平滑滚动动画

### 错误处理

使用 `try-catch` 包裹整个函数，防止：
- 预览面板未渲染
- DOM 查询失败
- 文本不存在等边界情况

错误只输出到控制台，不影响编辑器侧的正常定位。

## 优化原则验证

### ✅ Surgical Changes（外科手术式修改）

- 只修改搜索定位相关代码
- 不重构无关功能
- 保持现有代码风格

### ✅ Simplicity First（简洁优先）

- 不引入复杂的行号映射机制
- 使用简单的文本匹配算法
- 代码量：58 行（新增函数）+ 1 行（调用）+ 15 行（CSS）

### ✅ Goal-Driven Execution（目标驱动）

- 目标：左右两侧同时精确定位搜索结果
- 验证标准：用户搜索后，预览面板滚动到对应位置并高亮

## 性能影响

- **DOM 查询**: O(n)，n = 预览元素数量（通常 < 500）
- **文本匹配**: O(m*k)，m = 元素数，k = 平均文本长度
- **触发时机**: 仅在用户主动跳转搜索结果时
- **影响评估**: 可忽略不计，现代浏览器优化良好

## 后续优化空间

如果遇到性能问题（大文档 > 10000 行），可考虑：

1. **建立位置索引**: 渲染时为每个 HTML 元素添加 `data-source-line` 属性
2. **缓存查询结果**: 同一搜索会话复用匹配结果
3. **虚拟滚动优化**: 只渲染可见区域的元素

但目前的简单方案已能满足 99% 的使用场景。

---

**修复日期**: 2026-06-20  
**修复人员**: Claude (Opus 4.8)  
**测试状态**: 待用户验证  
**原则遵循**: Surgical Changes + Simplicity First
