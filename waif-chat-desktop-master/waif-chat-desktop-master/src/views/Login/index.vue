<template>
  <div class="bg">
    <!-- 可拖拽 -->
    <div class="drag"></div>
    <div class="container" v-loading="loading">
      <div class="left">
        <div class="title" v-html="text"></div>
        <div class="desc">关于<span @click="aboutWaiFChat">歪fCHat</span></div>
      </div>
      <div class="right" v-if="!isScanCode">
        <input type="text" class="inputs user" placeholder="请输入您的手机号" v-model="userInfo.phone" />
        <input type="password" class="inputs pwd" placeholder="请输入您的密码" v-model="userInfo.password" />
        <div class="tips">
          <div @click="changeLoginWay"><span>扫码登陆</span></div>
          <div>还没有账号?<span @click="register">去注册</span></div>
        </div>
        <button @click="login" class="login-btn">登录</button>
      </div>
      <div class="right RQ-code-content" v-else>
        <div class="RQ-title">扫码登陆</div>
        <div class="code-img-content">
          <el-image class="code-img" :src="QRCodeImg">
            <template #placeholder>
              <div class="image-slot">
                <el-icon class="loading-icon">
                  <Loading />
                </el-icon>
              </div>
            </template>
            <template #error>
              <div class="image-error-slot">
                <el-icon color="#f56c6c" size="60">
                  <CircleCloseFilled />
                </el-icon>
                <div class="image-error-text" @click="scanCreateQRCode">二维码加载失败(点击刷新)</div>
              </div>
            </template>
          </el-image>
          <div class="code-img-other-status" v-if="qrcodeStatus !== 0">
            <!-- 已扫，未确认 -->
            <div class="no-confirm" v-if="qrcodeStatus === 1">
              <div class="code-img-status-1">扫码成功，待登陆</div>
              <span @click="scanCreateQRCode">重新扫码</span>
            </div>
            <!-- 已确认 -->
            <div class="confirm" v-if="qrcodeStatus === 2">
              <div class="code-img-status-2">登陆成功，跳转中...</div>
            </div>
            <!-- 二维码过期 -->
            <div class="expired" v-if="qrcodeStatus === 3">
              <div class="code-img-status-3">二维码已过期，请重新扫码</div>
              <span @click="scanCreateQRCode">重新扫码</span>
            </div>
          </div>
        </div>
        <div class="RQ-tips">
          <div @click="changeLoginWay"><span>账号登陆</span></div>
          <div>还没有账号?<span @click="register">去注册</span></div>
        </div>
      </div>
    </div>
    <WindowsBtn v-if="!proxy.isMac && $route.path !== '/notes'" :color="'#4F4F4F'" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, getCurrentInstance, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { CircleCloseFilled, Loading } from '@element-plus/icons-vue'
// 引入api接口
import { reqLogin, reqScanCreateQRCode } from '@/api/login_register/index'
// 引入ts类型
import type { LoginResponse, UserInfoData } from '@/api/login_register/type'
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/store/modules/user'
import $bus from '@/utils/eventBus'
import { QrcodeStatusData } from '@/socket/listen-socket'
const { ipcRenderer } = require('electron')
const $router = useRouter()
const userInfoStore = useUserInfoStore()
const { proxy } = getCurrentInstance() as any

// const HELLOWORLD = 'WELCOME TO\nILOVEFCHAT'
const HELLOWORLD = 'WELCOME TO\nWIFICHAT'

onMounted(() => {
  print(HELLOWORLD)
})

let text = ref<string>('')
// 打印机效果
const print = async (printInfo: string) => {
  let printText = printInfo
  for (let i = 0; i < printText.length; i++) {
    let str = printText.slice(i, i + 1)
    if (str === '\n') {
      text.value = text.value + '<br>'
    } else {
      await new Promise((resolve) => {
        setTimeout(() => {
          text.value = text.value + str
          resolve(null)
        }, 80)
      })
    }
  }
  text.value = text.value
}

// 关于歪fChat回调
const aboutWaiFChat = () => {
  ipcRenderer.send('open-about')
}

// 用户表单信息
let userInfo = ref<UserInfoData>({
  phone: '',
  password: ''
})

const loading = ref<boolean>(false)

// 登录按钮
const login = async () => {
  const { phone, password } = userInfo.value
  const phoneNumberRegex: RegExp = /^1[3456789]\d{9}$/
  if (!phoneNumberRegex.test(phone)) {
    return ElMessage({
      type: 'warning',
      message: '请输入正确手机号'
    })
  } else if (!password) {
    return ElMessage({
      type: 'warning',
      message: '密码不能为空'
    })
  }
  loading.value = true
  let res: LoginResponse = await reqLogin(userInfo.value)
  if (res.status === 200) {
    // 存本地
    localStorage.setItem('userInfo', JSON.stringify(res.data))
    // 存pinia
    userInfoStore.login(res.data)
    ElMessage({
      type: 'success',
      message: res.msg
    })
    $router.push('/message')
  } else {
    ElMessage({
      type: 'error',
      message: res.msg
    })
  }
  loading.value = false
}

// 注册按钮
const register = () => {
  $router.push('/register')
}

// 是否是扫码登陆
let isScanCode = ref<boolean>(false)

// 切换登录方式回调
const changeLoginWay = () => {
  isScanCode.value = !isScanCode.value
}

let QRCodeImg = ref<string>('./images/qrcode.png')

