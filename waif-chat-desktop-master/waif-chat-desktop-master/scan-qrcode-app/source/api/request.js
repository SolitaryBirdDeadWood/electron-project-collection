const request = (options) => {
	return new Promise((resolve, reject) => {
		uni.request({
			...options,
			header: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			timeout: 10000,
			success: (res) => {
				if (res.statusCode === 200) {
					resolve(res.data)
				} else {
					uni.showToast({
						icon: "error",
						title: '网络错误'
					})
					reject(res)
				}
			},
			fail: (err) => {
				uni.showToast({
					icon: "error",
					title: '网络错误'
				})
				reject(err)
			}
		});
	})
}

export default request