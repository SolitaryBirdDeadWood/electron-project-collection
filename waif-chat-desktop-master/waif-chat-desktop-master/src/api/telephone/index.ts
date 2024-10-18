import request from "../requestWaiFChat"
import type { IsJoinTelephoneResponse, GetDetailsTelephoneResponse, CanJoinTelephoneResponse } from './type'

enum API {
    ISJOINTELEPHONE_URL = '/isjoin/telephone', // 判断该用户是否已经加入会议
    GETDETAILSTELEPHONE_URL = '/get/details/telephone', // 获取聊天详情页面是否有通话
    CANJOINTELEPHONE_URL = '/can/join/telephone' // 加入通话按钮判断是否可以加入通话
}

// 判断该用户是否已经加入会议接口
export const reqIsJoinTelephone = (userId: string, urlId: string) => request<any, IsJoinTelephoneResponse>({ url: API.ISJOINTELEPHONE_URL, method: 'get', params: { userId, urlId } })
// 获取聊天详情页面是否有通话接口
export const reqGetDetailsTelephone = (urlId: string, userId: string, chatType: string) => request<any, GetDetailsTelephoneResponse>({ url: API.GETDETAILSTELEPHONE_URL, method: 'get', params: { urlId, userId, chatType } })
// 加入通话按钮判断是否可以加入通话接口
export const reqCanJoinTelephone = (urlId: string, userId: string, chatType: string) => request<any, CanJoinTelephoneResponse>({ url: API.CANJOINTELEPHONE_URL, method: 'get', params: { urlId, userId, chatType } })