"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  name: "tuiFooter",
  props: {
    //type target url delta appid path extradata bindsuccess bindfail text color size
    //链接设置  数据格式对应上面注释的属性值
    navigate: {
      type: Array,
      default: function() {
        return [];
      }
    },
    urlField: {
      type: String,
      default: "url"
    },
    textField: {
      type: String,
      default: "text"
    },
    //底部文本
    copyright: {
      type: String,
      default: "All Rights Reserved."
    },
    //copyright 字体颜色
    color: {
      type: String,
      default: "#A7A7A7"
    },
    //copyright 字体大小
    size: {
      type: Number,
      default: 24
    },
    //footer背景颜色
    backgroundColor: {
      type: String,
      default: "transparent"
    },
    //V2.8.0+
    linkColor: {
      type: String,
      default: ""
    },
    //是否固定在底部
    fixed: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    getLinkColor() {
      return this.linkColor || common_vendor.index && common_vendor.index.$tui && common_vendor.index.$tui.color.link || "#586c94";
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.navigate.length > 0
  }, $props.navigate.length > 0 ? {
    b: common_vendor.f($props.navigate, (item, index, i0) => {
      return {
        a: common_vendor.t(item[$props.textField]),
        b: item.color || $options.getLinkColor,
        c: (item.size || 28) + "rpx",
        d: item.type,
        e: item[$props.urlField],
        f: item.target,
        g: item.delta,
        h: item.appid,
        i: item.path,
        j: item.extradata,
        k: item.bindsuccess,
        l: item.bindfail,
        m: index
      };
    }),
    c: $options.getLinkColor
  } : {}, {
    d: common_vendor.t($props.copyright),
    e: $props.color,
    f: $props.size + "rpx",
    g: common_vendor.n($props.fixed ? "tui-fixed" : ""),
    h: $props.backgroundColor
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e167ad64"]]);
wx.createComponent(Component);
