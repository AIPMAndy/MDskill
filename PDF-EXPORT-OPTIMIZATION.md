# PDF 导出功能优化方案

## 当前问题

用户反馈：PDF 导出只能导出一个截图，无法导出完整文档内容。

## 问题分析

当前实现使用 Electron 的 `printToPDF` API，存在以下问题：

1. **布局问题**：预览窗格的布局调整不够完善，导致内容可能被截断
2. **渲染时间不足**：等待时间只有 200ms，对于长文档可能不够
3. **打印配置不当**：margins 设置为 0 可能导致内容显示不完整
4. **缺少分页处理**：没有考虑 CSS 分页属性

## 优化方案

### 方案 1：优化现有 printToPDF 实现（推荐）

**优点**：
- 无需引入新依赖
- 实现简单，维护成本低
- 性能好，速度快

**改进点**：
1. 调整打印配置，使用合理的边距
2. 增加渲染等待时间，确保内容完全加载
3. 添加 CSS 打印样式，优化分页效果
4. 设置合适的缩放比例
5. 确保预览区域完全展开（移除高度限制）

### 方案 2：使用 Puppeteer 生成 PDF

**优点**：
- 更强大的 PDF 生成能力
- 更好的分页控制
- 支持更复杂的样式

**缺点**：
- 需要额外依赖（~300MB）
- 启动时间较长
- 打包体积增大

### 方案 3：使用 html-pdf-node 或 pdf-lib

**优点**：
- 轻量级
- 专门用于 PDF 生成

**缺点**：
- 可能需要额外配置
- 对复杂样式支持不如 Puppeteer

## 推荐实现：优化 printToPDF

### 1. 改进渲染进程代码（renderer.js）

```javascript
async function exportToPDF() {
  try {
    // 获取默认文件名
    let defaultName = 'document.pdf';
    if (currentFilePath) {
      const fileName = currentFilePath.split('/').pop().replace(/\.(md|markdown|txt)$/i, '');
      defaultName = `${fileName}.pdf`;
    }

    // 获取 DOM 元素
    const editorContainer = document.querySelector('.editor-container');
    const editorPane = document.getElementById('editorPane');
    const previewPane = document.getElementById('previewPane');
    const preview = document.getElementById('preview');

    if (!editorContainer || !editorPane || !previewPane || !preview) {
      throw new Error('Required DOM elements not found');
    }

    // 保存原始样式
    const originalStyles = {
      containerDisplay: editorContainer.style.display,
      editorDisplay: editorPane.style.display,
      previewWidth: previewPane.style.width,
      previewMaxWidth: previewPane.style.maxWidth,
      previewMargin: previewPane.style.margin,
      previewPadding: previewPane.style.padding,
      previewOverflow: previewPane.style.overflow,
      previewHeight: previewPane.style.height,
      previewMaxHeight: previewPane.style.maxHeight,
    };

    // 添加打印样式类
    document.body.classList.add('pdf-export-mode');

    // 设置为只显示预览，并确保内容完全展开
    editorContainer.style.display = 'flex';
    editorPane.style.display = 'none';
    previewPane.style.width = '100%';
    previewPane.style.maxWidth = 'none';
    previewPane.style.margin = '0';
    previewPane.style.padding = '0';
    previewPane.style.overflow = 'visible';
    previewPane.style.height = 'auto';
    previewPane.style.maxHeight = 'none';

    // 等待布局更新和内容渲染（增加等待时间）
    await new Promise(resolve => setTimeout(resolve, 500));

    // 调用主进程导出 PDF
    const result = await ipcRenderer.invoke('export-pdf', { defaultPath: defaultName });

    // 恢复原始布局
    document.body.classList.remove('pdf-export-mode');
    Object.keys(originalStyles).forEach(key => {
      const styleKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      const element = key.includes('container') ? editorContainer :
                     key.includes('editor') ? editorPane : previewPane;
      element.style[styleKey] = originalStyles[key];
    });

    if (result.success) {
      alert(`PDF 导出成功！\n保存位置: ${result.filePath}`);
    } else if (result.canceled) {
      // 用户取消
    } else {
      alert(`PDF 导出失败: ${result.error}`);
    }
  } catch (error) {
    console.error('Error during PDF export:', error);
    alert(`PDF 导出出错: ${error.message}`);
  }
}
```

