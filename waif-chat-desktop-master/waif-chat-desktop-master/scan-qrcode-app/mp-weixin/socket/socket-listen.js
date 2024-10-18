"use strict";
const common_vendor = require("../common/vendor.js");
const socket_index = require("./index.js");
socket_index.socket.on("qrcode_status", (val) => {
  common_vendor.index.$emit("qrcode_status", val);
});
