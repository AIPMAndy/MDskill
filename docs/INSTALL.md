# MDskill 安装指南

## 系统要求

- macOS 11.0 或更高版本
- Apple Silicon (M1/M2/M3/M4) 或 Intel 芯片

## 安装步骤

### 方法 1：使用 DMG 安装包（推荐）

1. 双击 `MDskill-1.0.0-arm64.dmg` 文件
2. 将 MDskill 图标拖拽到 Applications 文件夹
3. 打开 Applications 文件夹，双击 MDskill 启动应用
4. 首次打开时，如果提示"无法验证开发者"，请：
   - 打开 系统设置 > 隐私与安全性
   - 找到 MDskill，点击"仍要打开"
   - 或者在终端运行：`xattr -cr /Applications/MDskill.app`

### 方法 2：从源码运行

```bash
cd /Users/andy/Desktop/MDskill
npm install
npm run dev
```

## 使用说明

### 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Cmd+N` | 新建文件 |
| `Cmd+O` | 打开文件 |
| `Cmd+S` | 保存文件 |
| `Cmd+Shift+S` | 另存为 |
| `Cmd+P` | 切换预览 |
| `Cmd+B` | 加粗 |
| `Cmd+I` | 斜体 |
| `Cmd+K` | 插入链接 |

### 功能特性

#### 1. 实时预览
左侧编辑，右侧实时预览渲染效果。按 `Cmd+P` 可以切换预览模式。

#### 2. 代码高亮
支持所有主流编程语言的语法高亮：

\`\`\`javascript
function hello() {
  console.log('Hello MDskill!');
}
\`\`\`

#### 3. 数学公式
支持 LaTeX 数学公式：

行内公式：`$E = mc^2$`

块级公式：
\`\`\`math
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
\`\`\`

#### 4. 表格支持

| 功能 | 状态 |
|------|------|
| Markdown | ✅ |
| 代码高亮 | ✅ |
| 数学公式 | ✅ |
| 实时预览 | ✅ |

#### 5. 任务列表

- [x] 完成安装
- [x] 打开应用
- [ ] 开始写作

## 常见问题

### Q: 应用无法打开，提示"已损坏"
A: 在终端运行以下命令：
```bash
xattr -cr /Applications/MDskill.app
```

### Q: 如何更改主题？
A: 当前版本使用暗色主题，后续版本会支持主题切换。

### Q: 支持哪些文件格式？
A: 支持 `.md`、`.markdown`、`.txt` 格式。

### Q: 文件保存在哪里？
A: 文件保存在你选择的位置，应用会自动记住上次打开的文件。

## 技术支持

如有问题，请联系：andy@mdskill.app

---

**版本：** 1.0.0  
**更新日期：** 2026-04-30  
**适用芯片：** Apple Silicon (M1/M2/M3/M4)
