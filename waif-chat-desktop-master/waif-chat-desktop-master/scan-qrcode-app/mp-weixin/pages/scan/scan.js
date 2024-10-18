"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_tui_icon2 = common_vendor.resolveComponent("tui-icon");
  _easycom_tui_icon2();
}
const _easycom_tui_icon = () => "../../node-modules/thorui-uni/lib/thorui/tui-icon/tui-icon.js";
if (!Math) {
  _easycom_tui_icon();
}
const _sfc_main = {
  __name: "scan",
  setup(__props) {
    const { proxy } = common_vendor.getCurrentInstance();
    let navbarHeight = common_vendor.ref(0);
    let navmenuHeight = common_vendor.ref(0);
    common_vendor.onLoad(() => {
      let userInfo = common_vendor.index.getStorageSync("userInfo");
      if (!userInfo.token) {
        return common_vendor.index.reLaunch({
          url: "/pages/login/login"
        });
      }
      let system = common_vendor.index.getSystemInfoSync();
      let navbar = system.statusBarHeight;
      navbarHeight.value = navbar;
      const menuButtonInfo = common_vendor.wx$1.getMenuButtonBoundingClientRect();
      const menuHeight = menuButtonInfo.height + (menuButtonInfo.top - navbarHeight.value) * 2;
      navmenuHeight.value = menuHeight;
    });
    const back = () => {
      common_vendor.index.redirectTo({
        url: "/pages/index/index"
      });
    };
    common_vendor.onShow(() => {
      animation.value = common_vendor.index.createAnimation({
        timingFunction: "linear",
        delay: 0
      });
      lineAnimation();
    });
    let animation = common_vendor.ref(null);
    let animationData = common_vendor.ref({});
    let scode = common_vendor.ref(true);
    let timer = common_vendor.ref(null);
    common_vendor.ref();
    const lineAnimation = () => {
      timer.value = setInterval(() => {
        if (scode.value) {
          animation.value.translateY(250).step({
            duration: 1500
          });
          scode.value = !scode.value;
        } else {
          animation.value.translateY(-10).step({
            duration: 1500
          });
          scode.value = !scode.value;
        }
        animationData.value = animation.value.export();
      }, 1500);
    };
    common_vendor.onUnload(() => {
      clearInterval(timer.value);
    });
    let qrcodeContent = common_vendor.ref("");
    let isFlag = common_vendor.ref(true);
    const onScancode = (e) => {
      if (!isFlag)
        return;
      isFlag.value = false;
      common_vendor.index.vibrateShort();
      const { result } = e.detail;
      qrcodeContent.value = result;
      if (result && result.startsWith("waif_chat://")) {
        let userInfo = common_vendor.index.getStorageSync("userInfo");
        const { _id, token } = userInfo;
        proxy.socket.emit("scan_qrcode", {
          _id,
          token,
          code_info: result.replace(new RegExp("^waif_chat://"), "")
        });
      }
    };
    common_vendor.index.$on("qrcode_status", (data) => {
      const { qrcode_status, uuid } = data;
      if (qrcode_status === 1) {
        common_vendor.index.navigateTo({
          url: `/pages/scan-result/scan-result?result=${qrcodeContent.value}&uuid=${uuid}`
        });
      } else if (qrcode_status === 3) {
        common_vendor.index.showToast({
          title: "二维码过期"
        });
        common_vendor.index.redirectTo({
          url: "/pages/index/index"
        });
      }
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(back),
        b: common_vendor.p({
          name: "arrowleft",
          size: 24,
          color: "#c3c3c3"
        }),
        c: common_vendor.unref(navmenuHeight) + "px",
        d: common_vendor.unref(animationData),
        e: common_vendor.o(onScancode),
        f: common_vendor.o((...args) => _ctx.onError && _ctx.onError(...args)),
        g: common_vendor.unref(navbarHeight) + "px"
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-344f468c"]]);
wx.createPage(MiniProgramPage);
