# MDskill 功能特性

## 核心功能

### 📝 Markdown 编辑
- 实时预览，所见即所得
- 支持 GitHub Flavored Markdown (GFM)
- 自动保存编辑状态
- 记住上次打开的文件

### 🎨 美观界面
- 暗色主题，护眼舒适
- GitHub 风格渲染
- 清晰的排版和间距
- 流畅的滚动体验

### 💻 代码高亮
支持 180+ 编程语言：
- JavaScript / TypeScript
- Python / Java / C++
- Go / Rust / Swift
- HTML / CSS / SQL
- Shell / Bash / Zsh
- 以及更多...

### 🔢 数学公式
完整的 LaTeX 数学公式支持：

**行内公式：**
```
质能方程：$E = mc^2$
```

**块级公式：**
```
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### ⚡️ 快捷操作
| 快捷键 | 功能 | 说明 |
|--------|------|------|
| `Cmd+N` | 新建文件 | 创建空白文档 |
| `Cmd+O` | 打开文件 | 选择本地 Markdown 文件 |
| `Cmd+S` | 保存文件 | 保存当前文档 |
| `Cmd+Shift+S` | 另存为 | 保存到新位置 |
| `Cmd+P` | 切换预览 | 显示/隐藏预览面板 |
| `Cmd+B` | 加粗文本 | 选中文本后加粗 |
| `Cmd+I` | 斜体文本 | 选中文本后倾斜 |
| `Cmd+K` | 插入链接 | 快速插入超链接 |

## 高级特性

### 📊 表格支持
完美渲染 Markdown 表格：

```markdown
| 功能 | 状态 | 优先级 |
|------|------|--------|
| 编辑 | ✅ | 高 |
| 预览 | ✅ | 高 |
| 导出 | 🔄 | 中 |
```

### ✅ 任务列表
支持交互式任务列表：

```markdown
- [x] 完成需求分析
- [x] 设计界面原型
- [ ] 开发核心功能
- [ ] 测试和优化
```

### 🔗 自动链接
自动识别并渲染：
- URL 链接
- 邮箱地址
- GitHub 用户名 (@username)
- Issue 引用 (#123)

### 📸 图片支持
支持本地和网络图片：

```markdown
![本地图片](./image.png)
![网络图片](https://example.com/image.jpg)
```

### 📝 引用块
优雅的引用样式：

```markdown
> 这是一段引用文本
> 可以多行显示
```

### 📋 代码块
支持行号和语言标识：

```markdown
\`\`\`javascript
function greet(name) {
  return `Hello, ${name}!`;
}
\`\`\`
```

## 性能优化

- ⚡️ 快速启动（< 1 秒）
- 🚀 流畅渲染（60 FPS）
- 💾 低内存占用（< 100 MB）
- 🔋 节能模式（Apple Silicon 优化）

## 文件管理

- 自动记住上次打开的文件
- 支持拖拽打开文件
- 支持 `.md`、`.markdown`、`.txt` 格式
- 自动检测文件编码（UTF-8）

## 兼容性

### 系统要求
- macOS 11.0 或更高版本
- Apple Silicon (M1/M2/M3/M4) 或 Intel 芯片
- 至少 100 MB 可用空间

### Markdown 标准
- CommonMark 规范
- GitHub Flavored Markdown (GFM)
- 扩展语法支持

## 即将推出

- [ ] 主题切换（亮色/暗色）
- [ ] 导出为 PDF/HTML
- [ ] 自定义 CSS 样式
- [ ] 多标签页支持
- [ ] 全文搜索
- [ ] Git 集成
- [ ] 云同步功能
- [ ] 插件系统

## 技术栈

- **框架：** Electron 28
- **Markdown 解析：** Marked
- **代码高亮：** Highlight.js
- **数学公式：** KaTeX
- **打包工具：** electron-builder

---

**版本：** 1.0.0  
**更新日期：** 2026-04-30  
**开发者：** Andy
