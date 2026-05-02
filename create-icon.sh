#!/bin/bash
# 使用 sips 命令从 SVG 生成 PNG
# macOS 自带工具

# 先用 qlmanage 转换 SVG 到 PNG
qlmanage -t -s 1024 -o assets/ assets/logo-new.svg 2>/dev/null

# 重命名
if [ -f "assets/logo-new.svg.png" ]; then
    mv assets/logo-new.svg.png assets/icon.png
    echo "Icon created: assets/icon.png"
else
    echo "Failed to create icon"
fi
