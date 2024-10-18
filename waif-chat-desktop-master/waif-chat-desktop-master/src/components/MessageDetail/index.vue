<template>
	<div class="container">
		<!-- 头部 -->
		<div class="messgae-detail-header drag">
			<div class="nick text-ellipsis">{{ $route.query.name }}</div>
			<HeaderMenu @open="open" />
		</div>
		<!-- pop背景层 -->
		<div class="bg" v-if="isShow" @click="isShow = false"></div>
		<!-- pop弹出层 -->
		<div class="popup" :class="isShow ? 'show' : 'hidden'">
			<ChatPopup v-if="isShow" />
		</div>
		<!-- 通话提示 -->
		<div class="join-telephone" v-if="telephoneStore.messageDetailsTelephoneInfo!.show">
			<span class="text-ellipsis">{{ telephoneStore.messageDetailsTelephoneInfo!.nick }}发起了{{ telephoneMsgText(telephoneStore.messageDetailsTelephoneInfo!.type) }}
			</span>
			<div class="join-btn" @click="handleJoinTelephoneTip">加入通话</div>
		</div>
		<!-- 聊天内容容器 -->
		<main ref="mainContent">
			<div class="messgae-content">
				<!-- 加载更多 -->
				<div class="loading-more"
					:style="`margin-top: ${telephoneStore.messageDetailsTelephoneInfo!.show ? '55px' : '15px'};`"
					v-if="messageStore.canLoadingMore">
					<div v-if="!isLoading" class="more" @click="more">
						<span>加载更多</span>
						<el-icon size="13">
							<ArrowUpBold />
						</el-icon>
					</div>
					<div v-else class="loading">加载中...</div>
				</div>
				<!-- 每条消息 -->
				<div class="message-item" v-for="(item, index) in messageStore.messageChatList" :key="index">
					<!-- 消息时间 -->
					<div class="message-time"
						v-if="index === 0 ? true : messageStore.messageChatList[index - 1].time !== item.time">{{
				item.time }}</div>
					<!-- 用户昵称 -->
					<div class="user-nick"
						v-if="$route.query.type === 'group' && item.userId._id !== userInfoStore.userInfo._id">{{
				item.userId.nick }}</div>
					<!-- 每条消息 -->
					<div :class="item.userId._id === userInfoStore.userInfo._id ? 'message-my' : 'message-friend'">
						<!-- 对方消息头像在左侧 -->
						<div class="user-pic" v-if="item.userId._id !== userInfoStore.userInfo._id">
							<img :src="proxy.$baseUrl + item.userId.imgUrl" alt="" />
						</div>
						<!-- 已被删除(红色感叹号) 自己 -->
						<div class="del-dot friend-dot"
							v-if="!item.messageStatus && item.userId._id === userInfoStore.userInfo._id">!</div>
						<div class="message-text-warp">
							<!-- 消息类型 0: 文本消息(包含emoji, 单个emoji会呈现大图) -->
							<div class="message-text"
								:class="item.userId._id === userInfoStore.userInfo._id ? 'my' : 'friend'"
								v-if="item.msgType === 0">
								<div v-html="item.message"></div>
							</div>
							<!-- 消息类型 1: 图片消息 -->
							<div v-if="item.msgType === 1" class="message-img">
								<div style="border-radius: 8px; overflow: hidden;"
									:style="item.message.indexOf('data:image') > -1 ? '' : `height: ${JSON.parse(item.message).height}px;`">
									<el-image
										:src="item.message.indexOf('data:image') > -1 ? item.message : proxy.$baseUrl + JSON.parse(item.message).url"
										fit="contain"
										:preview-src-list="[item.message.indexOf('data:image') > -1 ? item.message : proxy.$baseUrl + JSON.parse(item.message).url]">
										<template #placeholder>
											<div class="image-slot"
												style="width: 200px; height: 150px;font-size: 15px;">
												加载中...</div>
										</template>
										<template #error>
											<div class="image-slot" style="width: 200px; height: 150px;">
												<el-icon><icon-picture /></el-icon>
											</div>
										</template>
									</el-image>
								</div>
								<!-- loading -->
								<div class="loading" v-if="item.loading">
									<img src="@/assets/svg/loading.svg" alt="">
								</div>
							</div>
							<!-- 消息类型 2: 视频消息 -->
							<div class="message-video-cover" v-if="item.msgType === 2"
								@click="goVideoDetail(JSON.parse(item.message).url)">
								<div class="video-content">
									<img :src="JSON.parse(item.message).base64" alt="">
									<div class="video-icon">
										<svg t="1698152236130" class="icon" viewBox="0 0 1024 1024" version="1.1"
											xmlns="http://www.w3.org/2000/svg" p-id="4915" width="40" height="40">
											<path
												d="M512 1024C229.2224 1024 0 794.7776 0 512S229.2224 0 512 0s512 229.2224 512 512-229.2224 512-512 512z m0-85.3248c235.5968 0 426.5984-191.0272 426.5984-426.6752 0-235.648-191.0016-426.6752-426.5984-426.6752-235.5968 0-426.5984 191.0272-426.5984 426.6752 0 235.648 191.0016 426.6752 426.5984 426.6752z m-127.6928-571.3408c0-9.856 3.072-19.4816 8.8576-27.52a47.7696 47.7696 0 0 1 66.4064-11.008l203.6992 144.6912a47.1552 47.1552 0 0 1 0 77.0304l-203.6992 144.64a47.7952 47.7952 0 0 1-27.6736 8.832 47.4624 47.4624 0 0 1-47.616-47.3344V367.36z"
												fill="#ffffff" p-id="4916"></path>
										</svg>
									</div>
								</div>
								<el-progress class="progress" v-if="item.loading" :stroke-width="2"
									:percentage="item.progressNum" :show-text="false" />
								<!-- loading -->
								<div class="loading" v-if="item.loading">
									<img src="@/assets/svg/loading.svg" alt="">
								</div>
							</div>
							<!-- 消息类型 3: 文件消息 -->
							<div class="message-file" v-if="item.msgType === 3" @click="openFile(item.message)">
								<img width="40" height="40"
									:src="`./file/${supportFileType.find(i => i === JSON.parse(item.message).fileSuffixName) ? JSON.parse(item.message).fileSuffixName : 'other'}.svg`"
									alt="">
								<div class="message-file-info">
									<div class="message-file-name">{{ JSON.parse(item.message)?.fileName }}</div>
									<div class="message-file-size">{{ formatFileSize(JSON.parse(item.message).size) }}
									</div>
								</div>
								<el-progress class="progress" v-if="item.loading" :stroke-width="2"
									:percentage="item.progressNum" :show-text="false" />
								<!-- loading -->
								<div class="loading" v-if="item.loading">
									<img src="@/assets/svg/loading.svg" alt="">
								</div>
							</div>
							<!-- 消息类型 4: 单个emoji(变成大的emoji) -->
							<div class="message-emoji" v-if="item.msgType === 4">
								<div v-html="item.message"></div>
							</div>
							<!-- 消息类型 5: markdown预览 -->
							<div class="message-md"
								:class="item.userId._id === userInfoStore.userInfo._id ? 'my' : 'friend'"
								v-if="item.msgType === 5">
								<MdPreview :modelValue="item.message" />
							</div>
							<!-- 消息类型 6: 语音通话
								 消息类型 7: 视频通话
								 消息类型 8: 屏幕共享 -->
							<div v-if="item.msgType === 6 || item.msgType === 7 || item.msgType === 8"
								class="message-telephone"
								:class="item.userId._id === userInfoStore.userInfo._id ? 'my' : 'friend'">
								<!-- icon: 语音 -->
								<svg v-if="item.msgType === 6" t="1699165279771" style="transform: rotateY(180deg);"
									class="telephone-icon"
									:class="item.userId._id === userInfoStore.userInfo._id ? 'telephone-icon-my' : 'telephone-icon-friend'"
									viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2973"
									width="23" height="23">
									<path
										d="M877.1 238.7L770.6 132.3c-13-13-30.4-20.3-48.8-20.3s-35.8 7.2-48.8 20.3L558.3 246.8c-13 13-20.3 30.5-20.3 48.9 0 18.5 7.2 35.8 20.3 48.9l89.6 89.7c-20.6 47.8-49.6 90.6-86.4 127.3-36.7 36.9-79.6 66-127.2 86.6l-89.6-89.7c-13-13-30.4-20.3-48.8-20.3-18.5 0-35.8 7.2-48.8 20.3L132.3 673c-13 13-20.3 30.5-20.3 48.9 0 18.5 7.2 35.8 20.3 48.9l106.4 106.4c22.2 22.2 52.8 34.9 84.2 34.9 6.5 0 12.8-0.5 19.2-1.6 132.4-21.8 263.8-92.3 369.9-198.3C818 606 888.4 474.6 910.4 342.1c6.3-37.6-6.3-76.3-33.3-103.4z m-37.6 91.5c-19.5 117.9-82.9 235.5-178.4 331s-213 158.9-330.9 178.4c-14.8 2.5-30-2.5-40.8-13.2L184.9 721.9 295.7 611l119.8 120 0.9 0.9 21.6-8C570.7 675 674.9 570.8 723.7 438.1l8-21.6-120.8-120.7 110.8-110.9 104.5 104.5c10.8 10.8 15.8 26 13.3 40.8z"
										p-id="2974">
									</path>
								</svg>
								<!-- icon: 视频 -->
								<svg v-if="item.msgType === 7" t="1699165177594" class="telephone-icon"
									:class="item.userId._id === userInfoStore.userInfo._id ? 'telephone-icon-my' : 'telephone-icon-friend'"
									viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4522"
									width="23" height="23">
									<path
										d="M912 302.3L784 376V224c0-35.3-28.7-64-64-64H128c-35.3 0-64 28.7-64 64v576c0 35.3 28.7 64 64 64h592c35.3 0 64-28.7 64-64V648l128 73.7c21.3 12.3 48-3.1 48-27.6V330c0-24.6-26.7-40-48-27.7zM712 792H136V232h576v560z m176-167l-104-59.8V458.9L888 399v226z"
										p-id="4523">
									</path>
									<path
										d="M208 360h112c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H208c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8z"
										p-id="4524">
									</path>
								</svg>
								<!-- icon: 屏幕共享 -->
								<svg v-if="item.msgType === 8" t="1699164753923" class="telephone-icon"
									:class="item.userId._id === userInfoStore.userInfo._id ? 'telephone-icon-my' : 'telephone-icon-friend'"
									viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1478"
									width="23" height="23">
									<path
										d="M927.744 192.307H224.256c-17.715 0-32.051 14.336-32.051 32.051v159.744c0 17.716 14.336 32.052 32.051 32.052s32.051-14.336 32.051-32.052V256.307h639.488v383.488H576c-17.715 0-32.051 14.336-32.051 32.051s14.336 32.052 32.051 32.052h351.744c17.715 0 32.051-14.336 32.051-32.052v-447.59c0-17.715-14.336-31.949-32.051-31.949z"
										p-id="1479">
									</path>
									<path
										d="M479.744 447.795h-384c-17.715 0-32.051 14.336-32.051 32.051v256c0 17.716 14.336 32.052 32.051 32.052h384c17.715 0 32.051-14.336 32.051-32.052v-256c0-17.817-14.336-32.05-32.051-32.05z m-31.949 256h-320v-192h320v192z m-64.307 96.256H192.512c-17.715 0-32.051 14.336-32.051 32.051s14.336 32.052 32.051 32.052h190.976c17.715 0 32.051-14.336 32.051-32.052s-14.336-32.05-32.051-32.05z m320-64.614h-0.307l-127.488 1.024c-17.715 0.102-31.847 14.54-31.744 32.256 0.102 17.613 14.438 31.744 31.949 31.744h0.307l127.488-1.024c17.715-0.103 31.846-14.541 31.744-32.256-0.103-17.51-14.439-31.744-31.949-31.744z"
										p-id="1480">
									</path>
								</svg>
								发起了{{ telephoneMsgText(item.msgType) }}
							</div>
						</div>
						<!-- 自己头像在右边 -->
						<div class="user-pic" v-if="item.userId._id === userInfoStore.userInfo._id">
							<img :src="proxy.$baseUrl + item.userId.imgUrl" alt="" />
						</div>
					</div>
				</div>
			</div>
		</main>
		<!-- 底部消息编辑框 -->
		<div class="message-edit-bottom">
			<BottomInput @handleSendMessage="handleSendMessage" />
		</div>
	</div>
