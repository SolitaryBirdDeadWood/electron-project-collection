<template>
    <div class="header-menu no-drag" :style="!proxy.isMac ? 'padding-right: 120px;' : 'padding-right: 20px;'">
        <!-- 语言通话 -->
        <svg v-if="$route.query.type !== 'group'" @click="voiceCall" @mouseover="voiceActive = true"
            @mouseout="voiceFlag ? '' : voiceActive = false" t="1699165279771" style="transform: rotateY(180deg);"
            class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2973" width="25"
            height="25">
            <path
                d="M877.1 238.7L770.6 132.3c-13-13-30.4-20.3-48.8-20.3s-35.8 7.2-48.8 20.3L558.3 246.8c-13 13-20.3 30.5-20.3 48.9 0 18.5 7.2 35.8 20.3 48.9l89.6 89.7c-20.6 47.8-49.6 90.6-86.4 127.3-36.7 36.9-79.6 66-127.2 86.6l-89.6-89.7c-13-13-30.4-20.3-48.8-20.3-18.5 0-35.8 7.2-48.8 20.3L132.3 673c-13 13-20.3 30.5-20.3 48.9 0 18.5 7.2 35.8 20.3 48.9l106.4 106.4c22.2 22.2 52.8 34.9 84.2 34.9 6.5 0 12.8-0.5 19.2-1.6 132.4-21.8 263.8-92.3 369.9-198.3C818 606 888.4 474.6 910.4 342.1c6.3-37.6-6.3-76.3-33.3-103.4z m-37.6 91.5c-19.5 117.9-82.9 235.5-178.4 331s-213 158.9-330.9 178.4c-14.8 2.5-30-2.5-40.8-13.2L184.9 721.9 295.7 611l119.8 120 0.9 0.9 21.6-8C570.7 675 674.9 570.8 723.7 438.1l8-21.6-120.8-120.7 110.8-110.9 104.5 104.5c10.8 10.8 15.8 26 13.3 40.8z"
                p-id="2974" :fill="voiceActive ? '#50abf8' : '#4F4F4F'"></path>
        </svg>
        <!-- 视频通话 -->
        <svg v-if="$route.query.type !== 'group'" @click="videoCall" @mouseover="videoActive = true"
            @mouseout="videoFlag ? '' : videoActive = false" t="1699165177594" class="icon" viewBox="0 0 1024 1024"
            version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4522" width="25" height="25">
            <path
                d="M912 302.3L784 376V224c0-35.3-28.7-64-64-64H128c-35.3 0-64 28.7-64 64v576c0 35.3 28.7 64 64 64h592c35.3 0 64-28.7 64-64V648l128 73.7c21.3 12.3 48-3.1 48-27.6V330c0-24.6-26.7-40-48-27.7zM712 792H136V232h576v560z m176-167l-104-59.8V458.9L888 399v226z"
                p-id="4523" :fill="videoActive ? '#50abf8' : '#4F4F4F'"></path>
            <path d="M208 360h112c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H208c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"
                p-id="4524" :fill="videoActive ? '#50abf8' : '#4F4F4F'"></path>
        </svg>
        <!-- 屏幕共享 -->
        <svg @click="screenShare" @mouseover="screenActive = true" @mouseout="screenFlag ? '' : screenActive = false"
            t="1699164753923" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="1478" width="25" height="25">
            <path
                d="M927.744 192.307H224.256c-17.715 0-32.051 14.336-32.051 32.051v159.744c0 17.716 14.336 32.052 32.051 32.052s32.051-14.336 32.051-32.052V256.307h639.488v383.488H576c-17.715 0-32.051 14.336-32.051 32.051s14.336 32.052 32.051 32.052h351.744c17.715 0 32.051-14.336 32.051-32.052v-447.59c0-17.715-14.336-31.949-32.051-31.949z"
                p-id="1479" :fill="screenActive ? '#50abf8' : '#4F4F4F'"></path>
            <path
                d="M479.744 447.795h-384c-17.715 0-32.051 14.336-32.051 32.051v256c0 17.716 14.336 32.052 32.051 32.052h384c17.715 0 32.051-14.336 32.051-32.052v-256c0-17.817-14.336-32.05-32.051-32.05z m-31.949 256h-320v-192h320v192z m-64.307 96.256H192.512c-17.715 0-32.051 14.336-32.051 32.051s14.336 32.052 32.051 32.052h190.976c17.715 0 32.051-14.336 32.051-32.052s-14.336-32.05-32.051-32.05z m320-64.614h-0.307l-127.488 1.024c-17.715 0.102-31.847 14.54-31.744 32.256 0.102 17.613 14.438 31.744 31.949 31.744h0.307l127.488-1.024c17.715-0.103 31.846-14.541 31.744-32.256-0.103-17.51-14.439-31.744-31.949-31.744z"
                p-id="1480" :fill="screenActive ? '#50abf8' : '#4F4F4F'"></path>
        </svg>
        <!-- 更多 -->
        <svg @click="more" @mouseover="moreActive = true" @mouseout="moreFlag ? '' : moreActive = false"
            t="1699165777338" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="4471" id="mx_n_1699165777339" width="25" height="25">
            <path
                d="M144 512a80 80 0 1 0 160 0 80 80 0 0 0-160 0z m288 0a80 80 0 1 0 160 0 80 80 0 0 0-160 0z m288 0a80 80 0 1 0 160 0 80 80 0 0 0-160 0z"
                :fill="moreActive ? '#50abf8' : '#4F4F4F'" p-id="4472"></path>
        </svg>
        <div class="line" v-if="!proxy.isMac"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
