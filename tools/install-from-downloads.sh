#!/bin/bash

# MDskill 一键安装脚本（从下载文件夹安装）
# 使用方法:
#   1. 下载 DMG 到下载文件夹
#   2. 运行: bash install-from-downloads.sh

set -e

echo "🚀 MDskill 一键安装工具"
echo ""

# 查找下载文件夹中的 DMG
DMG_FILE=$(ls ~/Downloads/MDskill-*.dmg 2>/dev/null | head -1)

if [ -z "$DMG_FILE" ]; then
  echo "❌ 未找到 MDskill DMG 文件"
  echo "💡 请先将 MDskill DMG 文件下载到下载文件夹"
  echo ""
  exit 1
fi

echo "📦 找到安装包: $(basename "$DMG_FILE")"
echo ""

# 挂载 DMG
echo "📂 正在挂载安装包..."
MOUNT_POINT=$(hdiutil attach "$DMG_FILE" | grep Volumes | awk '{print $3}')

if [ -z "$MOUNT_POINT" ]; then
  echo "❌ 挂载失败"
  exit 1
fi

# 复制应用
echo "📥 正在安装应用..."
if [ -d "/Applications/MDskill.app" ]; then
  echo "⚠️  检测到旧版本，正在替换..."
  rm -rf /Applications/MDskill.app
fi

cp -R "$MOUNT_POINT/MDskill.app" /Applications/

# 卸载 DMG
echo "🔄 正在清理..."
hdiutil detach "$MOUNT_POINT" -quiet

# 移除隔离属性
echo "🔓 正在移除隔离属性（需要管理员权限）..."
sudo xattr -cr /Applications/MDskill.app

echo ""
echo "✅ MDskill 安装完成！"
echo ""
echo "💡 你可以在启动台或应用程序文件夹中找到 MDskill"
echo "💡 首次打开可能需要在系统设置中允许运行"
echo ""
