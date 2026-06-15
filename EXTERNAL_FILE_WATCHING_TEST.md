# 外部文件监听功能测试指南

## 功能概述
当在 MDskill 中编辑文件时，如果该文件被外部编辑器（如 VS Code、Sublime Text 等）修改，MDskill 会自动检测并提示用户。

## 实现位置
- **主进程**: `main.js:481-571` (文件监听逻辑)
- **渲染进程**: `renderer/renderer.js:905-987` (事件处理)

## 测试场景

### 场景 1: 无修改时自动刷新 ✅
**步骤**:
1. 打开 MDskill
2. 打开一个 markdown 文件 (如 `test-file-watching.md`)
3. **不要修改**文件内容
4. 用另一个文本编辑器打开同一个文件
5. 在外部编辑器中修改内容并保存
6. 切换回 MDskill

**预期结果**:
- MDskill 自动刷新显示新内容
- 右下角显示提示: "File reloaded (modified externally)"
- 无需用户操作

**控制台日志**:
```
[FileWatch] Starting watch for window 1: /path/to/test-file-watching.md
[FileWatch] File event: change for test-file-watching.md
[file-changed-externally] File changed: /path/to/test-file-watching.md
[file-changed-externally] File reloaded automatically
```

---

### 场景 2: 有未保存修改时提示用户 ⚠️
**步骤**:
1. 打开 MDskill
2. 打开一个 markdown 文件
3. **在 MDskill 中修改**文件内容（但不保存）
4. 用外部编辑器修改同一文件并保存
5. 切换回 MDskill

**预期结果**:
- 显示警告提示框或 Toast 通知
- 提示内容: "This file has been modified externally. You have unsaved changes. Do you want to reload?"
- 提供选项:
  - **Reload**: 放弃当前修改，加载外部版本
  - **取消/关闭**: 保留当前修改，忽略外部变化

**控制台日志**:
```
[FileWatch] File event: change for test-file-watching.md
[file-changed-externally] File changed: /path/to/test-file-watching.md
```

---

### 场景 3: 文件被外部删除 ❌
**步骤**:
1. 打开 MDskill
2. 打开一个 markdown 文件
3. 在文件管理器或终端中删除该文件
   ```bash
   rm /path/to/test-file-watching.md
   ```
4. 观察 MDskill 反应

**预期结果**:
- 显示错误提示: "The file has been deleted externally"
- 停止监听该文件
- 编辑器内容保留（可以选择另存为）

**控制台日志**:
```
[FileWatch] File event: rename for test-file-watching.md
[FileWatch] File deleted: /path/to/test-file-watching.md
[file-deleted-externally] File deleted: /path/to/test-file-watching.md
[FileWatch] Stopping watch for window 1: /path/to/test-file-watching.md
```

---

### 场景 4: 切换文件时停止旧监听 🔄
**步骤**:
1. 打开 MDskill
2. 打开文件 A (`test1.md`)
3. 打开文件 B (`test2.md`) - 新窗口或通过菜单打开
4. 检查控制台日志

**预期结果**:
- 停止监听文件 A
- 开始监听文件 B
- 只有当前活动文件被监听

**控制台日志**:
```
[FileWatch] Starting watch for window 1: /path/to/test1.md
[FileWatch] Stopping watch for window 1: /path/to/test1.md
[FileWatch] Starting watch for window 1: /path/to/test2.md
```

---

## 测试命令（自动化测试）

### 创建测试文件
```bash
cd /Users/andy/Desktop/04\ AICode
cat > test-file-watching.md << 'EOF'
# File Watching Test

This is a test file for external file watching feature.

## Initial Content

- Item 1
- Item 2
- Item 3

Last modified: Initial version
EOF
```

### 模拟外部修改
```bash
# 等待 2 秒后修改文件
sleep 2 && echo "# Modified Externally

Content changed at $(date)

- New Item A
- New Item B" > test-file-watching.md
```

### 模拟文件删除
```bash
sleep 2 && rm test-file-watching.md
```

---

## 技术实现细节

### 主进程（main.js）
使用 Node.js 原生 `fs.watch()` API:

