# CRON.md - 定时任务配置

---

## 任务列表

### 1. 每日晚安推送
- **时间：** 每天 23:00（晚上 11 点）
- **内容：**
  - 晚安问候
  - 今日总结（从 MEMORY.md 读取）
  - 明日待办
- **渠道：** 飞书
- **目标：** ou_a80f49095831ecb65f91a794f903c67b

### 2. Java 学习追踪
- **时间：** 每周一、周三 20:00
- **内容：**
  - Java 知识点讲解
  - 配套练习题
  - 进度记录

---

## Cron 表达式

```bash
# 每日 23:00 晚安推送
0 23 * * * openclaw agent --message "执行晚安推送"

# 每周一、周三 20:00 Java 学习
0 20 * * 1,3 openclaw agent --message "执行 Java 学习追踪"
```

---

## 执行脚本

### goodnight.sh

```bash
#!/bin/bash
# 每日晚安推送脚本

cd ~/.openclaw/workspace

# 读取今日记忆
TODAY=$(date +%Y-%m-%d)
MEMORY_FILE="memory/${TODAY}.md"

if [ -f "$MEMORY_FILE" ]; then
    SUMMARY=$(cat "$MEMORY_FILE")
else
    SUMMARY="今天还没有记录哦～"
fi

# 生成明日待办
TODO_LIST="
1. [ ] 待办事项 1
2. [ ] 待办事项 2
3. [ ] 待办事项 3
"

# 发送飞书消息
openclaw message send --channel feishu --target ou_a80f49095831ecb65f91a794f903c67b --message "
🌙 晚安，唔唔唔大王～

📝 今日总结：
${SUMMARY}

📋 明日待办：
${TODO_LIST}

早点休息，明天见！✨
"
```

---

*最后更新：2026-03-06*
