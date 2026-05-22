# 支付自动激活实现方案

## 技术架构

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│  MDSKILL    │ ───> │  支付服务器   │ ───> │  微信/支付宝 │
│  客户端     │ <─── │  (后端API)   │ <─── │  支付平台   │
└─────────────┘      └──────────────┘      └─────────────┘
```

## 方案选择

### 方案1：个人收款码 + 手动激活（最简单，推荐起步）

**优点：**
- 无需开发后端
- 无需企业资质
- 立即可用

**缺点：**
- 需要手动激活
- 用户体验稍差

**实现步骤：**

1. **生成收款码**
   - 微信收款码（个人）
   - 支付宝收款码（个人）
   - 固定金额：19元

2. **用户支付流程**
   ```
   用户点击"立即续费" 
   → 显示收款二维码
   → 用户扫码支付
   → 用户截图支付凭证
   → 发送给客服（微信：AIPMAndy）
   → 客服手动生成激活码
   → 用户输入激活码
   → 自动激活会员
   ```

3. **激活码生成工具**
   - 创建一个简单的激活码生成器
   - 输入用户ID和月数
   - 生成加密的激活码
   - 用户输入激活码后自动激活

### 方案2：第三方支付平台（推荐）

使用第三方聚合支付平台，如：
- **易支付**
- **码支付**
- **虎皮椒支付**
- **Stripe**（国际用户）

**优点：**
- 自动回调
- 无需企业资质
- 开发成本适中

**缺点：**
- 需要支付手续费（2-3%）
- 需要简单的后端

**实现步骤：**

1. **注册第三方支付平台**
2. **获取 API 密钥**
3. **实现支付流程**

### 方案3：官方支付接口（最完善，需要企业资质）

**微信支付 + 支付宝支付**

**优点：**
- 用户体验最好
- 自动回调
- 手续费低（0.6%）

**缺点：**
- 需要企业资质
- 需要完整后端
- 开发成本高

## 推荐实现：方案1（个人收款码）+ 激活码系统

这是最快速、最低成本的方案，适合初期验证市场。

### 第一步：创建激活码生成工具

```javascript
// activation-code-generator.js
const crypto = require('crypto');

// 密钥（保密！）
const SECRET_KEY = 'your-secret-key-here-change-it';

/**
 * 生成激活码
 * @param {string} userId - 用户ID
 * @param {number} months - 月数
 * @returns {string} 激活码
 */
function generateActivationCode(userId, months) {
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + months);
  
  const data = {
    userId,
    months,
    expiryDate: expiryDate.toISOString(),
    timestamp: Date.now()
  };
  
  const payload = JSON.stringify(data);
  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payload)
    .digest('hex')
    .substring(0, 16);
  
  const code = Buffer.from(payload).toString('base64') + '-' + signature;
  return code.toUpperCase();
}

/**
 * 验证激活码
 * @param {string} code - 激活码
 * @returns {object|null} 激活信息或null
 */
function verifyActivationCode(code) {
  try {
    const [payloadBase64, signature] = code.split('-');
    const payload = Buffer.from(payloadBase64, 'base64').toString('utf8');
    
    // 验证签名
    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(payload)
      .digest('hex')
      .substring(0, 16);
    
    if (signature.toLowerCase() !== expectedSignature.toLowerCase()) {
      return null;
    }
    
    const data = JSON.parse(payload);
    return data;
  } catch (error) {
    return null;
  }
}

module.exports = {
  generateActivationCode,
  verifyActivationCode
};
```

### 第二步：在客户端添加激活码输入功能

在订阅管理窗口添加"输入激活码"按钮：

```html
<div style="margin-top: 20px; text-align: center;">
  <button class="btn btn-secondary" id="activateCodeBtn">
    🔑 输入激活码
  </button>
</div>
```

### 第三步：实现激活码验证

```javascript
// 在 subscription-manager.js 中添加
async activateWithCode(activationCode) {
  const { verifyActivationCode } = require('./activation-code-generator');
  
  const data = verifyActivationCode(activationCode);
  if (!data) {
    throw new Error('激活码无效');
  }
  
  // 激活订阅
  await this.activateSubscription(data.months);
  
  return {
    success: true,
    months: data.months,
    expiryDate: this.subscription.expiryDate
  };
}
```

### 第四步：更新支付流程

```
用户流程：
1. 点击"立即续费"
2. 显示两个选项：
   - 扫码支付（显示收款二维码）
   - 输入激活码
