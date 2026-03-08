// ============ Live2D 配置 ============
const MODEL_PATH = 'assets/live2d/shizuku.model3.json';

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

async function initLive2D() {
  // 等待库加载
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (!window.PIXI || !window.Live2DModel) {
    console.error('❌ PixiJS 或 Live2DModel 未加载');
    return;
  }

  try {
    console.log('🎭 初始化 Live2D...');

    // 创建 PIXI 应用
    app = new PIXI.Application({
      width: 300,
      height: 400,
      transparent: true,
      backgroundAlpha: 0,
      antialias: true
    });

    if (live2dContainer) {
      live2dContainer.appendChild(app.view);
    }

    // 加载模型
    console.log('🎭 加载模型:', MODEL_PATH);
    
    window.Live2DModel.from(MODEL_PATH, {
      autoInteract: true,
    }).then(model => {
      live2dModel = model;
      
      model.x = 50;
      model.y = 80;
      model.width = 200;
      model.height = 300;

      app.stage.addChild(model);

      // 点击交互
      model.on('hit', (hitAreas) => {
        console.log('👆 点击:', hitAreas);
        if (hitAreas.includes('Body')) {
          model.motion('tap_body');
        }
        if (hitAreas.includes('Head')) {
          model.motion('tap_head');
        }
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
}

async function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;
  
  addMessage(text, 'user');
  messageInput.value = '';
  sendBtn.disabled = true;
  
  const result = await window.electronAPI.sendMessage(text);
  
  if (result.success) {
    addMessage(result.reply, 'assistant');
    
    if (live2dModel) {
      live2dModel.expression('happy');
      setTimeout(() => {
        live2dModel.expression('neutral');
      }, 2000);
    }
  } else {
    addMessage(`错误：${result.error}`, 'system');
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
statusBar.textContent = '● 就绪';
statusBar.className = 'status-bar connected';
addMessage('桌面宠物已启动 🌸', 'system');

// 启动 Live2D
initLive2D();
