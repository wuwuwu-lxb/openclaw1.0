# 🌸 桌面宠物 - OpenClaw Live2D VTuber

基于 Electron 的桌面宠物应用，集成 OpenClaw AI 和 Live2D 虚拟形象。

## ✨ 功能

- 💬 **智能对话** - 通过 OpenClaw Gateway 实现 AI 聊天
- 🎭 **Live2D 模型** - 可互动的虚拟形象（支持 shizuku/mao_pro）
- 🪟 **透明窗口** - 无边框透明设计，始终置顶
- 📱 **系统托盘** - 最小化到托盘，点击恢复
- 🎨 **表情动画** - 收到回复时模型表情变化
- 👆 **点击交互** - 点击模型头部/身体有反应

## 📦 安装

```bash
cd ~/.openclaw/workspace/desktop-pet
cnpm install
```

## 🚀 启动

```bash
npm start
```

## ⚙️ OpenClaw 配置

确保 `~/.openclaw/openclaw.json` 包含：

```json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "20070521"
    },
    "http": {
      "endpoints": {
        "chatCompletions": {
          "enabled": true
        }
      }
    }
  }
}
```

然后重启网关：
```bash
pkill -f openclaw-gateway
openclaw gateway
```

## 📁 项目结构

```
desktop-pet/
├── src/
│   ├── main.js          # Electron 主进程
│   ├── preload.js       # 安全桥接
│   ├── renderer.js      # UI + Live2D 逻辑
│   └── index.html       # 界面
├── assets/live2d/       # Live2D 模型（直接放在此目录）
│   ├── shizuku.model3.json
│   ├── shizuku.moc3
│   ├── shizuku.physics3.json
│   ├── shizuku.pose3.json
│   ├── shizuku.cdi3.json
│   ├── shizuku.1024/    # 贴图目录
│   └── motion/          # 动作文件
├── package.json
└── README.md
```

## 🎭 Live2D 模型

模型来自 `Open-LLM-VTuber-v1.2.1-zh` 项目：
- `shizuku` - 默认模型
- `mao_pro` - 备选模型

修改 `src/renderer.js` 中的 `MODEL_PATH` 可切换模型。

## 🛠️ 技术栈

| 组件 | 技术 |
|------|------|
| 框架 | Electron |
| UI | HTML/CSS/JS |
| AI | OpenClaw (OpenAI 兼容 API) |
| Live2D | PixiJS + pixi-live2d-display |
| 模型格式 | Live2D Cubism 3 (.moc3) |

## 📝 开发笔记

### 为什么用 HTTP 而不是 WebSocket？
OpenClaw 的 WebSocket 认证协议较复杂（connect.challenge 挑战 - 响应），HTTP OpenAI 兼容 API 更简单直接。

### 启动参数
`--no-sandbox` - 解决 Electron 沙盒权限问题

### API 调用示例
```javascript
POST http://127.0.0.1:18789/v1/chat/completions
Headers:
  Authorization: Bearer 20070521
  x-openclaw-agent-id: main
Body:
{
  "model": "openclaw",
  "messages": [{"role": "user", "content": "hi"}],
  "user": "desktop-pet-user"
}
```

## 📄 许可证

MIT

---

*创建时间：2026-03-08*
*作者：唔唔唔大王*
