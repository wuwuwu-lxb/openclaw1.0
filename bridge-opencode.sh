#!/bin/bash
# OpenClaw <-> opencode 桥接脚本
# 用法：./bridge-opencode.sh "你的问题"

MESSAGE="$1"
MODEL="${2:-bailian-coding-plan/qwen3.5-plus}"

if [ -z "$MESSAGE" ]; then
    echo "用法：$0 \"问题\" [模型]"
    echo "默认模型：bailian-coding-plan/qwen3.5-plus"
    exit 1
fi

cd /home/wuwuwu

# 使用 opencode run 执行任务
opencode run "$MESSAGE" --model "$MODEL" 2>&1
