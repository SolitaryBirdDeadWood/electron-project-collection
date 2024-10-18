<template>
	<view class="container" :style="{paddingTop: navbarHeight + 'px'}">
		<!-- #ifdef MP -->
		<view class="navbar" :style="{height: navmenuHeight + 'px'}">
			功能页面
		</view>
		<!-- #endif -->
		<!-- #ifndef MP -->
		<view class="navbar">
			功能页面
		</view>
		<!-- #endif -->
		<tui-list-view>
			<tui-list-cell>
				<view class="title">
					扫码登陆 🥰
				</view>
				<tui-button plain @tap="scan">点击扫码登陆PC端</tui-button>
			</tui-list-cell>
			<tui-list-cell>
				<view class="title">
					退出登陆 🌍
				</view>
				<tui-button plain @tap="logout">点击退出登陆</tui-button>
			</tui-list-cell>
		</tui-list-view>
	</view>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	import {
		onLoad
	} from '@dcloudio/uni-app'

	let navbarHeight = ref(0)
	let navmenuHeight = ref(0)

	onLoad(() => {
		let userInfo = uni.getStorageSync('userInfo')
		if (!userInfo.token) {
			return uni.reLaunch({
				url: '/pages/login/login'
			})
		}
		let system = uni.getSystemInfoSync(); // 获取设备信息
		let navbar = system.statusBarHeight;
		navbarHeight.value = navbar;

		// #ifdef MP
		// 获取胶囊按钮位置信息
		const menuButtonInfo = wx.getMenuButtonBoundingClientRect()
		// 胶囊按钮高度
		const menuHeight = menuButtonInfo.height + (menuButtonInfo.top - navbarHeight.value) * 2
		navmenuHeight.value = menuHeight
		// #endif
	})

	// 去扫码页面
	const scan = () => {
		// #ifdef MP
		uni.authorize({
			scope: 'scope.camera',
			success() {
				uni.reLaunch({
					url: '/pages/scan/scan'
				})
			},
			fail() {
				// 用户拒绝授权
				return uni.showToast({
					title: '您拒绝了授权',
					icon: 'none'
				});
			}
		});
		// #endif
		// #ifndef MP
		uni.reLaunch({
			url: '/pages/scan/scan'
		})
		// #endif
	}

	// 退出登陆
	const logout = () => {
		uni.removeStorageSync('userInfo')
		uni.reLaunch({
			url: '/pages/login/login'
		})
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;

		.navbar {
			display: flex;
			align-items: center;
			position: relative;
			padding: 0 30px;
			box-sizing: border-box;
			font-weight: bold;
			font-size: 32rpx;
			margin-bottom: 15rpx;

			&::after {
				content: '';
				position: absolute;
				top: 50%;
				left: 30rpx;
				transform: translateY(-50%);
				width: 6rpx;
				height: 60%;
				background-color: #567ee3;
			}
		}

		.title {
			margin-bottom: 15rpx;
		}
	}
</style>