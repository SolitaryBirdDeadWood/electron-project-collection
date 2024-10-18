"use strict";
const common_vendor = require("../common/vendor.js");
const common_url = require("../common/url.js");
const socket = common_vendor.uniSocket_ioExports.io(common_url.SOCKET_URL, {
  transports: ["websocket", "polling"],
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 100,
  reconnectionDelay: 1e3
});
exports.socket = socket;
