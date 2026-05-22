# PDF 导出测试文档

这是一个用于测试 PDF 导出功能的长文档，包含各种 Markdown 元素。

## 1. 文本段落测试

这是第一段文字。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

这是第二段文字。Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

这是第三段文字，包含**粗体文字**、*斜体文字*、`行内代码`、~~删除线~~等格式。

## 2. 列表测试

### 无序列表

- 第一项
- 第二项
  - 嵌套项 2.1
  - 嵌套项 2.2
    - 深层嵌套 2.2.1
- 第三项

### 有序列表

1. 第一步：准备环境
2. 第二步：安装依赖
3. 第三步：配置参数
4. 第四步：运行程序

## 3. 代码块测试

### JavaScript 代码

```javascript
// 这是一个 JavaScript 函数示例
function exportToPDF() {
  console.log('开始导出 PDF');
  
  const options = {
    printBackground: true,
    pageSize: 'A4',
    margins: {
      top: 1.5,
      bottom: 1.5,
      left: 1.5,
      right: 1.5
    }
  };
  
  return generatePDF(options);
}

// 异步处理
async function generatePDF(options) {
  try {
    const data = await printToPDF(options);
    await saveFile(data);
    return { success: true };
  } catch (error) {
    console.error('导出失败:', error);
    return { success: false, error: error.message };
  }
}
```

### Python 代码

```python
# Python 代码示例
def export_to_pdf(filename, content):
    """
    导出内容到 PDF 文件
    
    Args:
        filename: 输出文件名
        content: 要导出的内容
    
    Returns:
        bool: 是否成功
    """
    try:
        with open(filename, 'wb') as f:
            pdf_data = generate_pdf(content)
            f.write(pdf_data)
        return True
    except Exception as e:
        print(f"导出失败: {e}")
        return False

# 使用示例
if __name__ == "__main__":
    result = export_to_pdf("output.pdf", "Hello World")
    print(f"导出结果: {result}")
```

## 4. 表格测试

### 简单表格

| 功能 | 免费版 | 专业版 |
|------|--------|--------|
| 基础编辑 | ✅ | ✅ |
| 实时预览 | ✅ | ✅ |
| 导出 HTML | ✅ | ✅ |
| 导出 PDF | ❌ | ✅ |
| 复制到公众号 | ❌ | ✅ |
| 13种主题 | ❌ | ✅ |

### 复杂表格

| 序号 | 主题名称 | 类型 | 适用场景 | 特点 |
|------|----------|------|----------|------|
| 1 | GitHub Dark | 深色 | 技术文档 | 经典深色主题，适合代码展示 |
| 2 | 极简现代 | 浅色 | 通用文档 | 简洁清爽，易于阅读 |
| 3 | 科技蓝 | 深色 | 科技报告 | 蓝色调，科技感强 |
| 4 | 文艺清新 | 浅色 | 文学创作 | 温和色调，适合长文阅读 |
| 5 | 商务专业 | 浅色 | 商务报告 | 正式专业，适合商务场合 |

## 5. 引用块测试

> 这是一个引用块。
> 
> 引用块可以包含多个段落。
> 
> > 这是嵌套的引用块。
> > 可以用来表示引用中的引用。

> **重要提示**：PDF 导出功能已经过优化，现在可以正确导出完整的多页文档，不再只是截图。

## 6. 链接和图片测试

### 链接

- [GitHub](https://github.com)
- [Markdown 语法](https://www.markdownguide.org/)
- [Electron 文档](https://www.electronjs.org/docs)

### 图片说明

由于这是测试文档，图片路径可能不存在，但在实际使用中应该能正确显示。

## 7. 分隔线测试

---

上面是一条分隔线。

---

下面继续内容。

## 8. 任务列表测试

- [x] 优化 PDF 导出配置
- [x] 增加渲染等待时间
- [x] 添加 CSS 打印样式
- [x] 处理分页问题
- [ ] 进行全面测试
- [ ] 收集用户反馈

## 9. 数学公式测试（如果支持）

行内公式：$E = mc^2$

块级公式：

$$
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
$$

## 10. 长段落测试

这是一个很长的段落，用于测试分页时段落的处理。Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

## 11. 多级标题测试

### 三级标题

#### 四级标题

##### 五级标题

###### 六级标题

正文内容在这里。

## 12. 特殊字符测试

- 版权符号：©
- 注册商标：®
- 商标：™
- 度数：°
- 箭头：→ ← ↑ ↓
- 数学符号：± × ÷ ≈ ≠ ≤ ≥
- 货币符号：¥ $ € £

## 13. Emoji 测试

- 😀 笑脸
- 🎉 庆祝
- 📝 记事本
- 💻 电脑
- 🚀 火箭
- ✅ 完成
- ❌ 错误
- ⚠️ 警告

## 14. 嵌套结构测试

1. 第一层列表
   - 第二层无序列表
     1. 第三层有序列表
        - 第四层无序列表
          > 引用块
          > 
          > ```javascript
          > // 代码块
          > console.log('嵌套测试');
          > ```

## 15. 总结

这个测试文档包含了：

- ✅ 多级标题
- ✅ 文本格式（粗体、斜体、删除线、行内代码）
- ✅ 列表（有序、无序、嵌套）
- ✅ 代码块（多种语言）
- ✅ 表格（简单、复杂）
- ✅ 引用块（单层、嵌套）
- ✅ 链接
- ✅ 分隔线
- ✅ 任务列表
- ✅ 特殊字符和 Emoji
- ✅ 嵌套结构

如果这个文档能够完整导出为 PDF，并且所有元素都正确显示，分页合理，那么 PDF 导出功能就算优化成功了！

---

**测试说明**：

1. 打开这个文档
2. 点击"导出 PDF"按钮
3. 检查导出的 PDF 文件：
   - 是否包含所有内容（不只是第一页）
   - 分页是否合理（标题不被截断）
   - 代码块和表格是否完整
   - 样式是否保留
   - 边距是否合适

**预期结果**：导出的 PDF 应该有多页，完整包含所有内容，样式正确，分页合理。