### 2. 改进主进程代码（main.js）

```javascript
ipcMain.handle('export-pdf', async (event, { defaultPath }) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const result = await dialog.showSaveDialog(win, {
    defaultPath: defaultPath,
    filters: [
      { name: 'PDF', extensions: ['pdf'] }
    ]
  });

  if (!result.canceled && result.filePath) {
    try {
      // 使用优化的 printToPDF 配置
      const data = await win.webContents.printToPDF({
        printBackground: true,
        pageSize: 'A4',
        landscape: false,
        margins: {
          top: 1.5,    // 1.5cm 上边距
          bottom: 1.5, // 1.5cm 下边距
          left: 1.5,   // 1.5cm 左边距
          right: 1.5   // 1.5cm 右边距
        },
        preferCSSPageSize: true, // 优先使用 CSS 定义的页面大小
        printSelectionOnly: false,
        displayHeaderFooter: false,
        scale: 1.0
      });
      
      await fs.writeFile(result.filePath, data);
      return { success: true, filePath: result.filePath };
    } catch (error) {
      console.error('Error generating PDF:', error);
      return { success: false, error: error.message };
    }
  }
  return { success: false, canceled: true };
});
```

### 3. 添加 CSS 打印样式（styles.css）

```css
/* PDF 导出模式样式 */
body.pdf-export-mode {
  overflow: visible !important;
}

body.pdf-export-mode .editor-container {
  height: auto !important;
  overflow: visible !important;
}

body.pdf-export-mode #previewPane {
  overflow: visible !important;
  height: auto !important;
  max-height: none !important;
}

/* 打印样式 */
@media print {
  body {
    margin: 0;
    padding: 0;
  }

  .toolbar,
  .editor-pane,
  .status-bar {
    display: none !important;
  }

  .preview-pane {
    width: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
    height: auto !important;
  }

  #preview {
    overflow: visible !important;
    height: auto !important;
    max-height: none !important;
  }

  .markdown-body {
    max-width: 100% !important;
    padding: 20mm !important;
    overflow: visible !important;
  }

  /* 分页控制 */
  .markdown-body h1,
  .markdown-body h2 {
    page-break-after: avoid;
    break-after: avoid;
  }

  .markdown-body pre,
  .markdown-body table,
  .markdown-body img {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .markdown-body p {
    orphans: 3;
    widows: 3;
  }
}
```

## 测试要点

1. **短文档测试**：1-2 页内容，验证基本导出功能
2. **长文档测试**：10+ 页内容，验证分页是否正确
3. **复杂内容测试**：包含代码块、表格、图片的文档
4. **样式保留测试**：验证主题样式是否正确保留
5. **边距测试**：验证页面边距是否合理

## 预期效果

- ✅ 完整导出所有内容，自动分页
- ✅ 保留 Markdown 样式和主题
- ✅ 代码块、表格、图片正确显示
- ✅ 合理的页面边距
- ✅ 避免标题、代码块、表格被分页截断

## 备选方案

如果优化后的 printToPDF 仍然不能满足需求，可以考虑：

1. **集成 Puppeteer**：用于更复杂的 PDF 生成需求
2. **使用在线 PDF 服务**：如 PDFShift、DocRaptor（需要网络）
3. **客户端 PDF 库**：如 jsPDF + html2canvas（质量可能不如 printToPDF）

## 实施步骤

1. ✅ 分析当前问题
2. ⏳ 优化 renderer.js 中的导出函数
3. ⏳ 优化 main.js 中的 PDF 配置
4. ⏳ 添加 CSS 打印样式
5. ⏳ 测试各种场景
6. ⏳ 修复发现的问题
7. ⏳ 文档更新
