<template>
    <TelephoneWin>
        <div class="content">
            <ul class="list" v-if="telephoneInfoData" :class="telephoneInfoData!.users.length > 9 ? 'list-n' : ''">
                <li class="item"
                    :class="telephoneInfoData!.users.length > 9 ? 'user-item-n' : `user-item-${telephoneInfoData!.users.length}`"
                    v-for="(item, index) in telephoneInfoData!.users" :key="index">
                    <!-- 开启视频 -->
                    <div class="card" v-if="$route.params.type === 'video'">
                        <video src="" :uid="item.userId"></video>
                        <div class="video-nick">{{ item.userInfo.nick }}</div>
                    </div>
                    <!-- 未开启视频 -->
                    <div class="card" v-else>
                        <div class="info">
                            <div class="user-pic">
                                <img :src="proxy.$baseUrl + item.userInfo.imgUrl" alt="">
                            </div>
                            <div class="nick">{{ item.userInfo.nick }}</div>
                            <video src="" :uid="item.userId"></video>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <template #footer>
            <!-- 退出通话 -->
            <div class="logout">
                <div class="btn" @click="close">
                    <svg t="1702130450974" class="icon" viewBox="0 0 1024 1024" version="1.1"
                        xmlns="http://www.w3.org/2000/svg" p-id="35754" width="23" height="23">
                        <path
                            d="M512.420571 321.92c-185.563429 0-359.990857 39.003429-446.994285 126.006857C26.422857 487.350857 6.290286 534.930286 8.868571 592.365714c1.700571 34.706286 12.434286 65.554286 32.548572 85.705143 15.451429 15.433143 36.022857 24.009143 60.434286 20.150857l159.012571-27.008c23.990857-3.84 40.704-11.154286 51.419429-22.290285 14.153143-13.714286 18.432-34.285714 18.432-61.275429l0.438857-43.282286c0-6.857143 2.980571-12.013714 6.857143-16.292571 4.278857-5.138286 10.697143-7.296 15.414857-8.576 29.147429-6.857143 88.722286-13.275429 158.994285-13.275429 70.729143 0 129.865143 5.12 159.012572 13.714286 4.278857 1.28 10.276571 3.84 14.994286 8.137143 4.278857 4.278857 6.857143 8.996571 6.857142 15.853714l0.438858 43.702857c0.420571 27.008 4.699429 47.579429 18.413714 61.293715 11.154286 11.154286 27.867429 18.432 51.858286 22.290285l156.854857 26.569143c25.289143 4.297143 46.72-4.717714 63.451428-20.992 20.114286-19.712 31.268571-50.139429 32.128-84.845714 1.28-57.874286-20.571429-105.453714-59.136-144.018286-87.424-87.003429-259.291429-125.988571-444.854857-125.988571z"
                            p-id="35755" data-spm-anchor-id="a313x.search_index.0.i29.55893a81fQKlCG" class="selected"
                            fill="#ffffff"></path>
                    </svg>
                </div>
                <div class="text">退出通话</div>
            </div>
        </template>
    </TelephoneWin>
</template>

<script setup lang="ts">
import TelephoneWin from '@/components/TelephoneWin/index.vue'
import { getCurrentInstance, onMounted, ref, nextTick } from 'vue'
import { getLocalStream } from '@/utils/getLocalStream'
import { useRoute } from 'vue-router'
import { useUserInfoStore } from '@/store/modules/user'
import { ElMessage } from 'element-plus'
const { ipcRenderer } = require('electron')
const $route = useRoute()
const userInfoStore = useUserInfoStore()
const { proxy } = getCurrentInstance() as any

// 本地音视频流
let localStream = ref<MediaStream>()
// 媒体参数
type ConstraintsType = {
    audio: boolean;
    video: boolean;
}
let constraints = ref<ConstraintsType>({
    audio: true,
    video: $route.params.type === 'voice' ? false : true
})

// 初始化本地音视频流
const initLocalStream = async () => {
    let stream = await getLocalStream(constraints.value)
    localStream.value = stream
    const { fId, id, chatType } = $route.query
    let userId = userInfoStore.userInfo._id
    // 记录正在通话的用户
    let saveData = {
        userId, // 当前用户的id(同意方id)
        fId, // 发起者id
        toId: id, // 好友id/群id 也可以理解为房间id
        chatType, // 聊天类型
        type: $route.params.type // 通话类型
    }
    proxy.socket.emit('user_jion_telephone', saveData)
}

onMounted(async () => {
    // 初始化自己的本地音视频流
    await initLocalStream()
})

type TelephoneUserItemInfo = {
    _id: string;
    userId: string;
    fId: string;
    toId: string;
    chatType: string;
    type: string;
    startTime?: string;
    userInfo: {
        _id: string;
        nick: string;
        imgUrl: string;
    }
}
interface TelephoneInfoData {
    userId: string; // 当前用户的id(同意方id)
    fId: string; // 发起方id
    toId: string; // 好友id/群id 也可以理解为房间id
    chatType: string; // 聊天类型
    type: string; // 通话类型
    users: TelephoneUserItemInfo[]
}