```javascript
const watcher = fsSync.watch(filePath, { persistent: true }, async (eventType, filename) => {
  if (eventType === 'change') {
    // 100ms 延迟确保写入完成
    setTimeout(async () => {
      const content = await fs.readFile(filePath, 'utf-8');
      win.webContents.send('file-changed-externally', { path, content });
    }, 100);
  } else if (eventType === 'rename') {
    // 检查文件是否还存在
    try {
      await fs.access(filePath);
    } catch {
      win.webContents.send('file-deleted-externally', { path });
    }
  }
});
```

### 渲染进程（renderer.js）
监听 IPC 事件:

```javascript
ipcRenderer.on('file-changed-externally', (event, { path, content }) => {
  if (isModified) {
    // 有未保存修改 - 询问用户
    const shouldReload = confirm('文件已外部修改，是否重载？');
    if (shouldReload) {
      editor.value = content;
      isModified = false;
      updatePreview();
    }
  } else {
    // 无修改 - 自动刷新
    editor.value = content;
    updatePreview();
    toast.info('File reloaded (modified externally)');
  }
});

ipcRenderer.on('file-deleted-externally', (event, { path }) => {
  toast.error('The file has been deleted externally');
  ipcRenderer.send('stop-watching-file');
});
```

---

## 已知限制

1. **延迟检测**: 100ms 延迟确保文件写入完成（避免读取不完整内容）
2. **单文件监听**: 当前只监听活动文件，不监听整个目录
3. **性能**: fs.watch 在某些文件系统上可能不稳定（网络驱动器、Docker 卷）
4. **重命名检测**: 文件重命名会被识别为删除事件

---

## 对比 HorseMD 实现

### HorseMD 方案
- 使用 `chokidar` 库（第三方）
- 更稳定的跨平台支持
- 提供 `awaitWriteFinish` 选项

### MDskill 方案（当前）
- 使用 Node.js 原生 `fs.watch`
- 无第三方依赖
- 100ms setTimeout 替代 chokidar 的 awaitWriteFinish
- 避免 ESM/CommonJS 兼容性问题

### 为什么不用 chokidar？
在 Electron 主进程中使用 CommonJS (`require`)，但 chokidar v3+ 是 ES Module:
```
Error [ERR_REQUIRE_ESM]: require() of ES Module not supported
```

解决方案:
1. ✅ **使用原生 fs.watch** (已采用)
2. ❌ 改用 dynamic import() (需要重构主进程为异步)
3. ❌ 降级到 chokidar v2 (旧版本，不推荐)

---

## 测试检查清单

- [ ] 场景 1: 无修改时自动刷新
- [ ] 场景 2: 有修改时提示用户
- [ ] 场景 3: 文件删除通知
- [ ] 场景 4: 切换文件时停止旧监听
- [ ] 打开文件时自动启动监听
- [ ] 关闭窗口时清理监听器
- [ ] 控制台无报错
- [ ] Toast 提示显示正常

---

## 调试技巧

### 启用详细日志
主进程已包含详细日志:
```javascript
console.log(`[FileWatch] Starting watch for window ${windowId}: ${filePath}`);
console.log(`[FileWatch] File event: ${eventType} for ${filename}`);
console.log(`[FileWatch] Stopping watch for window ${windowId}`);
```

### 查看控制台
1. 打开 MDskill
2. 按 `Cmd+Option+I` (macOS) 或 `Ctrl+Shift+I` (Windows) 打开开发者工具
3. 切换到 Console 标签
4. 过滤关键词: `FileWatch`

### 测试响应时间
```bash
time sh -c 'echo "Modified" > test-file-watching.md'
```
正常情况下，MDskill 应在 100-200ms 内检测到变化。

---

## 性能考虑

- **CPU**: fs.watch 是基于事件的，不使用轮询，CPU 开销极低
- **内存**: 每个监听器约 ~100KB
- **延迟**: 100ms 写入稳定延迟 + 文件系统通知延迟（通常 < 50ms）

---

## 未来改进

1. **可配置延迟**: 让用户设置检测延迟（100ms - 1000ms）
2. **目录监听**: 监听整个工作区，检测新文件/删除
3. **冲突解决**: 三向合并（类似 Git）
4. **文件锁检测**: 检测文件是否被其他进程锁定
5. **恢复选项**: 文件删除后提供"撤销删除"选项

---

生成时间: 2026/06/08
MDskill 版本: v1.7.0 (dev)
