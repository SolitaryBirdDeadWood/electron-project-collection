import { io } from '@hyoga/uni-socket.io'
import { SOCKET_URL } from '../common/url.js'

const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 100,
  reconnectionDelay: 1000
})

export default socket