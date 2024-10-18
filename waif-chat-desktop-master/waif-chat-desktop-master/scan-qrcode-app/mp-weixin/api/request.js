"use strict";
const common_vendor = require("../common/vendor.js");
const request = (options) => {
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      ...options,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      timeout: 1e4,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          common_vendor.index.showToast({
            icon: "error",
            title: "网络错误"
          });
          reject(res);
        }
      },
      fail: (err) => {
        common_vendor.index.showToast({
          icon: "error",
          title: "网络错误"
        });
        reject(err);
      }
    });
  });
};
exports.request = request;