</template>

<script setup lang="ts">
import HeaderMenu from '@/components/HeaderMenu/index.vue'
import BottomInput from '@/components/BottomInput/index.vue'
import ChatPopup from '@/components/ChatPopup/index.vue'
import { Picture as IconPicture, ArrowUpBold } from '@element-plus/icons-vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { nextTick, ref, watch, getCurrentInstance, onMounted, computed } from "vue"
import { formatTime } from '@/utils/formatTime'
import { flagUserStatus } from '@/utils/flagUserStatus'
// 文件大小转换
import { formatFileSize } from '@/utils/formatFileSize'
// $bus
import $bus from '@/utils/eventBus'
// api
import { reqCanJoinTelephone } from '@/api/telephone/index'
import type { CanJoinTelephoneResponse } from '@/api/telephone/type'
// pinia
import { useUserInfoStore } from "@/store/modules/user"
import { useMessageStore } from '@/store/modules/message'
import type { MessageType } from '@/store/modules/interface/messageType'
import { useTelephoneStore } from '@/store/modules/telephone'
// route
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
const { ipcRenderer, shell } = require('electron')
// pinia
const userInfoStore = useUserInfoStore()
const messageStore = useMessageStore()
const telephoneStore = useTelephoneStore()
// route
const $route = useRoute()
// baseUrl socket
const { proxy } = getCurrentInstance() as any

