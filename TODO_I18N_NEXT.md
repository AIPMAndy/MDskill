# 国际化下一步任务清单

## 🔴 P0 - 立即修复（预计 1.5 小时）

### Task 1: Toast 提示国际化
**文件**: 
- `renderer/copy-utils.js`
- `renderer/renderer.js`
- 所有调用 `showToast()` 的地方

**工作量**: 找到 20+ 处 `showToast()` 调用，替换为 `showToast(t('key'))`

**检查点**:
```bash
grep -rn "showToast(" renderer/ --include="*.js"
```

---

### Task 2: Alert/Error 国际化
**文件**: `renderer/renderer.js`

**需要替换的 alert()**:
- Line 237: 初始化失败
- Line 948: AI 格式化失败
- Line 528, 558: 复制模块未加载
- Line 101, 173, 490, 903, 1344, 1356, 1367, 1385: 其他 alert

**方案**: 创建 `window.i18nHelpers.showAlert(key, params)`

---

### Task 3: Confirm 对话框清理
**文件**: `renderer/renderer.js`

**需要移除的降级逻辑**:
- Line 800, 816, 1193 的 `else if (confirm(...))` 分支

---

## 🟡 P1 - 尽快修复（预计 2.5 小时）

### Task 4: 激活页面检查
- `renderer/activation.html` - 修改默认语言为英文
- `renderer/activation-premium.html` - 检查国际化

### Task 5: 主题选择器国际化
- `renderer/index.html` line 162 `<h2>选择主题</h2>`
- `renderer/theme-preview.js` - 检查动态生成的文本

### Task 6: AI 配置页面国际化
- `renderer/ai-config.html` - 完整检查

### Task 7: 订阅管理页面国际化
- `renderer/subscription.html` - 完整检查

---

## 🟢 P2 - 体验优化（预计 1.5 小时）

### Task 8: 首次启动语言检测
- `main.js` - 添加 `app.getLocale()` 检测
- 如果系统语言非中文，默认使用英文

### Task 9: 工具栏语言切换按钮
- `renderer/index.html` - 添加 🌐 按钮
- 点击切换 en/zh

### Task 10: 快捷键平台适配
- `renderer/help-i18n.js` - 动态显示 ⌘ 或 Ctrl

### Task 11: 语言切换反馈
- 切换后显示 Toast 确认

---

## 快速命令

### 查找所有 Toast 调用
```bash
grep -rn "showToast(" renderer/ --include="*.js"
```

### 查找所有 alert 调用
```bash
grep -rn "alert(" renderer/ --include="*.js"
```

### 查找所有 confirm 调用
```bash
grep -rn "confirm(" renderer/ --include="*.js"
```

### 查找硬编码中文
```bash
grep -rn "[一-龥]" renderer/ --include="*.js" --include="*.html"
```
