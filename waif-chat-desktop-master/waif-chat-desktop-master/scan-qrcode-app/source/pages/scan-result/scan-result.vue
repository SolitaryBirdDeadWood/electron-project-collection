<template>
	<view class="container">
		<view class="user-pic">
			<image :src="HTTP_URL + codeInfo.imgUrl" mode=""></image>
		</view>
 		<view class="user-nick">
			{{ codeInfo.nick }}
		</view>
		<view class="tips">
			扫码成功，点击“确认登陆”按钮，登陆<text>歪fChat桌面端</text>～
		</view>
		<view class="login-btn">
			<tui-button shape="circle" @tap="loginDesktopApp">确认登陆</tui-button>
		</view>
	</view>
</template>

<script setup>
	import { onLoad } from '@dcloudio/uni-app'
	import { ref, getCurrentInstance } from 'vue';
	import { reqLoginDesktopApp } from '../../api/index.js'
	import { HTTP_URL } from '../../common/url.js'
	const { proxy } = getCurrentInstance()

	let codeInfo = ref({})
	let qrcodeContent = ref('')
	let uuid = ref('')

	onLoad((option) => {
		let userInfo = uni.getStorageSync('userInfo')
		if (!userInfo.token) {
			return uni.reLaunch({
				url: '/pages/login/login'
			})
		}
		if (!option.result && !option.uuid) {
			return uni.redirectTo({
				url: '/pages/index/index'
			})
		}
		qrcodeContent.value = option.result
		uuid.value = option.uuid
		codeInfo.value = userInfo
	})

	// 确认登陆桌面端软件
	const loginDesktopApp = async () => {
		const { _id, token } = uni.getStorageSync('userInfo')
		let data = {
			_id,
			token
		}
		let res = await reqLoginDesktopApp(data)
		if (res.status === 200) {
			proxy.socket.emit('confirm_qrcode', {
				userInfo: res.data,
				code_info: qrcodeContent.value.replace(new RegExp('^' + 'waif_chat://'), ''),
				uuid: uuid.value
			})
		} else {
			uni.showToast({
				icon: 'fail',
				title: res.msg
			})
		}
	}
	
	uni.$on('qrcode_status', (data) => {
		const { qrcode_status } = data
		if (qrcode_status === 2) {
			uni.showToast({
				icon: 'success',
				title: '登陆成功'
			})
			uni.redirectTo({
				url: '/pages/index/index'
			})
		} else if (qrcode_status === 3) {
			uni.showToast({
				icon: 'error',
				title: '二维码过期'
			})
		}
	})
</script>

<style scoped lang="scss">
	.container {
		width: 100%;
		height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 200rpx;
		box-sizing: border-box;

		.user-pic {
			width: 200rpx;
			height: 200rpx;
			border-radius: 50%;
			overflow: hidden;
			border: 5rpx solid #567ee3;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.user-nick {
			font-weight: bold;
			margin-top: 40rpx;
		}

		.tips {
			color: #929292;
			font-size: 26rpx;
			margin-top: 150rpx;

			text {
				color: #567ee3;
			}
		}

		.login-btn {
			width: 300rpx;
			margin-top: 20rpx;
		}
	}
</style>