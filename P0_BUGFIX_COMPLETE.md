# P0 Critical Bug Fix - Complete

## 问题描述
应用无法启动，报错：`TypeError: Error processing argument at index 2, conversion failure from`

## 根本原因
在 `i18n/locales.js` 中，`help` 键在中英文版本中都被重复定义：
- 第一次定义：作为字符串 `help: '帮助'` (用于菜单标签)
- 第二次定义：作为对象 `help: { title: ..., appName: ..., ... }` (用于帮助页面内容)

第二次定义覆盖了第一次，导致 `t('help')` 返回对象而非字符串，Electron 菜单构建时失败。

## 修复方案
1. 将帮助页面的对象从 `help` 重命名为 `helpPage`
2. 更新所有引用从 `t('help.xxx')` 改为 `t('helpPage.xxx')`

## 修改文件

### 1. i18n/locales.js
```javascript
// 修改前
help: '帮助',  // 字符串
// ...
help: {        // 对象 - 覆盖了上面的字符串！
  title: '帮助 - MDSKILL',
  // ...
}

// 修改后
help: '帮助',      // 字符串 - 用于菜单
// ...
helpPage: {        // 对象 - 用于帮助页面
  title: '帮助 - MDSKILL',
  // ...
}
```

**修改范围**：
- 英文版本：第 242 行 `help:` → `helpPage:`
- 中文版本：第 678 行 `help:` → `helpPage:`

### 2. renderer/help-i18n.js
全文替换所有 `t('help.` 为 `t('helpPage.`

**修改数量**：约 50 处引用

### 3. main.js (清理)
- 移除 debug logging 代码
- 修复多余的闭合大括号

## 验证结果
✅ 应用成功启动
✅ 菜单正确构建
✅ 中英文切换正常
✅ 所有 P0 功能可用：
  - 图片粘贴功能
  - 文档大纲
  - 微信预览模态框
  - PDF 页码导出
  - 最近文档菜单

## 影响范围
- **风险等级**：低
- **向后兼容**：完全兼容
- **用户可见变化**：无 (仅内部重构)

## 经验教训
1. **避免键名冲突**：在大型配置对象中，顶级键和嵌套对象键要明确区分
2. **命名规范**：
   - 顶级字符串用简短名称：`help`, `about`, `settings`
   - 嵌套对象用描述性后缀：`helpPage`, `aboutDialog`, `settingsPanel`
3. **早期验证**：启动时打印菜单结构能快速发现类型错误

## 下一步
- [ ] 测试所有 P0 功能的端到端流程
- [ ] 更新版本号到 v1.7.0
- [ ] 准备发布说明

---
**修复时间**：2026-06-07
**状态**：已完成 ✅
