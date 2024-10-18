import request from './request.js'
import {
	HTTP_URL
} from '../common/url.js'

// 登陆移动端接口
export const reqLogin = ({
	phone,
	password
}) => request({
	url: HTTP_URL + '/login',
	method: 'POST',
	data: {
		phone,
		password
	}
})
// 确认登陆桌面端接口
/**
 * @param {
		_id 自己的userId
		token 自己的token
		qrcode_id 二维码中携带的id
		qrcode_token 二维码中携带的token
	}
 * @return {Promise}
 */
export const reqLoginDesktopApp = ({
	_id,
	token,
	qrcode_id,
	qrcode_token
}) => request({
	url: HTTP_URL + '/scan/mobile/login',
	method: 'POST',
	data: {
		_id,
		token,
		qrcode_id,
		qrcode_token
	}
})