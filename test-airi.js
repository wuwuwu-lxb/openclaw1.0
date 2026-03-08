#!/usr/bin/env node
/**
 * Test AIRI server-runtime connection
 */

import WebSocket from '/home/wuwuwu/node/lib/node_modules/openclaw/node_modules/ws/index.js'

const WS_URL = 'ws://localhost:18789/ws'

console.log('Connecting to AIRI server-runtime at', WS_URL)

const ws = new WebSocket(WS_URL)

ws.on('open', () => {
  console.log('✅ Connected to AIRI server-runtime')

  // Send module announce
  const announceMsg = {
    type: 'module:announce',
    data: {
      name: 'test-client',
      identity: {
        kind: 'plugin',
        plugin: { id: 'test-client' },
        id: 'test-123',
      },
    },
    metadata: {
      source: {
        kind: 'plugin',
        plugin: { id: 'test-client' },
        id: 'test-123',
      },
      event: { id: 'announce-1' },
    },
  }

  console.log('Sending announce:', JSON.stringify(announceMsg, null, 2))
  ws.send(JSON.stringify(announceMsg))
})

ws.on('message', (data) => {
  console.log('📨 Received:', data.toString())
})

ws.on('error', (err) => {
  console.error('❌ Error:', err.message)
})

ws.on('close', (code, reason) => {
  console.log(`🔌 Closed: code=${code}, reason=${reason}`)
})

// Exit after 10 seconds
setTimeout(() => {
  console.log('Test complete, exiting...')
  ws.close()
  process.exit(0)
}, 10000)
