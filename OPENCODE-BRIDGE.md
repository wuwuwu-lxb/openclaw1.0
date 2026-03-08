# OpenClaw ↔ opencode 桥接配置

---

## 配置总结

| 项目 | 配置 |
|------|------|
| **opencode** | v1.2.20，已配置阿里云百炼 |
| **配置文件** | `~/.config/opencode/opencode.json` |
| **Provider** | `bailian-coding-plan` |
| **API Key** | `sk-sp-e16d48fd21064422b016b552d1e7a5cd` |
| **默认模型** | `qwen3.5-plus` (1M context) |

---

## 使用方式

### 方式 1：直接用 OpenClaw（推荐）

小唔（我）已经可以直接调用阿里云百炼 API，无需经过 opencode。

```
# OpenClaw 内置支持
- 聊天、问答、代码生成 → 直接用 OpenClaw
- 复杂项目分析 → spawn 子代理
```

### 方式 2：opencode TUI（复杂编码）

适合需要交互式代码编辑的场景：

```bash
cd /path/to/project
opencode
```

### 方式 3：opencode serve（HTTP API）

```bash
# 启动 server
opencode serve --port 8888

# HTTP 调用（需要认证）
curl -X POST http://127.0.0.1:8888/v1/chat/completions ...
```

---

## 最佳实践

| 场景 | 推荐工具 |
|------|----------|
| 日常聊天、问答 | OpenClaw（小唔） |
| 简单代码任务 | OpenClaw + exec |
| 复杂项目重构 | opencode TUI |
| 浏览器自动化 | OpenClaw browser 工具 |
| 系统级操作 | OpenClaw + xdotool |

---

_最后更新：2026-03-07_
