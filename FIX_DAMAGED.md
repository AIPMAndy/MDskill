# MDskill "应用已损坏" 修复指南

## 问题描述
打开 MDskill 时提示："MDskill.app 已损坏，无法打开"

## 解决方法

### 方法1：一键修复命令（推荐）

打开终端，复制粘贴以下命令并回车：

```bash
sudo xattr -cr /Applications/MDskill.app && echo "✅ 修复完成！现在可以打开 MDskill 了"
```

输入管理员密码后即可修复。

---

### 方法2：如果 MDskill 在其他位置

如果你把 MDskill 放在了其他位置（比如桌面），使用：

```bash
# 桌面
sudo xattr -cr ~/Desktop/MDskill.app

# 下载文件夹
sudo xattr -cr ~/Downloads/MDskill.app

# 自定义路径（替换成实际路径）
sudo xattr -cr /path/to/MDskill.app
```

---

### 方法3：通过系统设置允许

1. 尝试打开 MDskill（会提示已损坏）
2. 打开 **系统设置** -> **隐私与安全性**
3. 向下滚动，找到 MDskill 的提示
4. 点击 **仍要打开**

---

## 为什么会出现这个问题？

macOS 的 Gatekeeper 安全机制会给从网络下载的应用添加"隔离属性"。
`xattr -cr` 命令会移除这个属性，让系统信任该应用。

---

## 一劳永逸的方法

使用我们提供的一键安装脚本，会自动处理这个问题：

```bash
cd ~/Downloads
bash install-from-downloads.sh
```

该脚本会自动：
1. 安装应用到应用程序文件夹
2. 移除隔离属性
3. 无需手动修复
