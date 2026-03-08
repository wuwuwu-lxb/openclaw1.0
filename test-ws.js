const WebSocket = require('/home/wuwuwu/node/lib/node_modules/openclaw/node_modules/ws');

const WS_URL = 'ws://127.0.0.1:18789';
const TOKEN = '20070521';

console.log('Connecting to:', WS_URL);

const ws = new WebSocket(WS_URL);

ws.on('open', () => {
  console.log('✅ TCP connected');
  
  // 发送 connect 请求
  const connectMsg = {
    type: 'req',
    id: 'test-1',
    method: 'connect',
    params: {
      minProtocol: 3,
      maxProtocol: 3,
      client: {
        id: 'webchat',  // 必须是预定义的值：webchat, cli, test, webchat-ui, control-ui 等
        displayName: 'Test Client',
        version: '1.0.0',
        platform: 'linux',
        mode: 'webchat',  // 必须是预定义的值：webchat, cli, ui, backend, node, probe, test
      },
      auth: {
        token: TOKEN,
      },
    },
  };
  
  console.log('Sending connect:', JSON.stringify(connectMsg, null, 2));
  ws.send(JSON.stringify(connectMsg));
});

ws.on('message', (data) => {
  console.log('📨 Received:', data.toString());
});

ws.on('error', (err) => {
  console.error('❌ Error:', err.message);
});

ws.on('close', (code, reason) => {
  console.log(`🔌 Closed: code=${code}, reason=${reason}`);
});

// 10 秒后退出
setTimeout(() => {
  console.log('Timeout, exiting...');
  ws.close();
  process.exit(0);
}, 10000);
