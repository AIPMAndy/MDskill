#!/bin/bash

# MDskill v1.7.3 Release Script
# 用于创建 GitHub Release 并上传安装包

set -e

VERSION="v1.7.3"
RELEASE_TITLE="MDskill v1.7.3 - 主题系统升级与性能优化"
DMG_FILE="dist/MDskill-1.7.3-arm64.dmg"
BLOCKMAP_FILE="dist/MDskill-1.7.3-arm64.dmg.blockmap"
RELEASE_NOTES="RELEASE_NOTES_v1.7.3.md"

echo "📦 准备发布 MDskill $VERSION..."

# 检查文件是否存在
if [ ! -f "$DMG_FILE" ]; then
    echo "❌ 错误: 找不到 $DMG_FILE"
    exit 1
fi

if [ ! -f "$RELEASE_NOTES" ]; then
    echo "❌ 错误: 找不到 $RELEASE_NOTES"
    exit 1
fi

echo "✅ 找到安装包: $DMG_FILE"
echo "✅ 找到发布说明: $RELEASE_NOTES"

# 推送代码到 GitHub
echo ""
echo "🚀 推送代码到 GitHub..."
git push origin main

# 创建 git tag
echo ""
echo "🏷️  创建 git tag..."
git tag -a "$VERSION" -m "Release $VERSION - 主题系统升级与性能优化"
git push origin "$VERSION"

# 创建 GitHub Release
echo ""
echo "📝 创建 GitHub Release..."
gh release create "$VERSION" \
    --title "$RELEASE_TITLE" \
    --notes-file "$RELEASE_NOTES" \
    "$DMG_FILE" \
    "$BLOCKMAP_FILE"

echo ""
echo "✨ 发布完成！"
echo "🔗 查看 Release: https://github.com/AIPMAndy/MDskill/releases/tag/$VERSION"