let isShow = ref<boolean>(false)
const open = () => {
	isShow.value = !isShow.value
}

// 加入通话提示按钮
const handleJoinTelephoneTip = async () => {
	const { id, type } = $route.query
	let urlId = id as string
	let userId = userInfoStore.userInfo._id
	let chatType = type as string
	let res: CanJoinTelephoneResponse = await reqCanJoinTelephone(urlId, userId, chatType)
	if (res.status === 200) {
		// 可以加入通话
		const { chatType, type, toId, fId } = (res.data as any).info
		let url = `/telephone/${type}?chatType=${chatType}&fId=${fId}&id=${toId}`
		if (type === 'screen') {
			ipcRenderer.send('open-screen-share', { type, url })
		} else {
			ipcRenderer.send('open-telephone', { type, url })
		}
	} else {
		if (res.status === 402) {
			// 通话已结束
			telephoneStore.clearMessageDetailsTelephoneInfo()
		}
		ElMessage.error(res.msg)
	}
}

onMounted(() => {
	// 获取聊天记录
	getChatRecordsList()
	// 将消息设置为已读
	messageStore.setMessageRead()
	// 获取聊天详情是否有通话
	telephoneStore.setMessageDetailsTelephoneInfo($route.query.id as string, $route.query.type as string)
})

