<template>
  <div class="layout-content">
    <!-- 左侧边栏 -->
    <aside class="left-aside drag">
      <LeftAside />
    </aside>
    <!-- 路由 -->
    <RouterView />
    <!-- windows系统按钮 -->
    <WindowsBtn v-if="!proxy.isMac && $route.path !== '/notes'" :color="'#4F4F4F'" />
  </div>
  <!-- 电话消息提示信息 -->
  <div class="telephone-notice-content" v-if="isShowTelephoneNotice">
    <div class="telephone-notice-info">
      <div class="telephone-notice-pic">
        <img :src="proxy.$baseUrl + telephoneNoticeUserInfo.imgUrl" alt="">
      </div>
      <div class="telephone-notice-text">{{ telephoneNoticeUserInfo.name }} 邀请你加入{{ telephoneNoticeTypeText }}</div>
    </div>
    <div class="telephone-notice-btn">
      <el-button style="flex: 1;" type="primary" text bg @click="joinTelephone">加入</el-button>
      <el-button style="flex: 1;" type="danger" plain @click="refuseTelephone">稍后</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import LeftAside from '@/components/LeftAside/index.vue'
import { getCurrentInstance, ref, onMounted, computed } from "vue"
import { ElMessage } from 'element-plus'
// 全局事件总线
import $bus from "@/utils/eventBus"
// api
import { reqCanJoinTelephone } from '@/api/telephone/index'
import type { CanJoinTelephoneResponse } from '@/api/telephone/type'
// router
import { useRoute } from "vue-router"
// pinia
import { useUserInfoStore } from "@/store/modules/user"
import { useMessageStore } from '@/store/modules/message'
import { useTelephoneStore } from '@/store/modules/telephone'
// 发送通话消息
import handleBusMessage from '@/utils/busTelephoneMessage'
const { ipcRenderer } = require('electron')
// router
const $route = useRoute()
// pinia
const userInfoStore = useUserInfoStore()
const messageStore = useMessageStore()
const telephoneStore = useTelephoneStore()
// baseUrl
const { proxy } = getCurrentInstance() as any

// 用户登陆连接
proxy.socket.emit('login', userInfoStore.userInfo._id)

// 关闭选择共享屏幕的窗口(确定按钮)
ipcRenderer.on('confirm-screen-choose', () => {
  handleBusMessage('screen')
})

onMounted(() => {
  // 获取加入的所有群聊信息
  messageStore.getAllGroup()
  if ($route.path !== '/message') {
    messageStore.getMessageList()
  }
})

// 控制弹窗显示隐藏
let isShowTelephoneNotice = ref<boolean>(false)
// 弹窗信息
type NoticeInfo = {
  name?: string;
  imgUrl?: string;
}
let telephoneNoticeUserInfo = ref<NoticeInfo>({})
// 通话类型
let telephoneNoticeType = ref<string>('')

type NoticeTelephoneData = {
  fId: string; // 用户id
  toId: string // urlid（好友id/群id）
  chatType: string; // 聊天类型(群聊group/私聊friend)
  type: string // 通话类型
}

// 在 listen_socket.ts中监听到telephone事件后，会调用此函数
$bus.on('telephone', (data) => {
  isShowTelephoneNotice.value = true
  telephoneNoticeType.value = (data as NoticeTelephoneData).type
  telephoneStore.setTelephoneInfo(data as NoticeTelephoneData)
  // 弹框用户/群信息
  let currentIndex = messageStore.messageList.findIndex((item) => {
    let id = (data as NoticeTelephoneData).chatType === 'friend' ? (data as NoticeTelephoneData).fId : (data as NoticeTelephoneData).toId
    return item._id === id
  })
  let itemInfo = messageStore.messageList[currentIndex]
  let info = {
    imgUrl: itemInfo.imgUrl
  }
  if ((data as NoticeTelephoneData).chatType === 'friend') {
    Object.assign(info, { name: itemInfo.nick })
  } else {
    Object.assign(info, { name: itemInfo.groupName })
  }
  telephoneNoticeUserInfo.value = info
})

// 通话消息提示的文字
const telephoneNoticeTypeText = computed(() => {
  let type = telephoneNoticeType.value
  if (type === 'screen') {
    return '屏幕共享'
  } else if (type === 'audio') {
    return '语音通话'
  } else if (type === 'video') {
    return '视频通话'
  }
})

// 同意加入通话
const joinTelephone = async () => {
  // 接收方
  const { chatType, toId } = telephoneStore
  let urlId = toId
  let userId = userInfoStore.userInfo._id
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
  isShowTelephoneNotice.value = false
}

// 拒绝加入通话
const refuseTelephone = () => {
  isShowTelephoneNotice.value = false
}
</script>

<style scoped lang="scss">
.layout-content {
  width: 100vw;
  height: 100vh;
  display: flex;

  .left-aside {
    width: 70px;
    height: 100%;
    background-color: var(--aside-bg-color);
    box-sizing: border-box;
    padding: 50px 0 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.telephone-notice-content {
  width: 260px;
  background-color: var(--telephone-notice-content-bg-color);
  position: fixed;
  right: 10px;
  top: 10px;
  z-index: 100000;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, .12);
  padding: 10px;
  box-sizing: border-box;

  .telephone-notice-info {
    width: 100%;
    display: flex;
    align-items: center;

    .telephone-notice-pic {
      width: 40px;
      height: 40px;
      border-radius: 5px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .telephone-notice-text {
      flex: 1;
      margin-left: 10px;
      font-size: 13px;
      line-height: 20px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .telephone-notice-btn {
    margin-top: 10px;
    display: flex;
  }
}
</style>
<style>
.el-popper.is-light {
  padding: 0 !important;
}

.el-select-dropdown {
  position: absolute !important;
  left: 0px !important;
  top: 0px !important;
  background-color: var(--el-select-dropdown-bg-color) !important;
}

.el-picker__popper {
  width: 100% !important;
  position: absolute !important;
  left: 200px !important;
  top: -100px !important;
  background-color: var(--el-picker-popper-bg-color) !important;
}

.el-popper__arrow {
  display: none !important;
}
</style>