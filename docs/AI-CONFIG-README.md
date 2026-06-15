# AI 格式化配置说明

MDSKILL 支持使用 AI 一键格式化 Markdown 文档。

## 快速开始

1. 点击工具栏左侧的 **MD** 按钮
2. 首次使用会弹出配置窗口
3. 选择 AI 服务商并填写 API Key
4. 保存后自动格式化编辑器内容

## 支持的 AI 服务商

### 国际服务商

**OpenAI**
- 模型：GPT-4o (推荐)、GPT-4o Mini、o1、o1 Mini
- 获取 API Key: https://platform.openai.com/api-keys

**Anthropic**
- 模型：Claude Opus 4 (推荐)、Claude Sonnet 4、Claude 3.5 Sonnet、Claude 3.5 Haiku
- 获取 API Key: https://console.anthropic.com/settings/keys

### 国内服务商

**DeepSeek** (推荐)
- 模型：DeepSeek Chat、DeepSeek Reasoner (R1)
- 获取 API Key: https://platform.deepseek.com/api_keys
- 特点：国内访问，价格低廉，性能优秀

**智谱 AI**
- 模型：GLM-4 Plus、GLM-4 Air、GLM-4 Flash
- 获取 API Key: https://open.bigmodel.cn/usercenter/apikeys
- 特点：国内访问，支持长文本

**月之暗面 (Kimi)**
- 模型：Kimi 8K、Kimi 32K、Kimi 128K
- 获取 API Key: https://platform.moonshot.cn/console/api-keys
- 特点：国内访问，超长上下文

## 配置方式

### 方式一：界面配置（推荐新手）

1. 点击 MD 按钮打开配置窗口
2. 选择"界面配置"标签
3. 选择服务商、填写 API Key、选择模型
4. 点击"保存并转换"

### 方式二：JSON 配置（推荐高级用户）

1. 点击 MD 按钮打开配置窗口
2. 选择"JSON 配置"标签
3. 编辑 JSON 配置文件
4. 点击"保存并转换"

## JSON 配置示例

### DeepSeek 配置

```json
{
  "provider": "deepseek",
  "apiKey": "sk-xxx",
  "model": "deepseek-chat",
  "endpoint": "https://api.deepseek.com/v1/chat/completions",
  "temperature": 0.3,
  "maxTokens": 4096,
  "systemPrompt": "你是一个 Markdown 格式化专家。将用户提供的文本转换为格式良好的 Markdown 文档。保持原意，优化排版，添加适当的标题、列表、强调等格式。只返回格式化后的 Markdown 文本，不要添加任何解释。",
  "customHeaders": {}
}
```

### OpenAI 配置

```json
{
  "provider": "openai",
  "apiKey": "sk-xxx",
  "model": "gpt-4o",
  "endpoint": "https://api.openai.com/v1/chat/completions",
  "temperature": 0.3,
  "maxTokens": 4096,
  "systemPrompt": "你是一个 Markdown 格式化专家...",
  "customHeaders": {}
}
```

### Anthropic 配置

```json
{
  "provider": "anthropic",
  "apiKey": "sk-ant-xxx",
  "model": "claude-opus-4-20250514",
  "endpoint": "https://api.anthropic.com/v1/messages",
  "temperature": 0.3,
  "maxTokens": 4096,
  "systemPrompt": "你是一个 Markdown 格式化专家...",
  "customHeaders": {}
}
```

### 自定义 API 配置

```json
{
  "provider": "custom",
  "apiKey": "your-api-key",
  "model": "custom-model",
  "endpoint": "https://your-api.com/v1/chat/completions",
  "temperature": 0.3,
  "maxTokens": 4096,
  "systemPrompt": "你是一个 Markdown 格式化专家...",
  "customHeaders": {
    "X-Custom-Header": "value"
  }
}
```

## 高级配置参数

| 参数 | 类型 | 说明 | 默认值 |
|------|------|------|--------|
| `provider` | string | 服务商标识 | 必填 |
| `apiKey` | string | API 密钥 | 必填 |
| `model` | string | 模型名称 | 根据服务商 |
| `endpoint` | string | API 端点 URL | 根据服务商 |
| `temperature` | number | 生成温度 (0-1) | 0.3 |
| `maxTokens` | number | 最大生成 token 数 | 4096 |
| `systemPrompt` | string | 系统提示词 | 默认格式化提示 |
| `customHeaders` | object | 自定义 HTTP 请求头 | {} |

## 使用技巧

### 1. 选择合适的模型

- **日常使用**：DeepSeek Chat、GPT-4o Mini、Claude 3.5 Haiku（快速、便宜）
- **高质量输出**：GPT-4o、Claude Opus 4（质量最高）
- **长文本**：Kimi 128K、GLM-4 Plus（支持超长上下文）

### 2. 调整 temperature

- `0.1-0.3`：格式化、翻译等需要稳定输出的任务（推荐）
- `0.5-0.7`：创意写作、内容扩展
- `0.8-1.0`：头脑风暴、多样化输出

### 3. 自定义系统提示词

根据需求修改 `systemPrompt`：

```json
{
  "systemPrompt": "你是一个技术文档专家。将用户提供的文本转换为专业的技术文档格式，包含：1. 清晰的标题层级 2. 代码块语法高亮 3. 表格和列表 4. 适当的强调和引用。只返回格式化后的 Markdown。"
}
```

### 4. 使用代理

如果需要通过代理访问 API，可以在 `customHeaders` 中添加代理相关配置，或修改 `endpoint` 为代理地址。

## 常见问题

### Q: API 调用失败怎么办？

1. 检查 API Key 是否正确
2. 检查网络连接（国际服务商可能需要代理）
3. 检查账户余额是否充足
4. 查看控制台错误信息（开发者工具）

### Q: 如何查看配置文件？

配置保存在 Electron Store 中，可以通过 JSON 配置标签查看和编辑。

### Q: 支持本地模型吗？

支持！使用"自定义 API"选项，配置本地模型的 API 端点（如 Ollama、LM Studio 等）。

### Q: 格式化效果不满意怎么办？

1. 尝试不同的模型
2. 调整 `temperature` 参数
3. 修改 `systemPrompt` 提示词
4. 增加 `maxTokens` 以支持更长的输出

## 价格参考（2026年5月）

| 服务商 | 模型 | 输入价格 | 输出价格 |
|--------|------|----------|----------|
| DeepSeek | deepseek-chat | ¥0.001/1K tokens | ¥0.002/1K tokens |
| OpenAI | gpt-4o | $2.5/1M tokens | $10/1M tokens |
| Anthropic | claude-opus-4 | $15/1M tokens | $75/1M tokens |
| 智谱 AI | glm-4-plus | ¥0.05/1K tokens | ¥0.05/1K tokens |
| 月之暗面 | kimi-32k | ¥0.012/1K tokens | ¥0.012/1K tokens |

**推荐**：DeepSeek 性价比最高，国内访问速度快，适合日常使用。

## 安全提示

- ⚠️ 不要将 API Key 分享给他人
- ⚠️ 不要将包含 API Key 的配置文件提交到 Git
- ⚠️ 定期检查 API 使用量，避免超额消费
- ⚠️ 敏感内容不建议发送到第三方 API

## 技术支持

如有问题，请联系：
- 微信：AIPMAndy
- GitHub: https://github.com/yourusername/MDSKILL

---

**醒觉社成员免费使用 MDSKILL 专业版所有功能！**
