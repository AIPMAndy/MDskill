# RedditOS 风格 UI 重新设计

## 概述

基于 RedditOS 的设计理念，重新设计了 MDSKILL 的三个核心页面，采用简洁的系统原生风格。

## 设计特点

### 视觉风格
- **系统原生感**：使用 macOS 系统字体和原生控件样式
- **主色调**：#0078D2（系统蓝色）
- **背景色**：#f5f5f7（系统浅灰）
- **文字颜色**：#1d1d1f（主文字）、#86868b（次要文字）

### 布局特点
- **列表式布局**：清晰的分组和分隔线
- **固定宽度容器**：400-800px，居中显示
- **圆角设计**：12px 圆角，柔和现代
- **阴影效果**：轻微阴影，增加层次感

### 交互设计
- **悬停效果**：轻微的背景色变化
- **过渡动画**：0.2s 平滑过渡
- **按钮状态**：清晰的 hover、active、disabled 状态

## 新创建的页面

### 1. 订阅管理页面 (`renderer/subscription-new.html`)

**功能模块：**
- 当前订阅状态显示（试用期/已激活/已过期）
- 订阅信息卡片（到期时间、剩余天数）
- 激活码输入和验证
- 价格选项展示（月付/年付）
- 专业功能列表

**设计亮点：**
- 状态徽章（试用期/专业版）
- 价格卡片对比（推荐标签）
- 功能列表带图标和勾选标记
- 清晰的操作按钮层级

### 2. 帮助页面 (`renderer/help-new.html`)

**功能模块：**
- 标签式导航（功能介绍/快捷键/常见问题/关于）
- 功能介绍网格卡片
- 快捷键列表（macOS 风格按键显示）
- 常见问题列表
- 关于页面（版本信息、外部链接）

**设计亮点：**
- 标签切换动画
- 功能卡片悬停效果
- 快捷键按键样式（类似 macOS 键盘）
- 清晰的信息层级

### 3. 激活页面 (`renderer/activation-new.html`)

**功能模块：**
- 试用期倒计时显示
- 专业功能列表
- 价格选项对比
- 激活码输入
- 支付二维码展示（可切换微信/支付宝）
- 客服联系方式

**设计亮点：**
- 试用期提示条（黄色背景）
- 价格卡片对比（推荐标签、节省金额）
- 支付方式切换标签
- 清晰的操作流程引导

## 技术实现

### CSS 特点
- 使用 CSS Grid 和 Flexbox 布局
- 响应式设计（最小宽度适配）
- CSS 变量管理颜色（可扩展为主题系统）
- 平滑的过渡动画

### JavaScript 功能
- 标签切换逻辑
- IPC 通信（与主进程交互）
- 订阅信息加载
- 激活码验证
- 外部链接打开

## 与旧版本对比

| 特性 | 旧版本 | 新版本 |
|------|--------|--------|
| 设计风格 | 传统网页风格 | 系统原生风格 |
| 颜色方案 | 多种颜色 | 统一系统蓝 |
| 布局方式 | 自由布局 | 列表式布局 |
| 交互反馈 | 基础 | 丰富的悬停和过渡 |
| 视觉层次 | 一般 | 清晰明确 |
| 用户体验 | 功能性 | 原生应用感 |

## 使用建议

### 测试步骤
1. 在浏览器中打开新页面，检查样式和布局
2. 测试所有交互功能（按钮、标签切换、输入框）
3. 在 Electron 应用中加载，测试 IPC 通信
4. 测试不同窗口尺寸下的显示效果

### 替换旧页面
如果测试通过，可以按以下步骤替换：

```bash
# 备份旧文件
mv renderer/subscription.html renderer/subscription-old.html
mv renderer/help.html renderer/help-old.html
mv renderer/activation.html renderer/activation-old.html

# 使用新文件
mv renderer/subscription-new.html renderer/subscription.html
mv renderer/help-new.html renderer/help.html
mv renderer/activation-new.html renderer/activation.html
```

### 后续优化
1. **主题系统**：支持浅色/深色模式切换
2. **动画增强**：添加页面切换动画
3. **响应式优化**：更好的移动端适配
4. **无障碍支持**：添加 ARIA 标签和键盘导航
5. **国际化**：支持多语言切换

## 文件清单

```
renderer/
├── subscription-new.html    # 新订阅管理页面
├── help-new.html           # 新帮助页面
├── activation-new.html     # 新激活页面
├── subscription.html       # 旧订阅管理页面（待替换）
├── help.html              # 旧帮助页面（待替换）
└── activation.html        # 旧激活页面（待替换）
```

## 设计参考

- **RedditOS**：https://github.com/carson-katri/reddit-swiftui
- **macOS Human Interface Guidelines**
- **SF Symbols**（图标系统）
- **SwiftUI Design Patterns**

## 总结

新的 UI 设计完全遵循 RedditOS 的简洁原生风格，提供了更好的用户体验和视觉一致性。所有页面都采用统一的设计语言，易于维护和扩展。

建议先在浏览器中测试新页面，确认无误后再替换到应用中。
