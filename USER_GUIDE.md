# MDskill 用户安装指南

## 📦 获取安装包

联系开发者获取 MDskill DMG 安装包下载链接。

---

## 🚀 快速安装（推荐）

### 方法1：一键安装脚本

1. 下载 DMG 文件到**下载文件夹**
2. 下载安装脚本：[install-from-downloads.sh](https://github.com/AIPMAndy/MDskill/raw/main/install-from-downloads.sh)
3. 打开终端，运行：

```bash
cd ~/Downloads
bash install-from-downloads.sh
```

4. 输入管理员密码（用于移除隔离属性）
5. 完成！

---

### 方法2：手动安装

1. 下载 DMG 文件
2. 双击打开 DMG
3. 将 MDskill.app 拖到应用程序文件夹
4. 打开终端，运行以下命令移除隔离属性：

```bash
sudo xattr -cr /Applications/MDskill.app
```

5. 输入管理员密码
6. 完成！

---

## 🔑 激活专业版

1. 打开 MDskill
2. 点击菜单栏 **帮助** -> **激活专业版**
3. 输入开发者提供的授权码
4. 点击激活

### 获取设备指纹

如果需要获取设备指纹以申请授权码：

1. 打开 MDskill
2. 点击菜单栏 **帮助** -> **激活专业版**
3. 在激活窗口中会显示你的设备指纹
4. 将设备指纹发送给开发者

---

## ❓ 常见问题

### Q: 提示"应用已损坏"怎么办？

A: 运行以下命令移除隔离属性：

```bash
sudo xattr -cr /Applications/MDskill.app
```

### Q: 提示"无法打开，因为来自身份不明的开发者"？

A: 
1. 打开 **系统设置** -> **隐私与安全性**
2. 找到 MDskill 的提示
3. 点击 **仍要打开**

或者运行：
```bash
sudo xattr -cr /Applications/MDskill.app
```

### Q: 授权码无效？

A: 
1. 确认设备指纹正确
2. 确认授权码完整复制（包括所有分隔符）
3. 联系开发者重新生成

---

## 📞 技术支持

- 微信: AIPMAndy
- GitHub: https://github.com/AIPMAndy/MDskill
