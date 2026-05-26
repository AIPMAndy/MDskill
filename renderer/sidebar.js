// 侧边栏管理模块
// ipcRenderer 已在 renderer.js 中声明，这里直接使用全局变量
const path = require('path');

class Sidebar {
  constructor() {
    this.isVisible = true;
    this.currentFolder = null;
    this.files = [];
    this.recentFiles = [];
    this.selectedFile = null;

    this.init();
  }

  init() {
    this.createSidebarHTML();
    this.attachEventListeners();
    this.loadState();
  }

  createSidebarHTML() {
    const placeholder = document.getElementById('sidebarPlaceholder');

    if (!placeholder) {
      console.error('Sidebar placeholder not found');
      return;
    }

    // 检查侧边栏是否已存在
    const existingSidebar = document.getElementById('sidebar');
    if (existingSidebar) {
      return; // 侧边栏已存在，不重复创建
    }

    const sidebarHTML = `
      <div class="sidebar" id="sidebar">
        <div class="sidebar-header">
          <button class="sidebar-btn" id="openFolderBtn" title="打开文件夹">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z"/>
            </svg>
            <span>打开文件夹</span>
          </button>
          <input type="text" class="sidebar-search" id="sidebarSearch" placeholder="🔍 搜索文件...">
        </div>

        <div class="sidebar-section">
          <div class="sidebar-section-title">最近打开</div>
          <div class="sidebar-file-list" id="recentFilesList">
            <div class="sidebar-empty">暂无最近文件</div>
          </div>
        </div>

        <div class="sidebar-section">
          <div class="sidebar-section-title">当前文件夹</div>
          <div class="sidebar-folder-path" id="folderPath">未打开文件夹</div>
          <div class="sidebar-file-list" id="currentFilesList">
            <div class="sidebar-empty">请先打开一个文件夹</div>
          </div>
        </div>

        <div class="sidebar-resize-handle" id="sidebarResizeHandle"></div>
      </div>
    `;

    // 直接在占位符中插入侧边栏
    placeholder.innerHTML = sidebarHTML;
  }

  createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  }

  attachEventListeners() {
    // 打开文件夹按钮
    document.getElementById('openFolderBtn').addEventListener('click', () => {
      this.openFolder();
    });

    // 搜索框
    document.getElementById('sidebarSearch').addEventListener('input', (e) => {
      this.filterFiles(e.target.value);
    });

    // 侧边栏拖拽调整大小
    this.initResize();

    // 监听来自主进程的文件夹数据
    ipcRenderer.on('folder-opened', (event, data) => {
      this.handleFolderOpened(data);
    });

    // 监听文件切换
    ipcRenderer.on('file-switched', (event, filePath) => {
      this.handleFileSwitched(filePath);
    });
  }

  async openFolder() {
    const result = await ipcRenderer.invoke('open-folder-dialog');
    if (result) {
      this.currentFolder = result.folderPath;
      this.files = result.files;
      this.renderCurrentFiles();
      this.saveState();
    }
  }

  handleFolderOpened(data) {
    this.currentFolder = data.folderPath;
    this.files = data.files;
    this.renderCurrentFiles();
    this.saveState();
  }

  handleFileSwitched(filePath) {
    this.selectedFile = filePath;
    this.addToRecentFiles(filePath);
    this.updateFileSelection();
    this.saveState();
  }

  renderCurrentFiles() {
    const filesList = document.getElementById('currentFilesList');
    const folderPath = document.getElementById('folderPath');

    if (!this.currentFolder || this.files.length === 0) {
      filesList.innerHTML = '<div class="sidebar-empty">此文件夹中没有 Markdown 文件</div>';
      folderPath.textContent = '未打开文件夹';
      return;
    }

    folderPath.textContent = this.currentFolder;
    folderPath.title = this.currentFolder;

    filesList.innerHTML = this.files.map(file => {
      const isSelected = file.path === this.selectedFile;
      const icon = file.type === 'folder' ? '📁' : '📄';
      return `
        <div class="sidebar-file-item ${isSelected ? 'selected' : ''}"
             data-path="${file.path}"
             data-type="${file.type}"
             title="${file.path}">
          <span class="file-icon">${icon}</span>
          <span class="file-name">${file.name}</span>
        </div>
      `;
    }).join('');

    // 添加点击事件
    filesList.querySelectorAll('.sidebar-file-item').forEach(item => {
      item.addEventListener('click', () => {
        const filePath = item.dataset.path;
        const fileType = item.dataset.type;

        if (fileType === 'file') {
          this.openFile(filePath);
        } else {
          this.toggleFolder(filePath);
        }
      });
    });
  }

  renderRecentFiles() {
    const recentList = document.getElementById('recentFilesList');

    if (this.recentFiles.length === 0) {
      recentList.innerHTML = '<div class="sidebar-empty">暂无最近文件</div>';
      return;
    }

    recentList.innerHTML = this.recentFiles.slice(0, 10).map(file => {
      const isSelected = file.path === this.selectedFile;
      const fileName = path.basename(file.path);
      return `
        <div class="sidebar-file-item ${isSelected ? 'selected' : ''}"
             data-path="${file.path}"
             title="${file.path}">
          <span class="file-icon">📄</span>
          <span class="file-name">${fileName}</span>
        </div>
      `;
    }).join('');

    // 添加点击事件
    recentList.querySelectorAll('.sidebar-file-item').forEach(item => {
      item.addEventListener('click', () => {
        this.openFile(item.dataset.path);
      });
    });
  }

  addToRecentFiles(filePath) {
    // 移除已存在的
    this.recentFiles = this.recentFiles.filter(f => f.path !== filePath);

    // 添加到开头
    this.recentFiles.unshift({
      path: filePath,
      lastOpened: Date.now()
    });

    // 限制数量
    if (this.recentFiles.length > 20) {
      this.recentFiles = this.recentFiles.slice(0, 20);
    }

    this.renderRecentFiles();
  }

  updateFileSelection() {
    // 更新当前文件列表的选中状态
    document.querySelectorAll('#currentFilesList .sidebar-file-item').forEach(item => {
      item.classList.toggle('selected', item.dataset.path === this.selectedFile);
    });

    // 更新最近文件列表的选中状态
    document.querySelectorAll('#recentFilesList .sidebar-file-item').forEach(item => {
      item.classList.toggle('selected', item.dataset.path === this.selectedFile);
    });
  }

  openFile(filePath) {
    ipcRenderer.send('open-file-from-sidebar', filePath);
  }

  toggleFolder(folderPath) {
    // 简单实现：重新打开文件夹
    ipcRenderer.send('open-folder-from-sidebar', folderPath);
  }

  filterFiles(query) {
    if (!query) {
      this.renderCurrentFiles();
      return;
    }

    const filtered = this.files.filter(file =>
      file.name.toLowerCase().includes(query.toLowerCase())
    );

    const filesList = document.getElementById('currentFilesList');
    if (filtered.length === 0) {
      filesList.innerHTML = '<div class="sidebar-empty">未找到匹配的文件</div>';
      return;
    }

    filesList.innerHTML = filtered.map(file => {
      const isSelected = file.path === this.selectedFile;
      const icon = file.type === 'folder' ? '📁' : '📄';
      return `
        <div class="sidebar-file-item ${isSelected ? 'selected' : ''}"
             data-path="${file.path}"
             data-type="${file.type}"
             title="${file.path}">
          <span class="file-icon">${icon}</span>
          <span class="file-name">${file.name}</span>
        </div>
      `;
    }).join('');

    filesList.querySelectorAll('.sidebar-file-item').forEach(item => {
      item.addEventListener('click', () => {
        const filePath = item.dataset.path;
        const fileType = item.dataset.type;

        if (fileType === 'file') {
          this.openFile(filePath);
        }
      });
    });
  }

  initResize() {
    const handle = document.getElementById('sidebarResizeHandle');
    const sidebar = document.getElementById('sidebar');
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    handle.addEventListener('mousedown', (e) => {
      isResizing = true;
      startX = e.clientX;
      startWidth = sidebar.offsetWidth;
      document.body.style.cursor = 'ew-resize';
      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!isResizing) return;

      const width = startWidth + (e.clientX - startX);
      const minWidth = 200;
      const maxWidth = 400;

      if (width >= minWidth && width <= maxWidth) {
        sidebar.style.width = width + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      if (isResizing) {
        isResizing = false;
        document.body.style.cursor = '';
        this.saveState();
      }
    });
  }

  toggle() {
    this.isVisible = !this.isVisible;
    const sidebar = document.getElementById('sidebar');
    sidebar.style.display = this.isVisible ? 'flex' : 'none';
    this.saveState();
  }

  saveState() {
    const state = {
      isVisible: this.isVisible,
      currentFolder: this.currentFolder,
      recentFiles: this.recentFiles,
      width: document.getElementById('sidebar')?.offsetWidth || 250
    };
    localStorage.setItem('mdskill_sidebar_state', JSON.stringify(state));
  }

  loadState() {
    const saved = localStorage.getItem('mdskill_sidebar_state');

    // 确保侧边栏始终显示
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.style.display = 'flex';
    }

    if (!saved) return;

    try {
      const state = JSON.parse(saved);
      // 侧边栏始终默认显示
      this.isVisible = true;
      this.currentFolder = state.currentFolder;
      this.recentFiles = state.recentFiles || [];

      if (sidebar && state.width) {
        sidebar.style.width = state.width + 'px';
      }

      this.renderRecentFiles();

      if (this.currentFolder) {
        // 请求重新加载文件夹
        ipcRenderer.send('reload-folder', this.currentFolder);
      }
    } catch (e) {
      console.error('Failed to load sidebar state:', e);
    }
  }
}

// 导出
module.exports = Sidebar;
