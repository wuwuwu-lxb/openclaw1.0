#!/bin/bash
# OpenClaw 调用 opencode 的桥接脚本
# 用法：./opencode-bridge.sh "你的问题" [模型]

MESSAGE="$1"
MODEL="${2:-bailian-coding-plan/qwen3.5-plus}"

if [ -z "$MESSAGE" ]; then
    echo "用法：$0 \"问题\" [模型]"
    exit 1
fi

# 启动 opencode serve (如果没在运行)
if ! curl -s http://127.0.0.1:8888/ >/dev/null 2>&1; then
    echo "正在启动 opencode serve..."
    nohup opencode serve --port 8888 --hostname 127.0.0.1 >/dev/null 2>&1 &
    sleep 3
fi

# 创建临时会话并发送消息
cd /home/wuwuwu
RESPONSE=$(opencode run "$MESSAGE" -m "$MODEL" 2>&1 | grep -v "^\[" | tail -100)

echo "$RESPONSE"
