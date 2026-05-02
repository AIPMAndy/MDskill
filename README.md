# MDSKILL - 现代化 Markdown 编辑器

<div align="center">

<img src="assets/logo-new.svg" width="128" height="128" alt="MDSKILL Logo">

**为 macOS 打造的优雅 Markdown 编辑器**

[![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)](CHANGELOG.md)
[![Platform](https://img.shields.io/badge/platform-macOS-lightgrey.svg)](https://www.apple.com/macos/)
[![License](https://img.shields.io/badge/license-GPL--3.0-green.svg)](LICENSE)

[快速开始](#-安装) • [功能特性](#-特性) • [主题预览](#-8-种精美主题) • [更新日志](CHANGELOG.md)

</div>

---

## ✨ 特性

### 🎨 8 种精美主题 ⭐️ NEW in v1.1.0
- **多样化主题**：GitHub Dark/Light、Minimal、Literary、Tech Blue、Business、Warm、Purple
- **一键切换**：快速切换亮/暗模式
- **自动保存**：记住您的主题偏好
- **流畅动画**：平滑的切换过渡效果

### 🎨 优雅界面
- 现代化设计语言
- GitHub 风格渲染
- 全新渐变色 Logo
- 精致的视觉效果

### ⚡️ 实时预览
- 边写边看，所见即所得
- 分屏编辑模式
- 自动滚动同步
- 零延迟渲染

### 💻 代码高亮
- 支持 180+ 编程语言
- 自动语言检测
- GitHub 风格代码块
- 清晰的语法着色

### 🔢 数学公式
- 完整的 LaTeX 支持
- 行内和块级公式
- KaTeX 高性能渲染
- 丰富的数学符号

### ⌨️ 快捷键
- 全键盘操作
- 符合 macOS 习惯
- 快速格式化
- 高效工作流

### 🚀 高性能
- 快速启动（< 1 秒）
- 流畅渲染（60 FPS）
- 低内存占用
- Apple Silicon 原生支持

---

## 🎨 8 种精美主题

<table>
  <tr>
    <td align="center" width="25%">
      <img src="https://img.shields.io/badge/🌙-GitHub_Dark-667eea?style=for-the-badge" alt="GitHub Dark"><br>
      <sub>经典暗色</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://img.shields.io/badge/☀️-GitHub_Light-2563eb?style=for-the-badge" alt="GitHub Light"><br>
      <sub>清爽亮色</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://img.shields.io/badge/✨-Minimal-111827?style=for-the-badge" alt="Minimal"><br>
      <sub>极简现代</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://img.shields.io/badge/🌿-Literary-92400e?style=for-the-badge" alt="Literary"><br>
      <sub>文艺清新</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="25%">
      <img src="https://img.shields.io/badge/🔷-Tech_Blue-38bdf8?style=for-the-badge" alt="Tech Blue"><br>
      <sub>科技蓝</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://img.shields.io/badge/💼-Business-1e40af?style=for-the-badge" alt="Business"><br>
      <sub>商务经典</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://img.shields.io/badge/🌅-Warm-d97706?style=for-the-badge" alt="Warm"><br>
      <sub>暖色温馨</sub>
    </td>
    <td align="center" width="25%">
      <img src="https://img.shields.io/badge/💜-Purple-c084fc?style=for-the-badge" alt="Purple"><br>
      <sub>紫色梦幻</sub>
    </td>
  </tr>
</table>

查看 [主题使用指南](THEMES.md) 了解更多

---

## 📦 安装

### 系统要求
- macOS 11.0 或更高版本
- Apple Silicon (M1/M2/M3/M4) 或 Intel 芯片
- 至少 100 MB 可用空间

### 下载安装

1. 下载最新版本：[MDSKILL-1.1.0-arm64.dmg](https://github.com/yourusername/MDSKILL/releases)
2. 双击打开 DMG 文件
3. 拖拽到 Applications 文件夹
4. **右键点击**选择"打开"（首次需要）

详细安装说明请查看 [安装指南](INSTALL.md)

---

## 🚀 快速开始

### 创建新文档
```
Cmd+N 或点击"新建"按钮
```

### 切换主题
- **快速切换**：点击工具栏左侧的 🌙/☀️ 图标
- **选择主题**：点击工具栏右侧的主题下拉菜单

### 编辑 Markdown
在左侧编辑器中输入内容，右侧实时预览效果。

### 保存文档
```
Cmd+S 或点击"保存"按钮
```

更多使用技巧请查看 [快速开始指南](QUICKSTART.md)

---

## 📝 Markdown 示例

### 标题和文本
```markdown
# 一级标题
## 二级标题

这是**加粗**文本和*斜体*文本。
```

### 代码块
````markdown
```javascript
function hello() {
  console.log('Hello, MDSKILL!');
}
```
````

### 数学公式
```markdown
行内公式：$E = mc^2$

块级公式：
$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$
```

### 表格
```markdown
| 功能 | 状态 |
|------|------|
| 编辑 | ✅ |
| 预览 | ✅ |
```

### 任务列表
```markdown
- [x] 完成安装
- [ ] 开始写作
```

---

## ⌨️ 快捷键

| 功能 | 快捷键 |
|------|--------|
| 新建文件 | `Cmd+N` |
| 打开文件 | `Cmd+O` |
| 保存文件 | `Cmd+S` |
| 另存为 | `Cmd+Shift+S` |
| 切换预览 | `Cmd+P` |
| 加粗 | `Cmd+B` |
| 斜体 | `Cmd+I` |
| 插入链接 | `Cmd+K` |

---

## 🔧 技术栈

- **框架：** Electron 28
- **Markdown 解析：** Marked
- **代码高亮：** Highlight.js
- **数学公式：** KaTeX
- **打包工具：** electron-builder

---

## 📚 文档

- [快速开始](QUICKSTART.md) - 5 分钟上手指南
- [功能特性](FEATURES.md) - 完整功能列表
- [安装指南](INSTALL.md) - 详细安装步骤
- [更新日志](CHANGELOG.md) - 版本历史

---

## 🗺️ 路线图

### ✅ v1.1.0（已完成）
- [x] 8 种精美主题
- [x] 主题切换功能
- [x] 全新 Logo 设计
- [x] 品牌信息展示

### v1.2.0（计划中）
- [ ] 导出 PDF/HTML
- [ ] 自定义主题编辑器
- [ ] 多标签页
- [ ] 全文搜索

### v2.0.0（计划中）
- [ ] Git 集成
- [ ] 云同步
- [ ] 插件系统
- [ ] 协作编辑

---

## 🐛 问题反馈

如果遇到问题或有功能建议，欢迎联系开发者。

**AI酋长Andy**  
微信：**AIPMAndy**

---

## 📄 许可证

本项目采用 **GPL-3.0** 许可证：

- ✅ **个人使用**：完全免费
- ✅ **学习研究**：自由修改和学习
- ✅ **开源项目**：可用于其他开源项目
- ⚠️ **商业使用**：需获得作者授权

**商业授权联系方式：**
- 微信：**AIPMAndy**
- 邮箱：通过 GitHub 联系

详见 [LICENSE](LICENSE) 文件

---

## 👨‍💻 开发者

**AI酋长Andy 出品**

- 微信：**AIPMAndy**
- GitHub: [@AIPMAndy](https://github.com/AIPMAndy)

---

<div align="center">

**享受写作！** ✨

Made with ❤️ by AI酋长Andy

合作微信：**AIPMAndy**

</div>
