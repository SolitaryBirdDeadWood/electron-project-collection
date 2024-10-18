"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  name: "tuiListCell",
  emits: ["click"],
  options: {
    virtualHost: true
  },
  props: {
    //是否有箭头
    arrow: {
      type: Boolean,
      default: false
    },
    //V2.3.0+
    arrowColor: {
      type: String,
      default: ""
    },
    //是否有点击效果
    hover: {
      type: Boolean,
      default: true
    },
    //隐藏线条
    unlined: {
      type: Boolean,
      default: false
    },
    //V2.3.0+
    lineColor: {
      type: String,
      default: ""
    },
    //线条左偏移距离
    lineLeft: {
      type: [Number, String],
      default: -1
    },
    //线条右偏移距离
    lineRight: {
      type: [Number, String],
      default: 0
    },
    padding: {
      type: String,
      default: ""
    },
    marginTop: {
      type: [Number, String],
      default: 0
    },
    marginBottom: {
      type: [Number, String],
      default: 0
    },
    //背景颜色
    backgroundColor: {
      type: String,
      default: "#fff"
    },
    //字体大小
    size: {
      type: Number,
      default: 0
    },
    //字体颜色
    color: {
      type: String,
      default: ""
    },
    //圆角值
    radius: {
      type: [Number, String],
      default: 0
    },
    //箭头偏移距离
    arrowRight: {
      type: [Number, String],
      default: 30
    },
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    getArrowColor() {
      return this.arrowColor || common_vendor.index && common_vendor.index.$tui && common_vendor.index.$tui.tuiListCell.arrowColor || "#c0c0c0";
    },
    getLineColor() {
      return this.lineColor || common_vendor.index && common_vendor.index.$tui && common_vendor.index.$tui.tuiListCell.lineColor || "#eaeef1";
    },
    getLineLeft() {
      let left = this.lineLeft;
      if (left === -1) {
        left = common_vendor.index && common_vendor.index.$tui && common_vendor.index.$tui.tuiListCell.lineLeft;
      }
      return left === void 0 || left === null ? 30 : left;
    },
    getPadding() {
      return this.padding || common_vendor.index && common_vendor.index.$tui && common_vendor.index.$tui.tuiListCell.padding || "26rpx 30rpx";
    },
    getColor() {
      return this.color || common_vendor.index && common_vendor.index.$tui && common_vendor.index.$tui.tuiListCell.color || "#333";
    },
    getSize() {
      return this.size || common_vendor.index && common_vendor.index.$tui && common_vendor.index.$tui.tuiListCell.size || 28;
    }
  },
  methods: {
    handleClick() {
      this.$emit("click", {
        index: this.index
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: !$props.unlined
  }, !$props.unlined ? {
    b: $options.getLineColor,
    c: $options.getLineLeft + "rpx",
    d: $props.lineRight + "rpx"
  } : {}, {
    e: $props.arrow
  }, $props.arrow ? {
    f: $options.getArrowColor,
    g: $props.arrowRight + "rpx"
  } : {}, {
    h: common_vendor.n($props.radius && $props.radius != "0" ? "tui-radius" : ""),
    i: common_vendor.n($props.hover ? "tui-cell-hover" : ""),
    j: $props.backgroundColor,
    k: $options.getSize + "rpx",
    l: $options.getColor,
    m: $options.getPadding,
    n: $props.radius + "rpx",
    o: $props.marginTop + "rpx",
    p: $props.marginBottom + "rpx",
    q: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5d1fed30"]]);
wx.createComponent(Component);
