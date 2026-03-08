# OpenClaw 工作区

> 唔唔唔大王的个人 AI 工作区 — 陪伴型灵魂伙伴

---

## 📁 项目结构

```
.
├── desktop-pet/          # 桌面宠物 Electron 应用
│   ├── src/
│   │   ├── main.js       # Electron 主进程
│   │   ├── preload.js    # 安全桥接
│   │   ├── renderer.js   # UI + Live2D
│   │   └── index.html    # 界面
│   ├── assets/live2d/    # Live2D 模型 (shizuku)
│   └── package.json
├── memory/               # 记忆文件
│   └── 2026-03-08-desktop-pet.md
├── openclaw.json         # OpenClaw 配置
├── USER.md               # 用户档案
├── SOUL.md               # AI 人格设定
├── AGENTS.md             # 工作区配置
└── README.md             # 本文件
```

---

## ✨ 功能

### 1. 桌面宠物 🎭
- **透明聊天窗口** - 无边框设计，始终置顶
- **Live2D 虚拟形象** - shizuku 模型，支持点击交互
- **OpenClaw AI 对话** - 通过 HTTP API 实现智能聊天
- **系统托盘** - 最小化到托盘，点击恢复

### 2. OpenClaw 配置 ⚙️
- **HTTP API 端点** - OpenAI 兼容 `/v1/chat/completions`
- **Token 认证** - Bearer Token 方式
- **会话保持** - 通过 `user` 参数维持对话上下文

### 3. 心跳任务 📅
- **Java 学习追踪** - 每周一、周三晚 8 点
- **每日晚安推送** - 每晚 11 点（飞书）

---

## 🚀 快速开始

### 新手？从这里开始

👉 **[本地测试完整指南（新手版）](desktop-pet/QUICKSTART.md)**  
包含 Node.js 安装、依赖安装、OpenClaw 连接、DevTools 调试的每步细节。

### 启动桌面宠物
```bash
cd desktop-pet
npm install
npm start          # 正式模式
# 或
npm run dev        # 开发模式（自动打开 DevTools）
```

### OpenClaw 配置
确保 `openclaw.json` 包含：
```json
{
  "gateway": {
    "auth": { "mode": "token", "token": "20070521" },
    "http": {
      "endpoints": {
        "chatCompletions": { "enabled": true }
      }
    }
  }
}
```

---

## 📊 项目进度

| 模块 | 状态 | 说明 |
|------|------|------|
| Electron 框架 | ✅ 完成 | 透明窗口、托盘 |
| OpenClaw API 集成 | ✅ 完成 | HTTP 轮询方案 |
| Live2D 模型加载 | ✅ 完成 | 本地资源，路径已修复 |
| Live2D 点击交互 | ✅ 完成 | HitAreas 已配置，动作名称已修复 |
| 打字指示器 | ✅ 完成 | 等待 AI 回复时显示动画 |
| 心跳任务 | ⏳ 配置中 | 需部署到服务器 |
| GitHub 同步 | ✅ 完成 | 自动推送 |

---

## 🛠️ 技术栈

- **框架**: Electron 28
- **UI**: HTML/CSS/JavaScript
- **AI**: OpenClaw Gateway
- **Live2D**: PixiJS + pixi-live2d-display
- **模型**: Live2D Cubism 3 (shizuku)

---

## 📝 待办事项

- [x] 修复 Live2D 模型路径
- [x] 修复 Live2D 点击交互（HitAreas + 动作名称）
- [x] 添加打字指示器动画
- [ ] 部署心跳任务到阿里云服务器
- [ ] 添加语音功能
- [ ] 添加更多表情/动画模型切换

---

*最后更新：2026-03-08*
*作者：唔唔唔大王*
