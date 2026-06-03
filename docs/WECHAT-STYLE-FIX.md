# 微信公众号样式修复说明

## 问题描述
复制内容到微信公众号编辑器后，在手机端预览时出现：
- 图文重叠
- 文字重叠
- 布局错乱

## 解决方案

参考 PageSkill 项目的成熟方案，应用以下核心策略：

### 1. 清除微信不支持的 CSS 属性
```javascript
// 移除这些属性
- box-shadow
- text-shadow
- transform
- transition
- animation
- filter
- mix-blend-mode
```

### 2. 关键修复：添加 position: relative !important
这是防止布局错乱的核心修复，所有元素都添加：
```javascript
el.style.setProperty('position', 'relative', 'important');
```

### 3. 清除可能导致重叠的定位样式
```javascript
// 移除这些属性
- position (先移除，再设置为 relative)
- float
- z-index
- top, left, right, bottom
```

### 4. 强制所有元素不透明
```javascript
el.style.setProperty('opacity', '1', 'important');
```

### 5. 使用精确的像素值替代 em 单位
```javascript
// 段落间距
margin: 16px 0 !important;

// 标题间距
h1: margin: 0 0 24px 0 !important;
h2: margin: 32px 0 16px 0 !important;
h3: margin: 24px 0 12px 0 !important;

// 图片间距
margin: 20px auto !important;

// 表格间距
margin: 20px 0 !important;
```

### 6. 设置合理的行高
```javascript
// 段落和列表
line-height: 1.75 !important;

// 标题
h1: line-height: 1.35 !important;
h2/h3: line-height: 1.4 !important;
h4/h5/h6: line-height: 1.45 !important;

// 代码块
line-height: 1.6 !important;
```

### 7. 强制块级元素清除浮动
```javascript
el.style.setProperty('clear', 'both', 'important');
el.style.setProperty('display', 'block', 'important');
el.style.setProperty('float', 'none', 'important');
```

### 8. 表格样式优化
```javascript
// 添加 thead 和 tbody 的 display 属性
thead: display: table-header-group !important;
tbody: display: table-row-group !important;
tr: display: table-row !important;
th/td: display: table-cell !important;

// 统一边框颜色
border: 1px solid #e1e4e8 !important;

// 表头背景色
th: background-color: #f6f8fa !important;
```

## 参考资料
- PageSkill 项目：https://github.com/AIPMAndy/PageSkill
- 核心文件：src/utils/wechatRenderer.ts

## 测试建议
1. 复制内容到微信公众号编辑器
2. 在编辑器中添加图片
3. 在手机端预览，检查是否有重叠
4. 测试不同类型的内容：段落、标题、列表、代码块、表格、图片
