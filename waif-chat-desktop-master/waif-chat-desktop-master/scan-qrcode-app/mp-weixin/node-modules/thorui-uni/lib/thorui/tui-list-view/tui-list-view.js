"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  name: "tuiListView",
  props: {
    title: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "#666"
    },
    //rpx
    size: {
      type: Number,
      default: 30
    },
    backgroundColor: {
      type: String,
      default: "transparent"
    },
    unlined: {
      type: String,
      default: ""
      //top,bottom,all
    },
    marginTop: {
      type: String,
      default: "0"
    },
    //圆角值
    radius: {
      type: [Number, String],
      default: 0
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.title
  }, $props.title ? {
    b: common_vendor.t($props.title),
    c: $props.color,
    d: $props.size + "rpx",
    e: "30rpx"
  } : {}, {
    f: common_vendor.n($props.unlined ? "tui-border-" + $props.unlined : ""),
    g: $props.radius && $props.radius != "0" ? 1 : "",
    h: $props.backgroundColor,
    i: $props.marginTop,
    j: $props.radius + "rpx"
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3e8f671e"]]);
wx.createComponent(Component);
