import $bus from './eventBus'

// $bus传参回调(发送消息)
const handleBusMessage = async (type: string) => {
    let msgType
    switch (type) {
        case 'voice': msgType = 6
            break
        case 'video': msgType = 7
            break
        case 'screen': msgType = 8
            break
    }
    $bus.emit('telephone_message', { msgType, type })
}

export default handleBusMessage