// 当前聊天记录页数
let pageNum = ref<number>(1)

// 获取聊天记录列表
const getChatRecordsList = (pageNum: number = 1) => {
	const userId = userInfoStore.userInfo._id // 用户id
	let id = $route.query.id // 好友/群id
	if ($route.query.type === 'friend') {
		// 获取好友消息记录列表
		messageStore.getFriendChatRecordsList(userId, id as string, pageNum)
	} else if ($route.query.type === 'group') {
		// 获取群消息记录列表
		messageStore.getGroupChatRecordsList(userId, id as string, pageNum)
	}
}

// 加载更多
const more = () => {
	pageNum.value++
	isLoading.value = true
	isLoadingMore.value = true
	getChatRecordsList(pageNum.value)
}

watch(() => messageStore.messageChatList, () => {
	nextTick(() => {
		// 获取页面上的a标签添加点击事件
		mainContent.value.querySelectorAll('a').forEach((a: HTMLAnchorElement) => {
			a.addEventListener('click', (e) => {
				let url = a.href
				e.preventDefault()
				ipcRenderer.send('open-webview', url)
			})
		})
		if (!messageStore.messageChatList.length) return
		handleScroll()
	})
}, { deep: true })

// 获取dom
const mainContent = ref()
// 记录内容高度
const mainContentHeightArr = ref<number[]>([])
// 是否是初始化
let isInit = ref<boolean>(true)
// 是否加载更多数据
let isLoadingMore = ref<boolean>(false)
// 是在加载中
let isLoading = ref<boolean>(false)

