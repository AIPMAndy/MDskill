# MDskill v1.7.3 发布指南

## ✅ 已完成的工作

1. ✅ 更新 README.md 到 v1.7.3
2. ✅ 更新 CHANGELOG.md 添加 v1.7.3 版本说明
3. ✅ 提交代码到 git
4. ✅ 推送到 GitHub main 分支
5. ✅ 准备好 Release Notes (RELEASE_NOTES_v1.7.3.md)
6. ✅ DMG 安装包已构建 (dist/MDskill-1.7.3-arm64.dmg)

---

## 🔧 需要手动完成的步骤

由于网络连接问题，以下步骤需要在网络恢复后手动完成：

### 方法 1：使用脚本（推荐）

网络恢复后，在项目目录执行：

```bash
cd "/Users/andy/Documents/AICode/02 产品网站与服务端/MDSKILL"
./release-v1.7.3.sh
```

这个脚本会自动：
- 创建 git tag v1.7.3
- 推送 tag 到 GitHub
- 创建 GitHub Release
- 上传 DMG 安装包和 blockmap 文件

---

### 方法 2：手动操作

如果脚本失败，可以手动执行以下命令：

#### 1. 创建并推送 git tag

```bash
cd "/Users/andy/Documents/AICode/02 产品网站与服务端/MDSKILL"

# 创建 tag
git tag -a v1.7.3 -m "Release v1.7.3 - 主题系统升级与性能优化"

# 推送 tag
git push origin v1.7.3
```

#### 2. 使用 gh CLI 创建 Release

```bash
gh release create v1.7.3 \
    --title "MDskill v1.7.3 - 主题系统升级与性能优化" \
    --notes-file RELEASE_NOTES_v1.7.3.md \
    dist/MDskill-1.7.3-arm64.dmg \
    dist/MDskill-1.7.3-arm64.dmg.blockmap
```

#### 3. 或者在 GitHub 网页上创建 Release

1. 访问：https://github.com/AIPMAndy/MDskill/releases/new
2. 选择 tag：`v1.7.3`（如果不存在则创建）
3. Release title：`MDskill v1.7.3 - 主题系统升级与性能优化`
4. 复制 `RELEASE_NOTES_v1.7.3.md` 的内容到描述框
5. 上传文件：
   - `dist/MDskill-1.7.3-arm64.dmg`
   - `dist/MDskill-1.7.3-arm64.dmg.blockmap`
6. 点击 "Publish release"

---

## 📋 Release 信息

**版本号**：v1.7.3
**标题**：MDskill v1.7.3 - 主题系统升级与性能优化
**发布日期**：2026-07-03
**安装包**：
- MDskill-1.7.3-arm64.dmg (100MB)
- MDskill-1.7.3-arm64.dmg.blockmap

**Release Notes**：见 `RELEASE_NOTES_v1.7.3.md`

---

## 🔍 检查清单

发布前请确认：

- [ ] README.md 版本号已更新到 1.7.3 ✅
- [ ] CHANGELOG.md 已添加 1.7.3 版本说明 ✅
- [ ] package.json 版本号是 1.7.3 ✅
- [ ] DMG 文件已构建并测试 ✅
- [ ] Release Notes 已准备好 ✅
- [ ] 代码已推送到 GitHub main 分支 ✅
- [ ] Git tag v1.7.3 已创建并推送 ⏳（待网络恢复）
- [ ] GitHub Release 已创建 ⏳（待网络恢复）
- [ ] 安装包已上传到 Release ⏳（待网络恢复）

---

## ⚠️ 当前问题

**网络连接问题**：无法连接到 github.com:443

**解决方法**：
1. 检查网络连接
2. 检查代理设置
3. 稍后重试发布脚本

---

## 📝 主要更新内容

### 🎨 主题系统升级
- 集成高级设计主题
- 新增 Apple 风格主题
- 删除低审美主题，保留精品

### ⚡️ 性能优化
- 深度代码清理
- 优化启动速度
- 降低内存占用

### 🔧 功能改进
- 改进搜索高亮持久性
- 修复 PDF 导出颜色问题
- 修复中文输入法 bug

---

## 🎯 发布后需要做的

1. 在 GitHub Release 页面确认安装包可以正常下载
2. 测试下载的 DMG 是否可以正常安装
3. 更新产品网站（如有）
4. 通知用户更新

---

**准备完成！等待网络恢复后执行发布。**