let telephoneInfoData = ref<TelephoneInfoData>()
// 获取加入通话的所有人
ipcRenderer.on('telephone_users', (e: any, data: TelephoneInfoData) => {
    telephoneInfoData.value = data
    data.users.forEach(user => {
        if (user.userInfo._id === userInfoStore.userInfo._id) {
            // 通话发起人（自己）
            let uid = userInfoStore.userInfo._id
            addMediaStream((localStream.value) as MediaStream, uid) // 需要发起方id
            // 新加入的用户通知其他用户（用于界面展示）
            proxy.socket.emit('add_group_telephone', user)
        } else {
            // 发送方同意通话（其他人）
            // user.userId 其他用户id
            toAcceptTelephone(user.userId)
        }
    })
})

// 添加音视频流
const addMediaStream = (mediaStream: MediaStream, uid: string) => {
    nextTick(() => {
        document.querySelectorAll('video').forEach((video: HTMLVideoElement) => {
            // video 元素绑定的自定义属性 uid
            let video_uid = video.getAttribute('uid')
            if (video_uid === uid) {
                video.srcObject = mediaStream
                video.play().catch(err => { })
            }
        })
    })
}

// 同意方同意通话
const toAcceptTelephone = (acceptId: string) => {
    // acceptId: string 是需要建立rtc的用户id（其他用户id）
    const { id, chatType } = $route.query // 路由参数也有个fId（这个fId是通话发起者的id）
    let userId = userInfoStore.userInfo._id
    // 通话接收人 socket通知发起方可以交换SDP信息
    let sendData = {
        acceptId, // 其他用户的id(同意方id)
        fId: userId, // 发起者id(自己id, 建立offer的人, 群聊中不一定是通话发起方)
        toId: id, // 好友id/群id 也可以理解为房间id
        chatType, // 聊天类型
        type: $route.params.type // 通话类型
    }
    proxy.socket.emit('accept_telephone', sendData)
}

ipcRenderer.on('add_group_telephone', (e: any, data: TelephoneUserItemInfo) => {
    let index = telephoneInfoData.value?.users.findIndex((item: TelephoneUserItemInfo) => item.userId === data.userId)
    if (index === -1) {
        telephoneInfoData.value?.users.push(data)
    }
})

// peer信息 RTCPeerConnection
let peer = ref<RTCPeerConnection>()

type AcceptData = {
    acceptId: string;
    chatType: string;
    fId: string;
    toId: string;
    type: string;
}
// 同意方同意通话请求, 发起方开始交换SDP和candidate信息
ipcRenderer.on('send_acceptData', async (e: any, data: AcceptData) => {
    // 发起方创建RTCPeerConnection
    peer.value = new RTCPeerConnection()
    // 获取媒体轨道, 添加本地音视频流
    for (const track of localStream.value!.getTracks()) {
        peer.value.addTrack(track)
    }

    // 发起方监听candidate信息, 双方交换了SDP信息才开始监听
    peer.value.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
        if (e.candidate) {
            // 发起方交换candidate信息
            let candidateData = {
                fId: data.fId, // 发起方id
                acceptId: data.acceptId, // 同意方id
                type: $route.params.type,
                chatType: $route.query.chatType,
                candidate: e.candidate,
                userType: data.fId // 用作身份判断(发送方)
            }
            proxy.socket.emit('send_candidate', candidateData)
        }
    }

    peer.value.ontrack = async (e: RTCTrackEvent) => {
        let mediaStream = new MediaStream()
        mediaStream.addTrack(e.track)
        addMediaStream(mediaStream, data.acceptId) // 需要接收者id
    }

    try {
        // 生成offer
        const offer = await peer.value.createOffer()
        //设置offer未本地描述
        await peer.value.setLocalDescription(offer)
        // 发送offer
        let offerParams = {
            offer,
            fId: data.fId, // 发起方id
            acceptId: data.acceptId, // 同意方id
            type: $route.params.type,
            chatType: $route.query.chatType
        }
        proxy.socket.emit('send_offer', offerParams)
    } catch (error) {
        ElMessage.error('出错了, 请稍后再试')
    }
})

