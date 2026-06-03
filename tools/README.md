# MDSKILL 开发工具集

本目录存放开发和构建过程中使用的工具脚本。

## 🛠 工具列表

### 构建工具
- `build-secure.js` - 安全构建脚本（代码混淆 + 打包）
- `obfuscate.js` - 代码混淆工具
- `activation-code-generator.js` - 激活码生成器

### 图标资源
- `create-icon.sh` - 图标创建脚本
- `generate-icons.js` - 批量生成多尺寸图标

### 安装部署
- `install.sh` - 用户安装脚本
- `install-from-downloads.sh` - 从下载文件夹安装

---

**使用说明**:
- 构建发布版本: `npm run build:secure`
- 生成应用图标: `node generate-icons.js`
