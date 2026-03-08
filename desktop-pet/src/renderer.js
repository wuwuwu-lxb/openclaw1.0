// ============ Live2D 配置 ============
// 使用绝对路径（兼容 Electron file:// 协议）
const MODEL_PATH = new URL('../assets/live2d/shizuku.model3.json', window.location.href).href;

// ============ 情绪检测配置 ============
const EMOTION_PATTERNS = [
  { emotion: 'happy',    pattern: /哈哈|开心|棒|太好了|😄|😊|🎉|好的|好呀|好啊/ },
  { emotion: 'excited',  pattern: /哇|厉害|惊|没想到|居然|竟然|！！|!!|😮|🤩/ },
  { emotion: 'sad',      pattern: /难过|伤心|抱歉|对不起|可惜|😢|😭/ },
  { emotion: 'angry',    pattern: /气|烦|讨厌|不行|不对|错了|😠|😤/ },
];

const EMOTION_MOTION_MAP = {
  happy:    ['Tap', 'FlickUp'],
  excited:  ['FlickUp', 'Flick3'],
  sad:      ['Tap'],
  angry:    ['Flick3'],
  surprised:['FlickUp'],
  neutral:  ['Tap', 'Idle'],
};

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function detectEmotion(text) {
  if (!text) return 'neutral';
  for (const { emotion, pattern } of EMOTION_PATTERNS) {
    if (pattern.test(text)) return emotion;
  }
  return 'neutral';
}

function playEmotionMotion(model, text) {
  if (!model) return;
  const emotion = detectEmotion(text);
  const motions = EMOTION_MOTION_MAP[emotion] || EMOTION_MOTION_MAP.neutral;
  const motion = pickRandom(motions);
  try {
    model.motion(motion);
  } catch (e) {
    console.warn('⚠️ motion 播放失败:', motion, e);
  }
}

// ============ DOM 元素 ============
const messagesEl = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const statusBar = document.getElementById('statusBar');
const minimizeBtn = document.getElementById('minimizeBtn');
const closeBtn = document.getElementById('closeBtn');
const live2dContainer = document.getElementById('live2d-container');

// ============ Live2D 初始化 ============
let app;
let live2dModel;
let idleTimer = null;

function startIdleLoop() {
  if (!live2dModel) return;
  try { live2dModel.motion('Idle'); } catch (e) { /* ignore */ }
  idleTimer = setInterval(() => {
    if (live2dModel) {
      try { live2dModel.motion('Idle'); } catch (e) { /* ignore */ }
    }
  }, 8000);
}

/**
 * 渲染守卫 — 捕获 WebGL 渲染错误，防止白屏崩溃。
 * 参考 Airi 项目 Canvas.vue 的 installRenderGuard 实现。
 */
function installRenderGuard(pixiApp) {
  const renderer = pixiApp.renderer;
  if (!renderer) return;

  const originalRender = renderer.render.bind(renderer);
  renderer.render = function (...args) {
    try {
      originalRender(...args);
    } catch (err) {
      console.warn('⚠️ [RenderGuard] 渲染错误已被捕获，跳过本帧:', err);
    }
  };
}

