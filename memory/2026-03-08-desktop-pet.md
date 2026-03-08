# 桌面宠物项目 - OpenClaw + Live2D

## 项目概述
基于 Electron 的桌面宠物应用，集成 OpenClaw 作为后端 AI，使用 Live2D 模型实现虚拟形象。

## 技术栈
- **前端**: Electron + HTML/CSS/JS
- **AI 后端**: OpenClaw Gateway (HTTP API)
- **Live2D**: PixiJS + pixi-live2d-display
- **模型**: shizuku (来自 Open-LLM-VTuber)

## 关键配置

### OpenClaw 配置 (~/.openclaw/openclaw.json)
```json
{
  "gateway": {
    "mode": "local",
    "auth": {
      "mode": "token",
      "token": "20070521"
    },
    "controlUi": {
      "allowedOrigins": ["*"],
      "dangerouslyDisableDeviceAuth": true
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

### API 端点
- `POST http://127.0.0.1:18789/v1/chat/completions`
- Header: `Authorization: Bearer 20070521`
- Header: `x-openclaw-agent-id: main`

## 项目结构
```
~/.openclaw/workspace/desktop-pet/
├── src/
│   ├── main.js          # Electron 主进程
│   ├── preload.js       # 安全桥接
│   ├── renderer.js      # 渲染进程 + Live2D
│   └── index.html       # UI 界面
├── assets/live2d/       # Live2D 模型文件
│   └── shizuku/
├── package.json
└── README.md
```

## 启动命令
```bash
cd ~/.openclaw/workspace/desktop-pet
npm start
```

## 功能
- ✅ 透明聊天窗口
- ✅ 系统托盘
- ✅ OpenClaw 消息收发
- ✅ Live2D 模型显示
- ✅ 点击交互（头部/身体）
- ✅ 表情变化（收到回复时）

## 遇到的问题
1. WebSocket 认证太复杂（connect.challenge 协议）
2. 改用 HTTP OpenAI 兼容 API 解决
3. Electron 沙盒权限问题（用 --no-sandbox）
4. Live2D 模型路径问题（复制到项目目录）

## 模型来源
`/home/wuwuwu/下载/Open-LLM-VTuber-v1.2.1-zh/live2d-models/`
- shizuku
- mao_pro

## 创建时间
2026-03-08