type OfferParams = {
    acceptId: string;
    chatType: string;
    fId: string;
    type: string;
    offer: any; // 发起方创建的offer信息
}
// 同意方收到发起方的offer，开始交换SDP
ipcRenderer.on('send_offer', async (e: any, params: OfferParams) => {
    // 同意方创建RTCPeerConnection
    peer.value = new RTCPeerConnection()

    for (const track of localStream.value!.getTracks()) {
        peer.value.addTrack(track)
    }

    peer.value.onicecandidate = (e: RTCPeerConnectionIceEvent) => {
        if (e.candidate) {
            // 发起方交换candidate信息
            let candidateData = {
                fId: params.fId, // 发起方id
                acceptId: params.acceptId, // 同意方id
                type: $route.params.type,
                chatType: $route.query.chatType,
                candidate: e.candidate,
                userType: params.acceptId // 用作身份判断(同意方)
            }
            proxy.socket.emit('send_candidate', candidateData)
        }
    }

    // 监听onaddstream来获取对方的音视频流
    peer.value.ontrack = (e: RTCTrackEvent) => {
        let mediaStream = new MediaStream()
        mediaStream.addTrack(e.track)
        addMediaStream(mediaStream, params.fId) // 需要发起者id
    }

    try {
        // 设置远端描述信息(也就是设置发起方发送来的offer, offer就是发起方的SDP信息)
        await peer.value.setRemoteDescription(params.offer)
        // 生成answer
        let answer = await peer.value.createAnswer()
        // 在本地设置answer信息
        await peer.value.setLocalDescription(answer)
        // 发送answer
        let answerParams = {
            answer,
            fId: params.fId, // 发起方id
            acceptId: params.acceptId, // 同意方id
            type: $route.params.type,
            chatType: $route.query.chatType
        }
        proxy.socket.emit('send_answer', answerParams)
    } catch (error) {
        ElMessage.error('出错了, 请稍后再试')
    }
})

type AnswerParams = {
    acceptId: string;
    chatType: string;
    fId: string;
    type: string;
    answer: any; // 发起方创建的offer信息
}
// 发起方接收answer
ipcRenderer.on('send_answer', async (e: any, parmas: AnswerParams) => {
    try {
        await peer.value!.setRemoteDescription(parmas.answer)
    } catch (error) { }
})

// 收到candidate信息(双方互相发送过信息)
type CandidateData = {
    fId: string; // 发起方id
    acceptId: string; // 同意方id
    type: string;
    chatType: string;
    candidate: any;
    userType: string;// 用作身份判断(同意方)
}
ipcRenderer.on('send_candidate', async (e: any, candidateData: CandidateData) => {
    try {
        // 互相交换candidate信息
        await peer.value!.addIceCandidate(new RTCIceCandidate(candidateData.candidate))
    } catch (error) { }
})

// 其他用户退出
ipcRenderer.on('close-telephone-data', (e: any, data: any) => {
    // userId是已经退出的用户的id
    let index = telephoneInfoData.value!.users.findIndex(item => item.userId === data.userId)
    if (index === -1) return
    telephoneInfoData.value!.users.splice(index, 1)
    if ($route.query.chatType === 'friend') {
        initLocalStream()
    }
})

// 结束通话
const close = () => {
    let closeData = {
        userId: userInfoStore.userInfo._id,
        toId: $route.query.id,
        chatType: $route.query.chatType,
        type: $route.params.type
    }
    localStream.value!.getTracks().forEach(track => track.stop())
    // 通知服务器结束通话
    proxy.socket.emit('close_telephone', closeData)
    // 关闭窗口
    ipcRenderer.send('close-telephone')
}
</script>

<style lang="scss" scoped>
.content {
    width: 100%;
    height: 100%;
    overflow: auto;

    &::-webkit-scrollbar {
        display: none;
    }

    ul {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;

        .item {
            padding: 5px;

            .card {
                width: 100%;
                height: 100%;
                background-color: #292929;
                border: 2px solid #2c2c2c;
                border-radius: 5px;
                position: relative;

                video {
                    width: 100%;
                    height: 100%;
                }

                .video-nick {
                    position: absolute;
                    left: 5px;
                    bottom: 5px;
                    color: #cdcdcd;
                    font-size: 13px;
                    text-shadow: 2px 2px 2px rgba(0, 0, 0, .5);
                }

                .info {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    padding: 10% 0;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: relative;

                    video {
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        z-index: -1;
                    }

                    .user-pic {
                        width: 45px;
                        height: 45px;
                        border-radius: 50%;
                        overflow: hidden;
                        margin-bottom: 15px;

                        img {
                            width: 100%;
                            height: 100%;
                        }
                    }

                    .nick {
                        color: #cdcdcd;
                        font-size: 15px;
                    }
                }
            }
        }

        .user-item-1 {
            width: 100%;
            height: 100%;
        }

        .user-item-2 {
            width: 50%;
            height: 100%;
        }

        .user-item-3,
        .user-item-4 {
            width: 50%;
            height: 50%;
        }

        .user-item-5,
        .user-item-6 {
            width: 33.33333%;
            height: 50%;
        }

        .user-item-7,
        .user-item-8,
        .user-item-9 {
            width: 33.33333%;
            height: 33.33333%;
        }

        .user-item-n {
            width: 33.33333%;
            height: 33.33333%;
        }
    }

    .list-n {
        justify-content: flex-start;
    }
}

.microphone,
.logout {
    width: 70px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;

    .btn {
        width: 45px;
        height: 45px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 20%;
    }

    .text {
        color: #fff;
        margin-top: 10px;
    }
}

.microphone {
    .btn {
        background-color: #ffffff;

        &:hover {
            background-color: #efefef;
        }
    }
}

.logout {
    .btn {
        background-color: #ff0040;

        &:hover {
            background-color: #e55555;
        }
    }
}
</style>
