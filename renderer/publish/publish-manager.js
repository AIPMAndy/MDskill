/**
 * Publish Manager UI Script
 * 发布管理界面脚本
 */

const { ipcRenderer } = require('electron');

let selectedPlatforms = new Set();
let contentData = null;

// 平台图标映射
const platformIcons = {
  wechat: '📱',
  zhihu: '📘',
  xiaohongshu: '📖',
  csdn: '💻'
};

/**
 * 初始化页面
 */
async function init() {
  // 获取要发布的内容
  contentData = await ipcRenderer.invoke('get-publish-content');

  if (contentData) {
    document.getElementById('content-title').textContent = contentData.title || '无标题';
    document.getElementById('content-preview').textContent =
      contentData.markdown.substring(0, 200) + (contentData.markdown.length > 200 ? '...' : '');
  }

  // 加载平台列表
  loadPlatforms();
}

/**
 * 加载平台列表
 */
async function loadPlatforms() {
  const platforms = await ipcRenderer.invoke('get-platforms');
  const container = document.getElementById('platforms-container');
  container.innerHTML = '';

  platforms.forEach(platform => {
    const card = createPlatformCard(platform);
    container.appendChild(card);
  });
}

/**
 * 创建平台卡片
 */
function createPlatformCard(platform) {
  const card = document.createElement('div');
  card.className = 'platform-card';
  card.dataset.platformId = platform.id;

  const icon = platformIcons[platform.id] || '📝';
  const statusText = platform.isLoggedIn ? '已登录' : '未登录';
  const statusClass = platform.isLoggedIn ? 'logged-in' : '';

  card.innerHTML = `
    <div class="icon">${icon}</div>
    <div class="name">${platform.name}</div>
    <div class="status ${statusClass}">${statusText}</div>
  `;

  card.addEventListener('click', () => togglePlatform(platform.id));

  return card;
}

/**
 * 切换平台选中状态
 */
function togglePlatform(platformId) {
  const card = document.querySelector(`[data-platform-id="${platformId}"]`);

  if (selectedPlatforms.has(platformId)) {
    selectedPlatforms.delete(platformId);
    card.classList.remove('selected');
  } else {
    selectedPlatforms.add(platformId);
    card.classList.add('selected');
  }

  // 更新发布按钮状态
  const publishBtn = document.getElementById('publish-btn');
  publishBtn.disabled = selectedPlatforms.size === 0;
}

/**
 * 处理发布
 */
async function handlePublish() {
  if (selectedPlatforms.size === 0) {
    showMessage('请至少选择一个平台', 'error');
    return;
  }

  // 显示加载状态
  showLoading(true);
  hideMessage();

  try {
    const platformIds = Array.from(selectedPlatforms);
    const results = await ipcRenderer.invoke('publish-content', {
      platformIds,
      content: contentData
    });

    // 处理结果
    handlePublishResults(results);

  } catch (error) {
    showMessage(`发布失败: ${error.message}`, 'error');
  } finally {
    showLoading(false);
  }
}

/**
 * 处理发布结果
 */
function handlePublishResults(results) {
  const successCount = results.filter(r => r.success).length;
  const failCount = results.length - successCount;

  let message = '';
  if (failCount === 0) {
    message = `✅ 成功发布到 ${successCount} 个平台`;
    showMessage(message, 'success');
  } else {
    message = `⚠️ ${successCount} 个成功，${failCount} 个失败\n`;

    results.forEach(result => {
      const platform = result.platformId;
      if (!result.success) {
        message += `\n❌ ${platform}: ${result.error}`;
      }
    });

    showMessage(message, 'error');
  }

  // 如果全部成功，3秒后自动关闭
  if (failCount === 0) {
    setTimeout(() => {
      window.close();
    }, 3000);
  }
}

/**
 * 显示状态消息
 */
function showMessage(text, type = 'success') {
  const messageEl = document.getElementById('status-message');
  messageEl.textContent = text;
  messageEl.className = `status-message ${type} show`;
}

/**
 * 隐藏状态消息
 */
function hideMessage() {
  const messageEl = document.getElementById('status-message');
  messageEl.classList.remove('show');
}

/**
 * 显示/隐藏加载状态
 */
function showLoading(show) {
  const loadingEl = document.getElementById('loading');
  const publishBtn = document.getElementById('publish-btn');

  if (show) {
    loadingEl.classList.add('show');
    publishBtn.disabled = true;
  } else {
    loadingEl.classList.remove('show');
    publishBtn.disabled = selectedPlatforms.size === 0;
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
