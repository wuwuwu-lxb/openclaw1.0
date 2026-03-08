// ============ Live2D 配置 ============
const MODEL_PATH = '../assets/live2d/shizuku.model3.json';

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
  live2dModel.motion('Idle');
  idleTimer = setInterval(() => {
    if (live2dModel) live2dModel.motion('Idle');
  }, 8000);
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
    return;
  }

  const Live2DModel = PIXI.live2d.Live2DModel;

  try {
    console.log('🎭 初始化 Live2D...');

    // 创建 PIXI 应用
    app = new PIXI.Application({
      width: 300,
      height: 400,
      transparent: true,
      antialias: true
    });

    // 启用画布的指针事件（覆盖父容器的 pointer-events: none）
    app.view.style.pointerEvents = 'auto';

    if (live2dContainer) {
      live2dContainer.appendChild(app.view);
    }

    // 加载模型
    console.log('🎭 加载模型:', MODEL_PATH);
    
    Live2DModel.from(MODEL_PATH, {
      autoInteract: true,
    }).then(model => {
      live2dModel = model;
      
      model.x = 50;
      model.y = 80;
      model.width = 200;
      model.height = 300;

      app.stage.addChild(model);

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

      // 备用：直接点击时触发随机动作
      model.on('pointerdown', () => {
        const motions = ['Tap', 'FlickUp', 'Flick3'];
        const m = motions[Math.floor(Math.random() * motions.length)];
        model.motion(m);
      });

      console.log('✅ Live2D 加载成功!');
    }).catch(err => {
      console.error('❌ 模型加载失败:', err);
    });

  } catch (err) {
    console.error('❌ Live2D 错误:', err);
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
    
    if (live2dModel) {
      live2dModel.motion('Tap');
    }
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
