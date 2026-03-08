#!/usr/bin/env sh
# download-libs.sh — 下载 Live2D 所需的第三方库到 lib/ 目录
# 在 npm install 后自动执行（postinstall）

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
LIB_DIR="$SCRIPT_DIR/../lib"

mkdir -p "$LIB_DIR"

echo "📦 检查 lib/ 目录中的依赖..."

# ──────────────────────────────────────────────
# 1. pixi.js v6.5.10（浏览器构建版本）
# pixi-live2d-display@0.4.0 需要 pixi.js v6，不兼容 v7/v8
# ──────────────────────────────────────────────
PIXI_JS="$LIB_DIR/pixi.min.js"
if [ ! -f "$PIXI_JS" ]; then
  echo "⬇️  下载 pixi.js@6.5.10..."
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "https://cdn.jsdelivr.net/npm/pixi.js@6.5.10/dist/browser/pixi.min.js" -o "$PIXI_JS" 2>/dev/null || \
    curl -fsSL "https://unpkg.com/pixi.js@6.5.10/dist/browser/pixi.min.js" -o "$PIXI_JS" 2>/dev/null || true
  elif command -v wget >/dev/null 2>&1; then
    wget -q "https://cdn.jsdelivr.net/npm/pixi.js@6.5.10/dist/browser/pixi.min.js" -O "$PIXI_JS" 2>/dev/null || \
    wget -q "https://unpkg.com/pixi.js@6.5.10/dist/browser/pixi.min.js" -O "$PIXI_JS" 2>/dev/null || true
  else
    echo "❌ 未找到 curl 或 wget，请手动下载 pixi.js@6.5.10 到 lib/pixi.min.js"
    echo "   下载地址: https://cdn.jsdelivr.net/npm/pixi.js@6.5.10/dist/browser/pixi.min.js"
  fi

  if [ -f "$PIXI_JS" ] && [ -s "$PIXI_JS" ]; then
    echo "✅ pixi.js@6.5.10 下载成功"
  else
    echo "⚠️  pixi.js 下载失败，请手动下载后放置到 lib/pixi.min.js"
    rm -f "$PIXI_JS"
  fi
else
  echo "✅ pixi.js 已存在，跳过"
fi

# ──────────────────────────────────────────────
# 2. live2dcubismcore.min.js（Live2D 官方 SDK，有版权限制）
# 版权归 Live2D Inc. 所有，不随本项目分发
# 请阅读许可证：https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html
# ──────────────────────────────────────────────
CUBISM_CORE="$LIB_DIR/live2dcubismcore.min.js"
if [ ! -f "$CUBISM_CORE" ]; then
  echo "⬇️  下载 live2dcubismcore.min.js..."
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js" -o "$CUBISM_CORE" 2>/dev/null || true
  elif command -v wget >/dev/null 2>&1; then
    wget -q "https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js" -O "$CUBISM_CORE" 2>/dev/null || true
  else
    echo "❌ 未找到 curl 或 wget，请手动下载 live2dcubismcore.min.js"
  fi

  if [ -f "$CUBISM_CORE" ] && [ -s "$CUBISM_CORE" ]; then
    echo "✅ live2dcubismcore.min.js 下载成功"
  else
    echo "⚠️  live2dcubismcore.min.js 下载失败"
    echo "   请手动下载并放置到 lib/live2dcubismcore.min.js"
    echo "   下载地址: https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js"
    echo "   或从 Live2D Cubism SDK for Web 中获取"
    rm -f "$CUBISM_CORE"
  fi
else
  echo "✅ live2dcubismcore.min.js 已存在，跳过"
fi

echo ""
echo "📋 lib/ 目录状态:"
ls -lh "$LIB_DIR" 2>/dev/null || echo "  (空)"
echo ""
echo "完成！如有文件未能自动下载，请参阅 lib/README.md 手动获取。"
