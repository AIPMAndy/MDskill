// 调试脚本：检查 PDF 导出时加载的 CSS
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs').promises;

async function testPDFExport() {
  // 模拟创建一个测试窗口
  const testWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // 简单的测试 HTML
  const testHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }
    body {
      background: #1e1e1e;
      color: #d4d4d4;
      padding: 40px;
    }
    pre {
      background: #282c34;
      color: #abb2bf;
      padding: 16px;
      border-radius: 4px;
    }
    .hljs-keyword {
      color: #c678dd;
    }
    .hljs-string {
      color: #98c379;
    }
    .hljs-function {
      color: #61afef;
    }
  </style>
</head>
<body>
  <h1>PDF 导出测试</h1>
  <pre><code><span class="hljs-keyword">function</span> <span class="hljs-function">test</span>() {
  <span class="hljs-keyword">const</span> msg = <span class="hljs-string">"Hello World"</span>;
  console.log(msg);
}</code></pre>
</body>
</html>
  `;

  await testWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(testHTML)}`);
  await new Promise(resolve => setTimeout(resolve, 1000));

  const data = await testWindow.webContents.printToPDF({
    printBackground: true,
    pageSize: 'A4',
    landscape: false,
    margins: { top: 0.5, bottom: 0.5, left: 1.0, right: 1.0 },
    preferCSSPageSize: true
  });

  await fs.writeFile('/Users/andy/Desktop/test-pdf-colors.pdf', data);
  console.log('Test PDF saved to Desktop');
  
  testWindow.close();
  app.quit();
}

app.whenReady().then(testPDFExport);
