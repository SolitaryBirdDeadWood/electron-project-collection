"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Array) {
  const _easycom_tui_button2 = common_vendor.resolveComponent("tui-button");
  const _easycom_tui_list_cell2 = common_vendor.resolveComponent("tui-list-cell");
  const _easycom_tui_list_view2 = common_vendor.resolveComponent("tui-list-view");
  (_easycom_tui_button2 + _easycom_tui_list_cell2 + _easycom_tui_list_view2)();
}
const _easycom_tui_button = () => "../../node-modules/thorui-uni/lib/thorui/tui-button/tui-button.js";
const _easycom_tui_list_cell = () => "../../node-modules/thorui-uni/lib/thorui/tui-list-cell/tui-list-cell.js";
const _easycom_tui_list_view = () => "../../node-modules/thorui-uni/lib/thorui/tui-list-view/tui-list-view.js";
if (!Math) {
  (_easycom_tui_button + _easycom_tui_list_cell + _easycom_tui_list_view)();
}
const _sfc_main = {
  __name: "index",
  setup(__props) {
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
    const scan = () => {
      common_vendor.index.authorize({
        scope: "scope.camera",
        success() {
          common_vendor.index.reLaunch({
            url: "/pages/scan/scan"
          });
        },
        fail() {
          return common_vendor.index.showToast({
            title: "您拒绝了授权",
            icon: "none"
          });
        }
      });
    };
    const logout = () => {
      common_vendor.index.removeStorageSync("userInfo");
      common_vendor.index.reLaunch({
        url: "/pages/login/login"
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(navmenuHeight) + "px",
        b: common_vendor.o(scan),
        c: common_vendor.p({
          plain: true
        }),
        d: common_vendor.o(logout),
        e: common_vendor.p({
          plain: true
        }),
        f: common_vendor.unref(navbarHeight) + "px"
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
