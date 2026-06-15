// Line Numbers Manager for Editor - DISABLED

class LineNumbers {
  constructor(editor, editorPane) {
    this.editor = editor;
    this.editorPane = editorPane;
    this.enabled = false;
    this.container = null;
    this.content = null;
    this.lastLineCount = 0;

    // Line numbers feature is disabled - do not initialize
  }

  init() {
    // Disabled
  }

  toggle() {
    // Disabled
    return false;
  }

  show() {
    // Disabled
  }

  hide() {
    // Disabled
  }

  update() {
    // Disabled
  }

  restore() {
    // Disabled - always return false
    return false;
  }
}

// Export for use in renderer.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LineNumbers;
}