// 获取生成的二维码
const scanCreateQRCode = async () => {
  let uuid = proxy.uuid
  let res = await reqScanCreateQRCode(uuid)
  if (res.status === 200) {
    res.url && (QRCodeImg.value = res.url)
    // 二维码生成成功
    proxy.socket.emit('create_qrcode', {
      uuid,
      socketId: proxy.socket.id
    })
  }
}

watch(() => isScanCode.value, () => {
  if (isScanCode.value) {
    scanCreateQRCode()
  }
})

// 二维码状态
let qrcodeStatus = ref<number>(0)

// 监听二维码状态
$bus.on('qrcode_status', (data) => {
  const { qrcode_status, userInfo } = data as QrcodeStatusData
  // 变换二维码状态
  qrcodeStatus.value = qrcode_status
  if (userInfo && qrcode_status === 2) {
    // 扫码成功
    // 存本地
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    // 存pinia
    userInfoStore.login(userInfo)
    // return
    $router.push('/message')
  }
})
</script>

<style scoped lang="scss">
.drag {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  user-select: none;
  -webkit-app-region: drag;
}

.loading-icon {
  margin-left: 2px;
  animation: spin 1s infinite linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@font-face {
  font-family: 'Regular';
  font-weight: 400;
  src: url('../../assets/iconfont/login_register.woff2') format('woff2'),
    url('../../assets/iconfont/login_register.woff') format('woff');
  font-display: swap;
}

.bg {
  width: 100vw;
  height: 100vh;
  background-color: var(--login-bg-color);
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  width: 1000px;
  height: 600px;
  display: flex;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  left: 50%;

  .left {
    width: 100%;
    height: 100%;
    flex: 16;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 20% 0;
    box-sizing: border-box;

    &::before {
      content: '';
      position: absolute;
      top: 40%;
      left: 30%;
      width: 280px;
      height: 100px;
      background: linear-gradient(to right,
          var(--primary-color),
          #c471ed,
          #f64f59);
      filter: blur(70px);
      transition: all 0.5s;
    }

    &:has(.desc:hover) {
      &::before {
        filter: blur(55px);
      }
    }

    .title {
      width: 100%;
      height: 120px;
      line-height: 60px;
      font-size: 40px;
      font-weight: bold;
      font-family: Regular;
      padding-left: 25%;
      box-sizing: border-box;
      color: var(--login-text-color);
      z-index: 2;
    }

    .desc {
      font-size: 15px;
      font-weight: bold;
      padding-left: 45%;
      margin-top: 10px;
      color: var(--login-about-color);
      cursor: pointer;
      z-index: 2;

      span {
        color: #5140f0;
        text-decoration: underline;
      }
    }
  }

  .right {
    flex: 18;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .inputs {
      display: block;
      width: 290px;
      height: 55px;
      border-radius: 10px;
      border: 0;
      background-color: var(--login-input-bg-color);
      color: var(--login-input-text-color);
      outline: none;
      padding: 20px;
      box-sizing: border-box;
      font-size: 15px;

      &::-webkit-input-placeholder {
        font-size: 13.5px;
      }
    }

    .user {
      margin-bottom: 25px;
    }

    .tips {
      width: 290px;
      text-align: right;
      margin-top: 10px;
      color: var(--login-tips-color);
      font-size: 13px;
      display: flex;
      justify-content: space-between;

      span {
        color: rgb(68, 96, 241);
        cursor: pointer;
      }
    }

    button {
      width: 290px;
      height: 50px;
      background-color: var(--primary-color);
      border-radius: 10px;
      font-size: 15px;
      color: var(--login-button-text-color);
      border: 0;
      font-weight: 600;
      margin: 30px 0;
      cursor: pointer;
      box-shadow: var(--primary-color) 0 20px 30px -10px;
      transition: box-shadow 0.3s;

      &:hover {
        box-shadow: var(--primary-color) 0 10px 30px -10px;
      }
    }
  }

  .RQ-code-content {
    padding-bottom: 30px;

    .RQ-title {
      font-size: 18px;
      color: var(--login-about-color);
      font-weight: bold;
      margin-bottom: 15px;
    }

    .code-img-content {
      width: 200px;
      height: 200px;
      margin-bottom: 5px;
      border: 5px solid #4460f1;
      box-sizing: content-box;
      border-radius: 15px;
      overflow: hidden;
      position: relative;

      .code-img {
        width: 100%;
        height: 100%;
        border-radius: 10px;

        .image-slot {
          width: 100%;
          height: 100%;
          background-color: var(--login-bg-color);
          color: var(--login-text-color);
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
        }

        .image-error-slot {
          width: 100%;
          height: 100%;
          background-color: var(--login-bg-color);
          color: var(--login-text-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 20px;
          cursor: pointer;

          .image-error-text {
            font-size: 14px;
          }
        }
      }

      .code-img-other-status {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background-color: var(--qrcode-other-status-bg-color);
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--login-text-color);

        .no-confirm,
        .confirm,
        .expired {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;

          span {
            font-size: 13px;
            color: rgb(68, 96, 241);
            cursor: pointer;
          }
        }
      }
    }

    .RQ-tips {
      width: 200px;
      text-align: right;
      margin-top: 10px;
      color: var(--login-tips-color);
      font-size: 13px;
      display: flex;
      justify-content: space-between;

      span {
        color: rgb(68, 96, 241);
        cursor: pointer;
      }
    }
  }
}
</style>
