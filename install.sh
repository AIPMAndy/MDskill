#!/bin/bash

# MDskill 一键安装脚本
# 使用方法: curl -fsSL https://你的域名/install.sh | bash

set -e

echo "🚀 开始安装 MDskill..."

# 下载地址（你需要替换成实际的下载链接）
DOWNLOAD_URL="https://github.com/AIPMAndy/MDskill/releases/latest/download/MDskill-1.5.1-arm64.dmg"
TMP_DIR="/tmp/mdskill-install"
DMG_PATH="$TMP_DIR/MDskill.dmg"

# 创建临时目录
mkdir -p "$TMP_DIR"

# 下载 DMG
echo "📦 正在下载 MDskill..."
curl -L -o "$DMG_PATH" "$DOWNLOAD_URL"

# 挂载 DMG
echo "📂 正在挂载安装包..."
MOUNT_POINT=$(hdiutil attach "$DMG_PATH" | grep Volumes | awk '{print $3}')

# 复制应用到 Applications
echo "📥 正在安装应用..."
cp -R "$MOUNT_POINT/MDskill.app" /Applications/

# 卸载 DMG
hdiutil detach "$MOUNT_POINT" -quiet

# 清理临时文件
rm -rf "$TMP_DIR"

# 移除隔离属性（解决"已损坏"问题）
echo "🔓 正在移除隔离属性..."
sudo xattr -cr /Applications/MDskill.app

echo "✅ MDskill 安装完成！"
echo "💡 你可以在启动台或应用程序文件夹中找到 MDskill"