// 控制滚动方法
const handleScroll = () => {
	// 将聊天记录容器高度记录下来
	mainContentHeightArr.value.unshift(mainContent.value.scrollHeight)

	if (messageStore.messageChatList.length !== 0 && isInit.value) {
		// 首次加载数据
		isShow.value = false
		isInit.value = false
		mainContent.value.scrollTop = mainContent.value.scrollHeight
	} else if (isLoadingMore.value) {
		// 加载更多数据
		mainContent.value.scrollTop = mainContentHeightArr.value[0] - mainContentHeightArr.value[1]
		isLoadingMore.value = false
		isLoading.value = false
	} else {
		// 发送消息
		mainContent.value.scrollTo({
			top: mainContent.value.scrollHeight,
			behavior: 'smooth'
		})
	}
}

watch(() => $route.query.id, () => {
	// 数据初始化
	isInit.value = true
	mainContentHeightArr.value = []
	pageNum.value = 1
	isLoadingMore.value = false
	isLoading.value = false
	// 加载数据
	let userId = userInfoStore.userInfo._id
	let type = $route.query.type
	let id = ($route.query.id) as string
	if (type === 'friend') {
		messageStore.getFriendChatRecordsList(userId, id, 1)
	} else if (type === 'group') {
		messageStore.getGroupChatRecordsList(userId, id, 1)
	}
	// 将消息设置为已读
	messageStore.setMessageRead()
	// 获取聊天详情是否有通话
	telephoneStore.setMessageDetailsTelephoneInfo($route.query.id as string, $route.query.type as string)
})

// 发送按钮事件回调
const handleSendMessage = (msg: string, msgType: number) => {
	const { _id, nick, imgUrl } = userInfoStore.userInfo
	let data: MessageType = {
		userId: {
			_id, nick, imgUrl,
		},
		time: formatTime(new Date),
		msgType,
		message: msg
	}
	// 发送者id
	let uId = _id
	// 接收者id
	let toId = $route.query.id
	messageStore.pushMessageData(data)
	const chatType = $route.query.type
	// 将消息置顶
	messageStore.messageList.map((item, index) => {
		if (item._id === $route.query.id) messageStore.messageList.unshift(messageStore.messageList.splice(index, 1)[0])
	})
	// 改变消息列表中, 最近一次消息的时间
	messageStore.messageList[0].lastMsg!.time = new Date()
	if (!flagUserStatus()) return
	if (chatType === 'friend') {
		// 私聊消息通知
		proxy.socket.emit('private_chat', data, uId, toId)
	} else if (chatType === 'group') {
		// 群聊消息通知
		proxy.socket.emit('group_chat', data, uId, toId)
	}
}

