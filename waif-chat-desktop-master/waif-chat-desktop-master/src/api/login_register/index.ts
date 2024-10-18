import request from "../requestWaiFChat"
import queryString from "query-string"
import type { UserInfoData, RegisterResponse, LoginResponse, CreateQRCodeResponse } from './type'

enum API {
    REGISTER_URL = '/register', // 注册接口
    LOGIN_URL = '/login', // 登录接口
    SCANCREATEQRCODE_URL = '/scan/create/code' // 生成二维码接口
}

// 注册接口
export const reqRegister = (userInfo: UserInfoData) => request<any, RegisterResponse>({url: API.REGISTER_URL, method: 'post', data: queryString.stringify(userInfo)})
// 登录接口
export const reqLogin = (userInfo: UserInfoData) => request<any, LoginResponse>({url: API.LOGIN_URL, method: 'post', data: queryString.stringify(userInfo)})
// 生成二维码接口
export const reqScanCreateQRCode = (uuid: string) => request<any, CreateQRCodeResponse>({url: API.SCANCREATEQRCODE_URL, method: 'get', params: { uuid }})