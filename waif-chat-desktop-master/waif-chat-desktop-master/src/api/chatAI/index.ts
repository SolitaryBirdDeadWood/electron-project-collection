import request from "../requestWaiFChat"
import queryString from 'query-string'
import type { CreateRole, CreateRoleResponseData, GetRoleListResponseData, UpdateRole, GetHistoryListResponseData, GetTalkDetailResponseData } from './type'

enum API {
    CHATAI_URL = '/ai/chatAI', // gpt接口
    GETROLELIST_URL = '/ai/get/role/list', // 获取角色列表接口
    CREATEROLE_URL = '/ai/create/role', // 创建角色接口
    UPDATEROLE_URL = '/ai/update/role', // 修改角色接口
    DELETEROLE_URL = '/ai/delete/role', // 删除角色接口
    GETHISTORYLIST_URL = '/ai/get/history/list', // 获取历史记录列表接口,
    GETTALKDETAIL_URL = '/ai/get/talk/detail', // 获取对话详情数据接口
    DELETETALK_URL = '/ai/delete/talk', // 删除对话记录接口
}

// gpt接口
export const chatAI_Url = import.meta.env.VITE_APP_API_BASE_URL + API.CHATAI_URL
// 获取角色列表接口
export const reqGetRoleList = (userId: string) => request<any, GetRoleListResponseData>({ url: API.GETROLELIST_URL, method: 'get', params: { userId } })
// 创建角色接口
export const reqCreateRole = (data: CreateRole) => request<any, CreateRoleResponseData>({ url: API.CREATEROLE_URL, method: 'post', data: queryString.stringify(data) })
// 修改角色接口
export const reqUpdateRole = (data: UpdateRole) => request<any, CreateRoleResponseData>({ url: API.UPDATEROLE_URL, method: 'post', data: queryString.stringify(data) })
// 删除角色接口
export const reqDeleteRole = (_id: string) => request<any, CreateRoleResponseData>({ url: API.DELETEROLE_URL, method: 'get', params: { _id } })
// 获取历史记录列表接口
export const reqGetHistoryList = (userId: string) => request<any, GetHistoryListResponseData>({ url: API.GETHISTORYLIST_URL, method: 'get', params: { userId } })
// 获取对话详情数据接口
export const reqGetTalkDetail = (userId: string, _id: string) => request<any, GetTalkDetailResponseData>({ url: API.GETTALKDETAIL_URL, method: 'get', params: { userId, _id } })
// 删除对话记录接口
export const reqDeleteTalk = (userId: string, _id: string) => request<any, CreateRoleResponseData>({ url: API.DELETETALK_URL, method: 'get', params: { userId, _id } })