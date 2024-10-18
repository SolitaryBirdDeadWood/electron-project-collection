import App from './App'
import socket from './socket'
import './socket/socket-listen.js'

import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.config.globalProperties.socket = socket
  socket.io.connect()
  console.log('🌍 [socket.io] 连接成功')
  return {
    app
  }
}