# 查找/替换功能测试计划

## 功能实现状态 ✅
- [x] CSS样式完成 (find-replace.css)
- [x] 核心逻辑完成 (find-replace.js)
- [x] HTML集成完成 (index.html)
- [x] 键盘快捷键 (Cmd+F, Cmd+Option+F)
- [x] 菜单项集成 (Edit > Find, Find and Replace)
- [x] IPC监听器 (open-find, open-find-replace)
- [x] i18n翻译 (English/Chinese)

## 测试清单

### 1. 基础打开/关闭
- [ ] Cmd+F 打开查找模式
- [ ] Cmd+Option+F 打开查找替换模式
- [ ] 菜单 Edit > Find 打开查找
- [ ] 菜单 Edit > Find and Replace 打开查找替换
- [ ] ESC 键关闭对话框
- [ ] 点击 X 按钮关闭

### 2. 查找功能
- [ ] 基础文本查找
- [ ] 区分大小写查找
- [ ] 全词匹配查找
- [ ] 正则表达式查找
- [ ] Enter 跳转到下一个
- [ ] Shift+Enter 跳转到上一个
- [ ] 结果计数显示 (1/5, 2/5等)
- [ ] 未找到结果时显示提示

### 3. 替换功能
- [ ] 替换当前匹配项
- [ ] 替换所有匹配项
- [ ] 替换后计数更新
- [ ] 替换后光标位置正确

### 4. 边界情况
- [ ] 空查询时的处理
- [ ] 无匹配结果的处理
- [ ] 特殊字符的处理
- [ ] 多行文本的处理
- [ ] 编辑器为空时的处理

### 5. UI/UX
- [ ] 模态框位置正确 (右上角)
- [ ] 动画流畅
- [ ] 焦点管理正确
- [ ] 按钮状态反馈
- [ ] 匹配项高亮显示

## 测试用例

### 测试文档内容
```markdown
# Test Document

This is a test document for testing the find and replace feature.

## Features to test:
- Basic search: test, TEST, Test
- Special chars: test@example.com
- Multiple words: This is a test
- Code blocks with `test` inside

The quick brown fox jumps over the lazy dog.
The QUICK brown fox jumps over the LAZY dog.

test test test
```

### 预期结果
1. 查找 "test" (不区分大小写): 应找到 8 个匹配
2. 查找 "test" (区分大小写): 应找到 6 个匹配
3. 查找 "test" (全词匹配): 应找到 5 个匹配
4. 正则 "t[ae]st": 应找到所有 test 变体
5. 替换 "test" → "exam": 所有 test 应被替换

## 已知限制
- 使用 textarea 实现，所以高亮通过选中文本而非 HTML 标记
- 滚动到匹配项使用 scrollIntoView API

## 下一步
测试通过后，继续 P1 任务：
- #30 Editor line numbers
- #31 Code block line numbers  
- #32 Current theme display