// api
import { reqIsJoinTelephone } from '@/api/telephone/index'
import type { IsJoinTelephoneResponse } from '@/api/telephone/type'
import { useRoute } from 'vue-router'
import { useUserInfoStore } from '@/store/modules/user'
import handleBusMessage from '@/utils/busTelephoneMessage'
import { ElMessage } from 'element-plus'
const { ipcRenderer } = require('electron')
const $route = useRoute()
const userInfoStore = useUserInfoStore()
const { proxy } = getCurrentInstance() as any

const emit = defineEmits(['open'])

// 判断用户是否有访问权限
type TelephoneType = 'voice' | 'video' | 'screen'
const handleRequestMediaAccess = async (telephoneType: TelephoneType): Promise<boolean> => {
    type IAccessStatus = 'not-determined' | 'granted' | 'denied' | 'restricted' | 'unknown'
    let acc: IAccessStatus
    if (telephoneType === 'voice') {
        acc = await ipcRenderer.invoke('request-media-access', 'microphone')
    } else if (telephoneType === 'video') {
        acc = await ipcRenderer.invoke('request-media-access', 'camera')
    } else {
        acc = await ipcRenderer.invoke('request-media-access', 'screen')
    }
    return acc === 'granted' ? true : false
}

// 是否可以点击
let clickFlag = ref<boolean>(true)

// 判断用户是否已经加入过会议(如果加入过就不允许发起通话)
const isJoinTelephone = async (telephoneType: TelephoneType): Promise<boolean> => {
    let userId = userInfoStore.userInfo._id
    let urlId = $route.query.id as string
    let isAcc = await handleRequestMediaAccess(telephoneType)
    if (!isAcc) {
        telephoneType === 'screen'
            ? ElMessage.error('请在系统设置中开启屏幕访问权限')
            : ElMessage.error('请在系统设置中开启麦克风和摄像头权限')
        return false
    }
    let res: IsJoinTelephoneResponse = await reqIsJoinTelephone(userId, urlId)
    if (res.status === 200) {
        if (!res.data) ElMessage.error('请勿重复加入')
        return res.data
    } else if (res.status === 201) {
        // 正在通话中, 加入通话
        const { chatType, type, toId, fId } = (res as any).info
        let url = `/telephone/${type}?chatType=${chatType}&fId=${fId}&id=${toId}`
        if (type === 'screen') {
            ipcRenderer.send('open-screen-share', { type, url })
        } else {
            ipcRenderer.send('open-telephone', { type, url })
        }
        return false
    } else {
        ElMessage.error(res.msg)
        return false
    }
}

