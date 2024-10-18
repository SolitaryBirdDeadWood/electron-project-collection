import axios from "axios"
import { baseUrl } from "./baseUrl"
import { ElMessage } from "element-plus"

const request = axios.create({
    baseURL: baseUrl,
    timeout: 10000
})

request.interceptors.request.use(config => {
    return config
})

request.interceptors.response.use(res => {
    return res.data
}, error => {
    ElMessage({
        type: 'error',
        message: '请求失败'
    })
})

export default request