// 发送通话类型消息(utils/busTelephoneMessage.ts文件中)
$bus.on('telephone_message', (e: any) => {
	const { msgType, type } = e
	// msgType: number
	let data = {
		fId: userInfoStore.userInfo._id, // 发起者id
		toId: $route.query.id, // urlId(群/好友id)
		type: $route.query.type, // 聊天类型
		msgType
	}
	handleSendMessage(JSON.stringify(data), msgType as number)
	let setData = {
		fId: userInfoStore.userInfo._id,
		toId: $route.query.id as string,
		chatType: $route.query.type as string,
		type
	}
	// 存pinia
	telephoneStore.setTelephoneInfo(setData)
})

// 支持的文件类型
const supportFileType = ['apk', 'cad', 'css', 'dmg', 'docx', 'doc', 'exe', 'gif', 'gitignore', 'html', 'ipa', 'iso', 'java', 'js', 'json', 'jsx', 'less', 'md', 'mp3', 'mp4', 'mov', 'pdf', 'ppt', 'psd', 'py', 'scss', 'sql', 'styles', 'svg', 'ts', 'txt', 'vue', 'xlxs', 'zip']

// 去视频详情页
const goVideoDetail = (url: string) => {
	ipcRenderer.send('open-video', url)
}

// 打开文件
const openFile = (message: string) => {
	let url = JSON.parse(message).url
	shell.openExternal(proxy.$baseUrl + url)
}

// 通话类型文字
const telephoneMsgText = computed(() => (msgType: number | string) => {
	let text: string = ''
	switch (msgType) {
		case 6: text = '语音通话'
			break
		case 7: text = '视频通话'
			break
		case 8: text = '屏幕共享'
			break
		case 'voice': text = '语音通话'
			break
		case 'video': text = '视频通话'
			break
		case 'screen': text = '屏幕共享'
			break
	}
	return text
})
</script>

<style scoped lang="scss">
.container {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	position: relative;
	overflow: hidden;

	.messgae-detail-header {
		width: 100%;
		height: 50px;
		padding: 0 0 0 20px;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		font-size: 16px;
		border-bottom: var(--messgae-detail-header-border);
		color: var(--messgae-detail-header-color);

		.nick {
			max-width: 200px;
		}
	}

	.bg {
		width: 100%;
		position: fixed;
		top: 50px;
		bottom: 0;
		z-index: 98;
	}

	.popup {
		width: 260px;
		background-color: var(--message-detail-popup-bg-color);
		position: absolute;
		top: 50px;
		bottom: 0;
		right: 0;
		z-index: 99;
		transition: all 0.3s;
	}

	.show {
		transform: translateX(0);
		box-shadow: -18px 10px 20px 3px rgba(0, 0, 0, 0.03);
	}

	.hidden {
		transform: translateX(100%);
	}

	.message-edit-bottom {
		width: 100%;
		height: 200px;
		border-top: var(--message-bottom-input-border-top);
		padding: 10px 15px;
		box-sizing: border-box;
	}
}

.join-telephone {
	position: absolute;
	top: 50px;
	width: 100%;
	height: 40px;
	padding: 0 10px 0 15px;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	z-index: 10;
	background-color: var(--chat-content-detail-bg-color);
	border-bottom: var(--messgae-detail-header-border);

	span {
		flex: 1;
		margin-right: 10px;
		font-size: 13px;
		color: var(--messgae-detail-header-color);
	}

	.join-btn {
		padding: 7px 10px;
		font-size: 12px;
		background-color: #0091ff;
		color: var(--message-my-color);
		border-radius: 3px;
		cursor: pointer;

		&:hover {
			background-color: #81aaf5;
		}
	}
}

