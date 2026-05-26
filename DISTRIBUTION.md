# MDskill 分发指南

## 方案1：国内网盘分发（推荐）

### 上传步骤：
1. 将 `dist/MDskill-1.5.1-arm64.dmg` 上传到：
   - 蓝奏云（https://www.lanzou.com/）- 免费，不限速
   - 阿里云盘（https://www.aliyundrive.com/）- 大文件友好
   - 百度网盘（https://pan.baidu.com/）- 用户熟悉

2. 获取分享链接，发给用户

### 用户安装步骤：
```bash
# 1. 下载 DMG 文件到下载文件夹
# 2. 在终端运行以下命令（一键安装+去除隔离）

# 挂载 DMG
hdiutil attach ~/Downloads/MDskill-1.5.1-arm64.dmg

# 安装应用
cp -R /Volumes/MDskill*/MDskill.app /Applications/

# 卸载 DMG
hdiutil detach /Volumes/MDskill*

# 移除隔离属性（解决"已损坏"问题）
sudo xattr -cr /Applications/MDskill.app

# 完成！
echo "✅ MDskill 安装完成！"
```

---

## 方案2：GitHub Release + 加速（备选）

### 使用 GitHub 加速服务：
- ghproxy: `https://ghproxy.com/https://github.com/AIPMAndy/MDskill/releases/download/v1.5.1/MDskill-1.5.1-arm64.dmg`
- gh-proxy: `https://gh-proxy.com/https://github.com/AIPMAndy/MDskill/releases/download/v1.5.1/MDskill-1.5.1-arm64.dmg`

### 一键安装命令：
```bash
curl -fsSL https://ghproxy.com/https://raw.githubusercontent.com/AIPMAndy/MDskill/main/install.sh | bash
```

---

## 方案3：自建服务器（最佳）

如果你有服务器，可以：
1. 上传 DMG 到服务器
2. 提供直链下载
3. 用户使用一键安装脚本

---

## 授权码生成

为已购买用户生成授权码：

```bash
cd /Users/andy/Desktop/04\ AICode/MDSKILL
node activation-code-generator.js <用户设备指纹> <月数>
```

示例：
```bash
# 生成12个月授权码
node activation-code-generator.js "abc123def456" 12
```

---

## 快速命令合集

### 用户端：一键安装（从下载文件夹）
```bash
cd ~/Downloads && \
hdiutil attach MDskill-*.dmg && \
cp -R /Volumes/MDskill*/MDskill.app /Applications/ && \
hdiutil detach /Volumes/MDskill* && \
sudo xattr -cr /Applications/MDskill.app && \
echo "✅ 安装完成！"
```

### 开发端：生成授权码
```bash
cd /Users/andy/Desktop/04\ AICode/MDSKILL && \
node -e "const g=require('./activation-code-generator.js'); console.log(g.generateActivationCode('USER_DEVICE_ID', 12));"
```
