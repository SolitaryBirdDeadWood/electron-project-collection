"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const socket_index = require("./socket/index.js");
require("./socket/socket-listen.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/login/login.js";
  "./pages/scan/scan.js";
  "./pages/scan-result/scan-result.js";
}
const _sfc_main = {
  onLaunch: function() {
  },
  onShow: function() {
  },
  onHide: function() {
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.globalProperties.socket = socket_index.socket;
  socket_index.socket.io.connect();
  console.log("🌍 [socket.io] 连接成功");
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