// 语音图标是否选中
let voiceActive = ref<boolean>(false)
// 语音组件是否打开
let voiceFlag = ref<boolean>(false)

/**
 * electron `open-telephone`事件参数
 * {
 *   type: 'voice' | 'video'
 *   url: '/telephone/voice?chatType=xxx&id=xxx&fId=xxx'
 *    // chatType 聊天类型  friend / group
 *    // id urlId 群id/好友id
 *    // fId 用户id
 * }
 */
// 语音通话
const voiceCall = async () => {
    if (!clickFlag.value) return
    clickFlag.value = false
    const { type, id } = $route.query
    let data = {
        fId: userInfoStore.userInfo._id, // 用户id
        toId: id, // urlid（好友id/群id）
        chatType: type, // 聊天类型(群聊group/私聊friend)
        type: 'voice' // 通话类型
    }
    let isJoin = await isJoinTelephone('voice')
    setTimeout(() => {
        clickFlag.value = true
    }, 1000)
    if (!isJoin) return
    proxy.socket.emit('notice_telephone', data)
    ipcRenderer.send('open-telephone', { type: 'voice', url: `/telephone/voice?chatType=${$route.query.type}&id=${$route.query.id}&fId=${userInfoStore.userInfo._id}` })
    handleBusMessage('voice')
}

// 视频图标是否选中
let videoActive = ref<boolean>(false)
// 视频组件是否打开
let videoFlag = ref<boolean>(false)

// 视频通话
const videoCall = async () => {
    if (!clickFlag.value) return
    clickFlag.value = false
    const { type, id } = $route.query
    let data = {
        fId: userInfoStore.userInfo._id, // 用户id
        toId: id, // urlid（好友id/群id）
        chatType: type, // 聊天类型(群聊group/私聊friend)
        type: 'video' // 通话类型
    }
    let isJoin = await isJoinTelephone('video')
    setTimeout(() => {
        clickFlag.value = true
    }, 1000)
    if (!isJoin) return
    proxy.socket.emit('notice_telephone', data)
    ipcRenderer.send('open-telephone', { type: 'video', url: `/telephone/video?chatType=${$route.query.type}&id=${$route.query.id}&fId=${userInfoStore.userInfo._id}` })
    handleBusMessage('video')
}

// 屏幕图标是否选中
let screenActive = ref<boolean>(false)
// 屏幕组件是否打开
let screenFlag = ref<boolean>(false)

// 屏幕共享
const screenShare = async () => {
    if (!clickFlag.value) return
    // 通知主进程获取媒体源缩略图
    clickFlag.value = false
    let isJoin = await isJoinTelephone('screen')
    setTimeout(() => {
        clickFlag.value = true
    }, 1000)
    if (!isJoin) return
    ipcRenderer.send('get-screen')
}

// 监听主进程获取缩略图成功事件
ipcRenderer.on('get-screen-success', (e: any) => {
    // 打开屏幕选择窗口  url参数: chatType => 群聊/私聊   id => 群聊id/私聊id
    ipcRenderer.send('open-screen-choose', { type: 'screen', url: `/telephone/screen/share?chatType=${$route.query.type}&id=${$route.query.id}` })
})

// 更多图标是否选中
let moreActive = ref<boolean>(false)
// 更多组件是否打开
let moreFlag = ref<boolean>(false)

// 更多
const more = () => {
    emit('open')
}
</script>

<style scoped lang="scss">
.header-menu {
    height: 100%;
    margin-left: auto;
    display: flex;
    align-items: center;

    .icon {
        margin-left: 10px;
    }

    .line {
        width: 2px;
        height: 20px;
        background-color: #888888;
        margin-left: 10px;
    }
}
</style>