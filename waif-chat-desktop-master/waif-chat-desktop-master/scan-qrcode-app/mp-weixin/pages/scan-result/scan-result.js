"use strict";
const common_vendor = require("../../common/vendor.js");
const api_index = require("../../api/index.js");
const common_url = require("../../common/url.js");
if (!Array) {
  const _easycom_tui_button2 = common_vendor.resolveComponent("tui-button");
  _easycom_tui_button2();
}
const _easycom_tui_button = () => "../../node-modules/thorui-uni/lib/thorui/tui-button/tui-button.js";
if (!Math) {
  _easycom_tui_button();
}
const _sfc_main = {
  __name: "scan-result",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    let codeInfo = common_vendor.ref({});
    let qrcodeContent = common_vendor.ref("");
    let uuid = common_vendor.ref("");
    common_vendor.onLoad((option) => {
      let userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo.token) {
        return common_vendor.index.reLaunch({
          url: "/pages/login/login"
        });
      }
      if (!option.result && !option.uuid) {
        return common_vendor.index.redirectTo({
          url: "/pages/index/index"
        });
      }
      qrcodeContent.value = option.result;
      uuid.value = option.uuid;
      codeInfo.value = userInfo;
    });
    const loginDesktopApp = async () => {
      const { _id, token } = common_vendor.index.getStorageSync("userInfo");
      let data = {
        _id,
        token
      };
      let res = await api_index.reqLoginDesktopApp(data);
      if (res.status === 200) {
        proxy.socket.emit("confirm_qrcode", {
          userInfo: res.data,
          code_info: qrcodeContent.value.replace(new RegExp("^waif_chat://"), ""),
          uuid: uuid.value
        });
      } else {
        common_vendor.index.showToast({
          icon: "fail",
          title: res.msg
        });
      }
    };
    common_vendor.index.$on("qrcode_status", (data) => {
      const { qrcode_status } = data;
      if (qrcode_status === 2) {
        common_vendor.index.showToast({
          icon: "success",
          title: "登陆成功"
        });
        common_vendor.index.redirectTo({
          url: "/pages/index/index"
        });
      } else if (qrcode_status === 3) {
        common_vendor.index.showToast({
          icon: "error",
          title: "二维码过期"
        });
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(common_url.HTTP_URL) + common_vendor.unref(codeInfo).imgUrl,
        b: common_vendor.t(common_vendor.unref(codeInfo).nick),
        c: common_vendor.o(loginDesktopApp),
        d: common_vendor.p({
          shape: "circle"
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-66237ca0"]]);
wx.createPage(MiniProgramPage);