async function initLive2D() {
  // 轮询等待 PixiJS 和 Live2DModel 库加载完成（最多等待 10 秒）
  const maxWait = 10000;
  const interval = 200;
  let elapsed = 0;

  await new Promise((resolve) => {
    const check = setInterval(() => {
      if (window.PIXI && window.PIXI.live2d && window.PIXI.live2d.Live2DModel) {
        clearInterval(check);
        resolve();
      } else {
        elapsed += interval;
        if (elapsed >= maxWait) {
          clearInterval(check);
          resolve();
        }
      }
    }, interval);
  });

  if (!window.PIXI || !window.PIXI.live2d || !window.PIXI.live2d.Live2DModel) {
    console.warn('⚠️ PixiJS 或 Live2DModel 未加载，跳过 Live2D');
    addMessage('⚠️ Live2D 库加载失败，请运行 sh scripts/download-libs.sh 获取依赖', 'system');
    return;
  }

  const Live2DModel = PIXI.live2d.Live2DModel;

  try {
    console.log('🎭 初始化 Live2D...');

    // 创建 PIXI 应用（参考 Airi Canvas.vue 的配置）
    app = new PIXI.Application({
      width: 300,
      height: 400,
      backgroundAlpha: 0,          // 替代已废弃的 transparent: true
      antialias: true,
      preserveDrawingBuffer: true, // 避免截图时画布丢失
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,           // 配合 resolution 支持高分屏
    });

    // 安装渲染守卫，捕获渲染错误防止白屏
    installRenderGuard(app);

    // 启用画布的指针事件（覆盖父容器的 pointer-events: none）
    app.view.style.pointerEvents = 'auto';

    if (live2dContainer) {
      live2dContainer.appendChild(app.view);
    }

    // 加载模型
    console.log('🎭 加载模型:', MODEL_PATH);

    Live2DModel.from(MODEL_PATH, {
      autoInteract: false, // 禁用自动交互，手动管理
    }).then(model => {
      live2dModel = model;

      model.x = 50;
      model.y = 80;
      model.width = 200;
      model.height = 300;

      app.stage.addChild(model);

      // 鼠标跟踪注视
      app.view.addEventListener('pointermove', (e) => {
        model.focus(e.clientX, e.clientY);
      });

      // 启动待机动画
      startIdleLoop();

      // HitArea 点击交互
      model.on('hit', (hitAreas) => {
        console.log('👆 点击:', hitAreas);
        if (hitAreas.includes('Head')) {
          model.motion('FlickUp');
        } else if (hitAreas.includes('Body')) {
          model.motion('Tap');
        }
      });

      // 直接点击时触发随机动作
      model.on('pointerdown', () => {
        model.motion(pickRandom(['Tap', 'FlickUp', 'Flick3']));
      });

      // 启用手动交互（pointerdown/pointerup/pointermove）
      model.interactive = true;

      console.log('✅ Live2D 加载成功!');
    }).catch(err => {
      console.error('❌ 模型加载失败:', err);
      addMessage('⚠️ Live2D 模型加载失败，请检查 assets/live2d/ 目录', 'system');
    });

  } catch (err) {
    console.error('❌ Live2D 错误:', err);
    addMessage('⚠️ Live2D 初始化失败: ' + err.message, 'system');
  }
}

// ============ UI 函数 ============
function addMessage(text, type = 'system') {
  const msgEl = document.createElement('div');
  msgEl.className = `message ${type}`;
  msgEl.textContent = text;
  messagesEl.appendChild(msgEl);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return msgEl;
}

function showTyping() {
  const el = document.createElement('div');
  el.className = 'message assistant typing';
  el.id = 'typing-indicator';
  el.innerHTML = '<span></span><span></span><span></span>';
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  addMessage(text, 'user');
  messageInput.value = '';
  sendBtn.disabled = true;

  showTyping();

  const result = await window.electronAPI.sendMessage(text);

  removeTyping();

  if (result.success) {
    addMessage(result.reply, 'assistant');

    // 根据 AI 回复内容触发对应情绪动作
    playEmotionMotion(live2dModel, result.reply);
  } else {
    addMessage(`⚠️ ${result.error}`, 'system');
  }

  sendBtn.disabled = false;
  messageInput.focus();
}

// ============ 事件监听 ============
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});
minimizeBtn.addEventListener('click', () => window.electronAPI.minimizeWindow());
closeBtn.addEventListener('click', () => window.electronAPI.hideWindow());

// ============ 初始化 ============
statusBar.textContent = '● 检查连接...';
statusBar.className = 'status-bar';
addMessage('小唔已上线 🌸', 'system');

// 检查 OpenClaw 连接状态
window.electronAPI.checkConnection().then(result => {
  if (result.connected) {
    statusBar.textContent = '● 已连接 OpenClaw';
    statusBar.className = 'status-bar connected';
  } else {
    statusBar.textContent = '● OpenClaw 未就绪';
    statusBar.className = 'status-bar disconnected';
    addMessage('⚠️ 无法连接到 OpenClaw，请确认网关已启动', 'system');
  }
});

// 启动 Live2D
initLive2D();
