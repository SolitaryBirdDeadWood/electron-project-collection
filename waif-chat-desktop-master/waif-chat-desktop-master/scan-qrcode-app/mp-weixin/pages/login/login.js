"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_index = require("../../api/index.js");
if (!Array) {
  const _easycom_uni_easyinput2 = common_vendor.resolveComponent("uni-easyinput");
  const _easycom_tui_button2 = common_vendor.resolveComponent("tui-button");
  const _easycom_tui_footer2 = common_vendor.resolveComponent("tui-footer");
  (_easycom_uni_easyinput2 + _easycom_tui_button2 + _easycom_tui_footer2)();
}
const _easycom_uni_easyinput = () => "../../node-modules/@dcloudio/uni-ui/lib/uni-easyinput/uni-easyinput.js";
const _easycom_tui_button = () => "../../node-modules/thorui-uni/lib/thorui/tui-button/tui-button.js";
const _easycom_tui_footer = () => "../../node-modules/thorui-uni/lib/thorui/tui-footer/tui-footer.js";
if (!Math) {
  (_easycom_uni_easyinput + _easycom_tui_button + _easycom_tui_footer)();
}
const _sfc_main = {
  __name: "login",
  setup(__props) {
    let navbarHeight = common_vendor.ref(0);
    common_vendor.onLoad(() => {
      let system = common_vendor.index.getSystemInfoSync();
      let navbar = system.statusBarHeight + 44;
      navbarHeight.value = navbar;
    });
    let userInfo = common_vendor.ref({
      phone: "",
      password: ""
    });
    const login = async () => {
      const { phone, password } = userInfo.value;
      if (!phone.trim()) {
        return common_vendor.index.showToast({
          title: "手机号不能为空",
          icon: "error"
        });
      }
      if (!password.trim()) {
        return common_vendor.index.showToast({
          title: "密码不能为空",
          icon: "error"
        });
      }
      common_vendor.index.showLoading();
      let res = await api_index.reqLogin(userInfo.value);
      common_vendor.index.hideLoading();
      if (res.status === 200) {
        common_vendor.index.showToast({
          title: "登陆成功",
          icon: "none",
          success: () => {
            setTimeout(() => {
              common_vendor.index.setStorageSync("userInfo", res.data);
              common_vendor.index.reLaunch({
                url: "/pages/index/index"
              });
            }, 1e3);
          }
        });
      }
    };
    const navigate = common_vendor.ref([{
      url: "https://gitee.com/wifi-skew-f/waif-chat-desktop",
      text: "歪fChat",
      color: "#5677fc"
    }]);
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.o(($event) => common_vendor.unref(userInfo).phone = $event),
        c: common_vendor.p({
          placeholder: "请输入手机号",
          modelValue: common_vendor.unref(userInfo).phone
        }),
        d: common_vendor.o(($event) => common_vendor.unref(userInfo).password = $event),
        e: common_vendor.p({
          placeholder: "请输入密码",
          modelValue: common_vendor.unref(userInfo).password
        }),
        f: common_vendor.o(login),
        g: common_vendor.p({
          height: "80rpx",
          shape: "circle"
        }),
        h: common_vendor.p({
          copyright: "Copyright © 2024 歪fChat",
          navigate: navigate.value
        }),
        i: common_vendor.unref(navbarHeight) + "px"
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
