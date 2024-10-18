"use strict";
const api_request = require("./request.js");
const common_url = require("../common/url.js");
const reqLogin = ({
  phone,
  password
}) => api_request.request({
  url: common_url.HTTP_URL + "/login",
  method: "POST",
  data: {
    phone,
    password
  }
});
const reqLoginDesktopApp = ({
  _id,
  token,
  qrcode_id,
  qrcode_token
}) => api_request.request({
  url: common_url.HTTP_URL + "/scan/mobile/login",
  method: "POST",
  data: {
    _id,
    token,
    qrcode_id,
    qrcode_token
  }
});
exports.reqLogin = reqLogin;
exports.reqLoginDesktopApp = reqLoginDesktopApp;
