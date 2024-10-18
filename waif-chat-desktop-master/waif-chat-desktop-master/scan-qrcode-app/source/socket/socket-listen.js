import socket from './index'

socket.on('qrcode_status', (val) => {
	uni.$emit('qrcode_status', val)
})