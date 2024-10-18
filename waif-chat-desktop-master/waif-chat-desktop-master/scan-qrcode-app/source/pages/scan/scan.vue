<template>
	<view class="container" :style="{paddingTop: navbarHeight + 'px'}">
		<!-- #ifdef MP -->
		<view class="navbar" :style="{height: navmenuHeight + 'px'}">
			<tui-icon @tap="back" name="arrowleft" :size="24" color="#c3c3c3"></tui-icon>
			<text>扫码登陆</text>
		</view>
		<!-- #endif -->
		<!-- #ifndef MP -->
		<view class="navbar" :style="{paddingBottom: '20rpx'}">
			<tui-icon @tap="back" name="arrowleft" :size="24" color="#c3c3c3"></tui-icon>
			<text>扫码登陆</text>
		</view>
		<!-- #endif -->
		<view class="scan-view">
			<view class="scan-border">
				<view class="scan-border-wrap">
					<view class="Bordertop">
						<view style="width: 44rpx;height: 10rpx;background-color: #567ee3;"></view>
						<view style="width: 44rpx;height: 10rpx;background-color:  #567ee3;"></view>
					</view>
					<view class="Borderright">
						<view style="width: 10rpx;height: 44rpx;background-color:  #567ee3;"></view>
						<view
							style="width:10rpx;height: 44rpx;background-color:  #567ee3;position: absolute;bottom: 0rpx;">
						</view>
					</view>
					<view class="Borderbottom">
						<view style="width: 44rpx;height: 10rpx;background-color:  #567ee3;"></view>
						<view style="width: 44rpx;height: 10rpx;background-color:  #567ee3;"></view>
					</view>
					<view class="Borderleft">
						<view style="width: 10rpx;height: 44rpx;background-color:  #567ee3;"></view>
						<view
							style="width: 10rpx;height: 44rpx;background-color:  #567ee3;position: absolute;bottom: 0rpx;">
						</view>
					</view>
					<camera ref="camerRef" class="scan-camera" @scancode="onScancode"
						@error="onError" mode="scanCode" device-position="back" flash="auto">
						<cover-view class="scan-animation" :animation="animationData"></cover-view>
					</camera>
				</view>
				<view class="scanText">将二维码放到取景框内，即可自动扫描</view>
			</view>
		</view>
	</view>
</template>

<script setup>
	import {
		ref,
		getCurrentInstance
	} from 'vue'
	import {
		onLoad,
		onShow,
		onUnload
	} from '@dcloudio/uni-app'
	const { proxy } = getCurrentInstance()

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

	const back = () => {
		uni.redirectTo({
			url: '/pages/index/index'
		})
	}

	onShow(() => {
		animation.value = uni.createAnimation({
			timingFunction: "linear",
			delay: 0
		});
		lineAnimation()
	})

	let animation = ref(null)
	let animationData = ref({})
	let scode = ref(true)
	let timer = ref(null)
	let camerRef = ref()

	// 扫码动画
	const lineAnimation = () => {
		timer.value = setInterval(() => {
			if (scode.value) {
				animation.value.translateY(250).step({
					duration: 1500,
				});
				scode.value = !scode.value;
			} else {
				animation.value.translateY(-10).step({
					duration: 1500,
				});
				scode.value = !scode.value;
			}
			animationData.value = animation.value.export();
		}, 1500);
	}

	onUnload(() => {
		clearInterval(timer.value)
	})
	
	let qrcodeContent = ref('')
	let isFlag = ref(true)

	// 扫码成功
	const onScancode = (e) => {
		if (!isFlag) return
		isFlag.value = false
		uni.vibrateShort()
		const { result } = e.detail
		qrcodeContent.value = result
		if (result && result.startsWith('waif_chat://')) {
			let userInfo = uni.getStorageSync('userInfo');
			const { _id, token } = userInfo
			proxy.socket.emit('scan_qrcode', {
				_id,
				token,
				code_info: result.replace(new RegExp('^' + 'waif_chat://'), '')
			})
		}
	}
	
	uni.$on('qrcode_status', (data) => {
		const { qrcode_status, uuid } = data
		if (qrcode_status === 1) {
			uni.navigateTo({
				url: `/pages/scan-result/scan-result?result=${qrcodeContent.value}&uuid=${uuid}`
			})
		} else if (qrcode_status === 3) {
			uni.showToast({
				title: '二维码过期'
			})
			uni.redirectTo({
				url: '/pages/index/index'
			})
		}
	})
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100vh;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #161616;

		text {
			color: #c3c3c3;
		}

		.navbar {
			display: flex;
			align-items: center;
			padding: 0 10px;
			box-sizing: border-box;
			font-weight: bold;
			font-size: 32rpx;
			margin-bottom: 15rpx;
			z-index: 99;
		}
	}

	.scan-view {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		position: fixed;
		align-items: center;
		justify-content: space-around;
	}

	.Bordertop {
		display: flex;
		justify-content: space-between;
		position: absolute;
		z-index: 99;
		width: 100%;
		top: -2rpx;
	}

	.Borderleft {
		left: -2rpx;
		z-index: 99;
		position: absolute;
		height: 100%;
	}

	.Borderright {
		z-index: 99;
		position: absolute;
		right: -2rpx;
		height: 100%;
	}

	.Borderbottom {
		display: flex;
		z-index: 99;
		justify-content: space-between;
		position: absolute;
		width: 100%;
		bottom: -2rpx;
	}

	.scan-border {
		width: 100%;
		height: 75%;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 150rpx;
		box-sizing: border-box;

		.scan-border-wrap {
			width: 500rpx;
			height: 500rpx;
			border: 1rpx solid #ccc;
			margin-bottom: 80rpx;
			position: relative;
		}

		.scan-camera {
			width: 100%;
			height: 100%;
			border-radius: 6rpx;
		}
	}

	.scan-animation {
		position: absolute;
		top: 4%;
		left: 2%;
		width: 480rpx;
		height: 2rpx;
		background-color: #567ee3;
		border-radius: 50%;
	}

	.scanText {
		position: absolute;
		bottom: 32%;
		color: #ebebeb;
	}
</style>