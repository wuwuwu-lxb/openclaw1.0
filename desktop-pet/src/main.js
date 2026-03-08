const { app, BrowserWindow, ipcMain, Tray, Menu, protocol } = require('electron');
const path = require('path');
const axios = require('axios');

// ============ 配置 ============
const API_URL = 'http://127.0.0.1:18789/v1/chat/completions';
const TOKEN = '20070521';
const USER_ID = 'desktop-pet-user';

let mainWindow;
let tray;
let messageHistory = [];

// ============ 创建窗口 ============
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    transparent: true,
    resizable: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  
  // 开发模式打开 DevTools（npm run dev 时自动打开）
  if (process.argv.includes('--dev-tools')) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }
}

// ============ 系统托盘 ============
function createTray() {
  tray = new Tray(require('electron').nativeImage.createEmpty());
  
  const contextMenu = Menu.buildFromTemplate([
    { label: '显示窗口', click: () => mainWindow.show() },
    { label: '退出', click: () => app.quit() }
  ]);
  
  tray.setToolTip('桌面宠物 - OpenClaw');
  tray.setContextMenu(contextMenu);
  
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

// ============ 发送消息到 OpenClaw ============
async function sendMessageToOpenClaw(text) {
  try {
    const res = await axios.post(API_URL, {
      model: 'openclaw',
      messages: [
        ...messageHistory,
        { role: 'user', content: text }
      ],
      user: USER_ID
    }, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
        'x-openclaw-agent-id': 'main'
      }
    });
    
    const reply = res.data.choices[0].message.content;
    
    messageHistory.push({ role: 'user', content: text });
    messageHistory.push({ role: 'assistant', content: reply });
    
    if (messageHistory.length > 10) {
      messageHistory = messageHistory.slice(-10);
    }
    
    return { success: true, reply: reply };
  } catch (err) {
    console.error('API 错误:', err.message);
    return { success: false, error: err.message };
  }
}

// ============ IPC 处理 ============
function setupIPC() {
  ipcMain.handle('send-message', async (event, text) => {
    const result = await sendMessageToOpenClaw(text);
    return result;
  });
  
  ipcMain.handle('minimize-window', () => {
    mainWindow.minimize();
  });
  
  ipcMain.handle('hide-window', () => {
    mainWindow.hide();
  });

  ipcMain.handle('check-connection', async () => {
    try {
      await axios.post(API_URL, {
        model: 'openclaw',
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 1,
        user: USER_ID
      }, {
        headers: {
          'Authorization': `Bearer ${TOKEN}`,
          'Content-Type': 'application/json',
          'x-openclaw-agent-id': 'main'
        },
        timeout: 5000
      });
      return { connected: true };
    } catch (err) {
      return { connected: false, error: err.message };
    }
  });
}

// ============ 应用生命周期 ============
app.whenReady().then(() => {
  createWindow();
  createTray();
  setupIPC();
  
  console.log('✅ 桌面宠物已启动');
  console.log(`📡 API 地址：${API_URL}`);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