3. 如果选择扫码支付：
   - 显示微信/支付宝收款码
   - 提示：支付后联系客服获取激活码
   - 客服微信：AIPMAndy
4. 如果选择输入激活码：
   - 弹出输入框
   - 输入激活码
   - 自动验证并激活
```

### 第五步：客服工作流程

```
客服收到支付凭证后：
1. 确认支付金额（19元）
2. 获取用户ID（从应用中复制）
3. 运行激活码生成工具
4. 将激活码发送给用户
5. 用户输入激活码，自动激活
```

## 方案2实现：使用易支付（自动回调）

如果你想要自动激活，可以使用易支付：

### 第一步：注册易支付

1. 访问易支付平台
2. 注册账号
3. 获取 API 密钥

### 第二步：创建支付API

```javascript
// payment-api.js
const axios = require('axios');
const crypto = require('crypto');

const EPAY_CONFIG = {
  apiUrl: 'https://pay.example.com/submit.php',
  pid: 'your-pid',
  key: 'your-key'
};

/**
 * 创建支付订单
 */
async function createPaymentOrder(userId, amount, type = 'wechat') {
  const params = {
    pid: EPAY_CONFIG.pid,
    type: type, // wechat 或 alipay
    out_trade_no: `SUB_${userId}_${Date.now()}`,
    notify_url: 'https://your-server.com/api/payment/notify',
    return_url: 'mdskill://payment/success',
    name: 'MDSKILL月会员',
    money: amount,
    sitename: 'MDSKILL'
  };
  
  // 生成签名
  const sign = generateSign(params, EPAY_CONFIG.key);
  params.sign = sign;
  params.sign_type = 'MD5';
  
  // 生成支付URL
  const payUrl = `${EPAY_CONFIG.apiUrl}?${new URLSearchParams(params)}`;
  
  return {
    payUrl,
    qrcode: payUrl, // 可以生成二维码
    orderId: params.out_trade_no
  };
}

/**
 * 生成签名
 */
function generateSign(params, key) {
  const sortedParams = Object.keys(params)
    .filter(k => params[k] && k !== 'sign' && k !== 'sign_type')
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&');
  
  const signStr = sortedParams + key;
  return crypto.createHash('md5').update(signStr).digest('hex');
}

module.exports = {
  createPaymentOrder
};
```

### 第三步：支付回调处理

需要一个简单的后端服务器接收支付回调：

```javascript
// server.js (Node.js + Express)
const express = require('express');
const app = express();

app.post('/api/payment/notify', async (req, res) => {
  const { out_trade_no, trade_status, sign } = req.body;
  
  // 验证签名
  if (!verifySign(req.body)) {
    return res.send('fail');
  }
  
  // 支付成功
  if (trade_status === 'TRADE_SUCCESS') {
    // 解析订单号，获取用户ID
    const userId = out_trade_no.split('_')[1];
    
    // 激活用户订阅
    await activateUserSubscription(userId, 1); // 1个月
    
    // 通知客户端（通过 WebSocket 或轮询）
    notifyClient(userId, 'subscription_activated');
  }
  
  res.send('success');
});

app.listen(3000);
```

### 第四步：客户端轮询支付状态

```javascript
// 在客户端轮询支付状态
async function checkPaymentStatus(orderId) {
  const interval = setInterval(async () => {
    const result = await ipcRenderer.invoke('check-payment-status', orderId);
    
    if (result.paid) {
      clearInterval(interval);
      alert('✅ 支付成功！会员已激活');
      loadStatus();
    }
  }, 3000); // 每3秒检查一次
  
  // 5分钟后停止轮询
  setTimeout(() => clearInterval(interval), 5 * 60 * 1000);
}
```

## 我的建议

**初期（0-100用户）：**
- 使用方案1：个人收款码 + 激活码
- 客服手动处理
- 快速验证市场

**成长期（100-1000用户）：**
- 升级到方案2：易支付等第三方平台
- 自动回调激活
- 减少人工成本

**成熟期（1000+用户）：**
- 升级到方案3：官方支付接口
- 注册公司
- 申请企业资质
- 完整的支付系统

## 立即可用的方案

我建议先实现**方案1（激活码系统）**，这样你可以：

1. 立即开始收款（个人收款码）
2. 手动发放激活码
3. 用户自助激活
4. 无需后端服务器
5. 验证商业模式

等有了一定用户量和收入后，再投入开发自动支付系统。

需要我帮你实现激活码系统吗？
