import { defineStore } from "pinia";
// 引入用户信息的ts类型
import type { TelephoneStoreType } from './interface/telephoneType'
// pinia
import { useUserInfoStore } from "@/store/modules/user"
// router
import router from '@/router'
// api
import { reqGetDetailsTelephone } from '@/api/telephone/index'
import type { GetDetailsTelephoneResponse } from '@/api/telephone/type'
const userInfoStore = useUserInfoStore()
const $route = router.currentRoute

export const useTelephoneStore = defineStore('telephoneStore', {
    state: (): TelephoneStoreType => {
        return {
            fId: '', // 发起方id
            toId: '', // 接听方id(聊天类型为私聊: toId为好友id; 为群聊: toId为群id)
            chatType: '', // 聊天类型(群聊group/私聊friend)
            type: '', // 通话类型
            messageDetailsTelephoneInfo: {
                show: false, // 消息详情页是否展示通话提示
                urlId: '', // 群id/好友id
                userId: '', // 发起通话的用户id
                nick: '', // 发起通话的用户昵称
                type: '' // 通话类型
            }
        }
    },
    actions: {
        // 设置将正在通话的房间信息
        setTelephoneInfo(data: TelephoneStoreType) {
            const { fId, toId, chatType, type } = data
            this.fId = fId
            this.toId = toId
            this.chatType = chatType
            this.type = type
            if (fId === userInfoStore.userInfo._id && $route.value.query.id === toId) {
                this.messageDetailsTelephoneInfo = {
                    show: true,
                    urlId: toId,
                    userId: userInfoStore.userInfo._id,
                    nick: userInfoStore.userInfo.nick,
                    type: type
                }
            }
        },
        // 设置聊天详情页面通话信息
        async setMessageDetailsTelephoneInfo(urlId: string, chatType: string) {
            let userId = userInfoStore.userInfo._id
            let res: GetDetailsTelephoneResponse = await reqGetDetailsTelephone(urlId, userId, chatType)
            if (res.status === 200 && res.data.info) {
                const { status, info } = res.data
                this.messageDetailsTelephoneInfo!.show = status
                this.messageDetailsTelephoneInfo!.urlId = info!.toId
                this.messageDetailsTelephoneInfo!.userId = info!.fId
                this.messageDetailsTelephoneInfo!.nick = info!.userId.nick
                this.messageDetailsTelephoneInfo!.type = info!.type
            } else {
                this.messageDetailsTelephoneInfo = {
                    show: false,
                    urlId: '',
                    userId: '',
                    nick: '',
                    type: ''
                }
            }
        },
        // 清除消息详情页通话信息
        clearMessageDetailsTelephoneInfo() {
            this.messageDetailsTelephoneInfo = {
                show: false,
                urlId: '',
                userId: '',
                nick: '',
                type: ''
            }
        }
    }
})