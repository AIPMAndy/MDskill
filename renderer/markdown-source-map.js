(function(root, factory) {
  const api = factory();
  if (root) {
    root.MarkdownSourceMap = api;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof window !== 'undefined' ? window : globalThis, function() {
  function isBlank(line) {
    return !line || /^\s*$/.test(line);
  }

  function isFenceStart(line) {
    const match = line.match(/^ {0,3}(```+|~~~+)/);
    return match ? match[1] : null;
  }

  function isFenceEnd(line, fence) {
    if (!fence) return false;
    const marker = fence[0];
    const length = fence.length;
    const regex = new RegExp(`^ {0,3}\\${marker}{${length},}\\s*$`);
    return regex.test(line);
  }

  function isHeading(line) {
    return /^ {0,3}#{1,6}\s+\S/.test(line);
  }

  function isBlockquote(line) {
    return /^ {0,3}>/.test(line);
  }

  function isListItem(line) {
    return /^ {0,3}(?:[-+*]|\d+[.)])\s+\S/.test(line);
  }

  function isIndentedContinuation(line) {
    return /^ {2,}\S/.test(line);
  }

  function isTableDelimiter(line) {
    return /^ {0,3}\|?(?:\s*:?-{3,}:?\s*\|)+\s*:?-{3,}:?\s*\|?\s*$/.test(line);
  }

  function isTableStart(lines, index) {
    const line = lines[index] || '';
    const nextLine = lines[index + 1] || '';
    return line.includes('|') && isTableDelimiter(nextLine);
  }

  function isBlockStart(lines, index) {
    const line = lines[index] || '';
    return Boolean(
      isFenceStart(line)
      || isHeading(line)
      || isBlockquote(line)
      || isListItem(line)
      || isTableStart(lines, index)
    );
  }

  function extractListItems(lines, startLine, endLine) {
    const items = [];
    let current = null;

    for (let lineNumber = startLine; lineNumber <= endLine; lineNumber += 1) {
      if (isListItem(lines[lineNumber])) {
        if (current) {
          current.endLine = lineNumber - 1;
          items.push(current);
        }
        current = { startLine: lineNumber, endLine: lineNumber };
      } else if (current) {
        current.endLine = lineNumber;
      }
    }

    if (current) {
      items.push(current);
    }

    return items;
  }

  function extractMarkdownSourceBlocks(markdown) {
    const lines = String(markdown || '').split(/\r?\n/);
    const blocks = [];
    let index = 0;

    while (index < lines.length) {
      if (isBlank(lines[index])) {
        index += 1;
        continue;
      }

      const startLine = index;
      const fence = isFenceStart(lines[index]);

      if (fence) {
        index += 1;
        while (index < lines.length && !isFenceEnd(lines[index], fence)) {
          index += 1;
        }
        if (index < lines.length) {
          index += 1;
        }
        blocks.push({
          type: 'code',
          startLine,
          endLine: index - 1,
        });
        continue;
      }

      if (isHeading(lines[index])) {
        blocks.push({
          type: 'heading',
          startLine,
          endLine: startLine,
        });
        index += 1;
        continue;
      }

      if (isTableStart(lines, index)) {
        index += 2;
        while (index < lines.length && !isBlank(lines[index]) && lines[index].includes('|')) {
          index += 1;
        }
        blocks.push({
          type: 'table',
          startLine,
          endLine: index - 1,
        });
        continue;
      }

      if (isListItem(lines[index])) {
        index += 1;
        while (
          index < lines.length
          && !isBlank(lines[index])
          && (isListItem(lines[index]) || isIndentedContinuation(lines[index]))
        ) {
          index += 1;
        }
        const endLine = index - 1;
        blocks.push({
          type: 'list',
          startLine,
          endLine,
          items: extractListItems(lines, startLine, endLine),
        });
        continue;
      }

      if (isBlockquote(lines[index])) {
        index += 1;
        while (index < lines.length && (isBlockquote(lines[index]) || isBlank(lines[index]))) {
          index += 1;
        }
        blocks.push({
          type: 'blockquote',
          startLine,
          endLine: index - 1,
        });
        continue;
      }

      index += 1;
      while (index < lines.length && !isBlank(lines[index]) && !isBlockStart(lines, index)) {
        index += 1;
      }
      blocks.push({
        type: 'paragraph',
        startLine,
        endLine: index - 1,
      });
    }

    return blocks;
  }

  function setSourceRange(element, startLine, endLine, blockIndex) {
    if (!element || !element.dataset) return;
    element.dataset.sourceStartLine = String(startLine);
    element.dataset.sourceEndLine = String(endLine);
    if (typeof blockIndex === 'number') {
      element.dataset.sourceBlock = String(blockIndex);
    }
  }

  function annotateListItems(element, block) {
    if (!block.items || block.items.length === 0) return;

    const listItems = element.querySelectorAll ? Array.from(element.querySelectorAll('li')) : [];
    block.items.forEach((item, index) => {
      if (listItems[index]) {
        setSourceRange(listItems[index], item.startLine, item.endLine);
      }
    });
  }

  function annotateCodeLines(element, block) {
    const codeLines = element.querySelectorAll ? Array.from(element.querySelectorAll('.code-line')) : [];
    if (codeLines.length === 0) return;

    codeLines.forEach((lineElement, index) => {
      const sourceLine = block.startLine + 1 + index;
      if (sourceLine < block.endLine) {
        setSourceRange(lineElement, sourceLine, sourceLine);
      }
    });
  }

  function annotatePreviewSourceBlocks(preview, markdown) {
    if (!preview || !preview.children) return [];

    const blocks = extractMarkdownSourceBlocks(markdown);
    const elements = Array.from(preview.children);

    elements.forEach((element) => {
      if (!element.dataset) return;
      delete element.dataset.sourceStartLine;
      delete element.dataset.sourceEndLine;
      delete element.dataset.sourceBlock;
    });

    blocks.forEach((block, index) => {
      const element = elements[index];
      if (!element) return;

      setSourceRange(element, block.startLine, block.endLine, index);

      if (block.type === 'list') {
        annotateListItems(element, block);
      } else if (block.type === 'code') {
        annotateCodeLines(element, block);
      }
    });

    return blocks;
  }

  function findPreviewElementForLine(preview, line) {
    if (!preview || !preview.querySelectorAll) return null;

    const candidates = Array.from(preview.querySelectorAll('[data-source-start-line][data-source-end-line]'))
      .filter((element) => {
        const startLine = Number(element.dataset.sourceStartLine);
        const endLine = Number(element.dataset.sourceEndLine);
        return Number.isFinite(startLine) && Number.isFinite(endLine) && line >= startLine && line <= endLine;
      })
      .sort((a, b) => {
        const aRange = Number(a.dataset.sourceEndLine) - Number(a.dataset.sourceStartLine);
        const bRange = Number(b.dataset.sourceEndLine) - Number(b.dataset.sourceStartLine);
        return aRange - bRange;
      });

    return candidates[0] || null;
  }

  return {
    extractMarkdownSourceBlocks,
    annotatePreviewSourceBlocks,
    findPreviewElementForLine,
  };
});
