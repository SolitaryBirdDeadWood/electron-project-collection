<template>
	<view class="container" :style="{paddingTop: navbarHeight + 'px'}">
		<view class="header">
			<view class="title">登陆</view>
			<view class="desc">欢迎来到歪fChat</view>
		</view>
		<view class="main">
			<view class="login-pic">
				<image src="../../static/login.png" mode="aspectFit"></image>
			</view>
			<view class="title">密码登陆</view>
			<view class="form">
				<uni-easyinput v-model="userInfo.phone" placeholder="请输入手机号"></uni-easyinput>
				<uni-easyinput v-model="userInfo.password" placeholder="请输入密码"></uni-easyinput>
				<tui-button height="80rpx" shape="circle" @tap="login">登陆</tui-button>
			</view>
		</view>
		<tui-footer copyright="Copyright © 2024 歪fChat" :navigate="navigate"></tui-footer>
	</view>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { reqLogin } from '../../api/index.js'
const { proxy } = getCurrentInstance()

let navbarHeight = ref(0)

onLoad(() => {
	let system = uni.getSystemInfoSync(); // 获取设备信息
	let navbar = system.statusBarHeight + 44;
	navbarHeight.value = navbar;
})

let userInfo = ref({
	phone: '',
	password: ''
})

const login = async () => {
	const { phone, password } = userInfo.value
	if (!phone.trim()) {
		return uni.showToast({
			title: '手机号不能为空',
			icon: 'error'
		})
	}
	if (!password.trim()) {
		return uni.showToast({
			title: '密码不能为空',
			icon: 'error'
		})
	}
	uni.showLoading()
	let res = await reqLogin(userInfo.value)
	uni.hideLoading()
	if (res.status === 200) {
		uni.showToast({
			title: '登陆成功',
			icon: 'none',
			success: () => {
				setTimeout(() => {
					uni.setStorageSync('userInfo', res.data);
					uni.reLaunch({
						url: '/pages/index/index'
					})
				}, 1000)
			}
		})
	}
}

const navigate = ref([{
	url: 'https://gitee.com/wifi-skew-f/waif-chat-desktop',
	text: "歪fChat",
	color: "#5677fc"
}])
</script>

<style lang="scss" scoped>
.container {
	width: 100%;
	height: 100vh;
	background-color: #567ee3;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	.header {
		width: 100%;
		height: 350rpx;
		background-color: #567ee3;
		padding: 0 40rpx;
		box-sizing: border-box;
		color: #ffffff;
		.title {
			font-size: 40rpx;
			font-weight: bold;
			margin-bottom: 15rpx;
		}
		.desc {
			font-size: 28rpx;
		}
	}
	.main {
		width: 100%;
		flex: 1;
		background-color: #ffffff;
		border-radius: 70rpx 70rpx 0 0;
		position: relative;
		padding: 150rpx 30rpx 0;
		box-sizing: border-box;
		.login-pic {
			position: absolute;
			width: 350rpx;
			height: 300rpx;
			left: 50%;
			top: 0;
			transform: translateX(-50%) translateY(-50%);
			image {
				width: 100%;
				height: 100%;
			}
		}
		
		.title {
			color: #567ee3;
			font-weight: bold;
			padding: 30rpx 20rpx 0;
		}
		
		.form {
			width: 100%;
			margin-top: 10rpx;
			padding: 15rpx;
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			gap: 30rpx;
		}
	}
}
</style>