main {
	width: 100%;
	flex: 1;
	overflow: auto;

	.messgae-content {
		width: 100%;
		padding: 0 20px;
		box-sizing: border-box;

		.loading-more {
			width: 100%;
			font-size: 13px;
			text-align: center;
			margin-bottom: 15px;
			color: #9195a1;
			display: flex;
			justify-content: center;
			align-items: center;
			cursor: pointer;

			.more,
			.loading {
				display: flex;
				justify-content: center;
				align-items: center;
				cursor: pointer;
			}
		}

		.message-item {
			width: 100%;

			.message-time {
				width: 100%;
				display: flex;
				justify-content: center;
				margin-bottom: 20px;
				font-size: 13px;
				color: #b0b0b0;
			}

			.user-nick {
				font-size: 12px;
				margin-bottom: 10px;
				color: #9a9898;
			}

			.message-my,
			.message-friend {
				width: 100%;
				display: flex;
				margin-bottom: 25px;
				-webkit-user-select: text;
				-moz-user-select: text;
				-ms-user-select: text;
				user-select: text;

				.user-pic {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					overflow: hidden;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.del-dot {
					width: 20px;
					height: 20px;
					border-radius: 50%;
					overflow: hidden;
					background-color: #ff3300;
					align-self: flex-end;
					color: #fff;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 13px;
					font-weight: 600;
				}

				.message-text-warp {
					margin: 0 10px;

					.loading {
						position: absolute;
						left: -25px;
						bottom: 0;
						animation: spin 1s infinite linear;
						width: 20px;
						height: 20px;
						overflow: hidden;

						img {
							width: 100%;
							height: 100%;
						}
					}

					@keyframes spin {
						from {
							transform: rotate(0deg);
						}

						to {
							transform: rotate(360deg);
						}
					}

					.message-text,
					.message-telephone {
						max-width: 55vw;
						padding: 10px;
						box-sizing: border-box;
						border-radius: 10px;
						line-height: 22px;
						font-size: 15px;
					}

					.message-telephone {
						cursor: pointer;
						display: flex;
						align-items: center;

						.telephone-icon {
							margin-right: 5px;
						}

						.telephone-icon-my {
							fill: var(--telephone-icon-my-color);
						}

						.telephone-icon-friend {
							fill: var(--telephone-icon-friend-color);
						}
					}

					.message-img {
						max-width: 200px;
						position: relative;

						.image-slot {
							display: flex;
							justify-content: center;
							align-items: center;
							background: var(--el-fill-color-darker);
							color: var(--el-text-color-secondary);
							font-size: 25px;
						}
					}

					.message-video-cover {
						width: 260px;
						height: 160px;
						position: relative;

						.video-content {
							width: 100%;
							height: 100%;
							border-radius: 10px;
							overflow: hidden;
							background-color: var(--message-video-content-bg-color);
							cursor: pointer;

							img {
								width: 100%;
								height: 100%;
							}

							.video-icon {
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-50%, -50%);
							}
						}

						.progress {
							width: 240px;
							position: absolute;
							left: 10px;
							right: 10px;
							bottom: 7.5px;
						}
					}

					.message-file {
						width: 180px;
						height: 70px;
						background-color: var(--message-file-bg-color);
						color: var(--message-file-color);
						border-radius: 10px;
						padding: 10px;
						box-sizing: border-box;
						display: flex;
						align-items: center;
						cursor: pointer;
						position: relative;

						img {
							margin-right: 10px;
						}

						.message-file-info {
							width: 100%;
							height: 100%;
							display: flex;
							flex-direction: column;
							justify-content: space-evenly;

							.message-file-name {
								font-size: 15.5px;
								width: 110px;
								height: 16px;
								line-height: 16px;
								white-space: nowrap;
								overflow: hidden;
								text-overflow: ellipsis;
							}

							.message-file-size {
								font-size: 12px;
								color: #8c8c8c;
							}
						}

						.progress {
							width: 160px;
							position: absolute;
							left: 10px;
							right: 10px;
							bottom: 7.5px;
						}
					}

					.message-md {
						max-width: 55vw;
						border-radius: 10px;
						overflow: hidden;
					}

					.message-emoji {
						padding: 0 5px;
					}

					.friend {
						background-color: var(--message-friend-bg-color);
						color: var(--message-friend-color);
					}

					.my {
						background-color: var(--message-my-bg-color);
						color: var(--message-my-color);
					}
				}
			}

			.message-my {
				justify-content: flex-end;
			}
		}
	}
}
</style>
<style>
.md-editor-preview-wrapper {
	padding: 0px 15px !important;
}
</style>