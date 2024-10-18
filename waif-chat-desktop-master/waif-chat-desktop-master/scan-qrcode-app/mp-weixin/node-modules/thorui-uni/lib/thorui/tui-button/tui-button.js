"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  name: "tuiButton",
  emits: ["click", "getuserinfo", "contact", "getphonenumber", "error", "chooseavatar", "launchapp"],
  behaviors: ["wx://form-field-button"],
  props: {
    //样式类型 primary, white, danger, warning, green,blue, gray，black,brown,gray-primary,gray-danger,gray-warning,gray-green
    type: {
      type: String,
      default: "primary"
    },
    //是否加阴影 移除
    shadow: {
      type: Boolean,
      default: false
    },
    // 宽度 rpx或 %
    width: {
      type: String,
      default: "100%"
    },
    //高度 rpx
    height: {
      type: String,
      default: ""
    },
    //medium 184*40 / small 120 40/ mini 58*32
    btnSize: {
      type: String,
      default: ""
    },
    //字体大小 rpx
    size: {
      type: [Number, String],
      default: 0
    },
    bold: {
      type: Boolean,
      default: false
    },
    margin: {
      type: String,
      default: "0"
    },
    //形状 circle(圆角), square(默认方形)，rightAngle(平角)
    shape: {
      type: String,
      default: "square"
    },
    plain: {
      type: Boolean,
      default: false
    },
    //link样式，去掉边框，结合plain一起使用
    link: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    //禁用后背景是否为灰色 （非空心button生效）
    disabledGray: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    formType: {
      type: String,
      default: ""
    },
    openType: {
      type: String,
      default: ""
    },
    appParameter: {
      type: String,
      default: ""
    },
    index: {
      type: [Number, String],
      default: 0
    },
    //是否需要阻止重复点击【默认200ms】
    preventClick: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    getWidth() {
      let width = this.width;
      if (this.btnSize && this.btnSize !== true) {
        width = {
          "medium": "368rpx",
          "small": "240rpx",
          "mini": "116rpx"
        }[this.btnSize] || this.width;
      }
      return width;
    },
    getHeight() {
      let height = this.height || common_vendor.index && common_vendor.index.$tui && common_vendor.index.$tui.tuiButton.height || "96rpx";
      if (this.btnSize && this.btnSize !== true) {
        height = {
          "medium": "80rpx",
          "small": "80rpx",
          "mini": "64rpx"
        }[this.btnSize] || "96rpx";
      }
      return height;
    },
    getSize() {
      return this.size || common_vendor.index && common_vendor.index.$tui && common_vendor.index.$tui.tuiButton.size || 32;
    }
  },
  data() {
    return {
      time: 0
    };
  },
  methods: {
    hexToRGB(hex) {
      if (hex.length === 4) {
        let text = hex.substring(1, 4);
        hex = "#" + text + text;
      }
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : {};
    },
    getColorByType(type, isText, plain) {
      const global = common_vendor.index && common_vendor.index.$tui && common_vendor.index.$tui.color;
      let color = "";
      const colors = {
        "primary": global && global.primary || "#5677fc",
        "white": "#fff",
        "danger": global && global.danger || "#EB0909",
        "warning": global && global.warning || "#ff7900",
        "green": global && global.success || "#07c160",
        "blue": global && global.blue || "#007aff",
        "gray": "#bfbfbf",
        "black": "#333333",
        "brown": "#ac9157",
        "gray-primary": "#f2f2f2",
        "gray-danger": "#f2f2f2",
        "gray-warning": "#f2f2f2",
        "gray-green": "#f2f2f2"
      };
      if (isText) {
        if (type && ~type.indexOf("gray-")) {
          const tp = type.replace("gray-", "");
          color = colors[tp];
        } else if (type === "white") {
          color = "#333";
        } else {
          if (plain) {
            color = colors[type];
          } else {
            color = "#fff";
          }
        }
      } else {
        color = colors[type] || colors.primary;
      }
      return color;
    },
    getShadow(type, plain) {
      const color = this.getColorByType(type);
      if (plain || !color)
        return "none";
      const rgb = this.hexToRGB(color);
      return `0 10rpx 14rpx 0 rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
    },
    getBgColor(type, plain) {
      return plain ? "transparent" : this.getColorByType(type);
    },
    getColor(type, plain) {
      return this.getColorByType(type, true, plain);
    },
    handleClick() {
      if (this.disabled)
        return;
      if (this.preventClick) {
        if ((/* @__PURE__ */ new Date()).getTime() - this.time <= 200)
          return;
        this.time = (/* @__PURE__ */ new Date()).getTime();
        setTimeout(() => {
          this.time = 0;
        }, 200);
      }
      this.$emit("click", {
        index: Number(this.index)
      });
    },
    bindgetuserinfo({
      detail = {}
    } = {}) {
      this.$emit("getuserinfo", detail);
    },
    bindcontact({
      detail = {}
    } = {}) {
      this.$emit("contact", detail);
    },
    bindgetphonenumber({
      detail = {}
    } = {}) {
      this.$emit("getphonenumber", detail);
    },
    binderror({
      detail = {}
    } = {}) {
      this.$emit("error", detail);
    },
    bindchooseavatar({
      detail = {}
    } = {}) {
      this.$emit("chooseavatar", detail);
    },
    bindlaunchapp({
      detail = {}
    } = {}) {
      this.$emit("launchapp", detail);
    },
    getDisabledClass: function(disabled, type, plain) {
      let className = "";
      if (disabled && type != "white" && type.indexOf("-") == -1) {
        let classVal = this.disabledGray ? "tui-gray-disabled" : "tui-dark-disabled";
        className = plain ? "tui-dark-disabled-outline" : classVal;
      }
      return className;
    },
    getShapeClass: function(shape, plain) {
      let className = "";
      if (shape == "circle") {
        className = plain ? "tui-outline-fillet" : "tui-fillet";
      } else if (shape == "rightAngle") {
        className = plain ? "tui-outline-rightAngle" : "tui-rightAngle";
      }
      return className;
    },
    getHoverClass: function(disabled, type, plain) {
      let className = "";
      if (!disabled) {
        className = plain ? "tui-outline-hover" : "tui-" + (type || "primary") + "-hover";
      }
      return className;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.n($props.plain ? "tui-" + $props.type + "-outline" : "tui-btn-" + ($props.type || "primary")),
    b: common_vendor.n($options.getDisabledClass($props.disabled, $props.type, $props.plain)),
    c: common_vendor.n($options.getShapeClass($props.shape, $props.plain)),
    d: common_vendor.n($props.bold ? "tui-text-bold" : ""),
    e: common_vendor.n($props.link ? "tui-btn__link" : ""),
    f: $options.getWidth,
    g: $options.getHeight,
    h: $options.getHeight,
    i: $options.getSize + "rpx",
    j: $options.getBgColor($props.type, $props.plain),
    k: $options.getColor($props.type, $props.plain),
    l: $props.shadow ? $options.getShadow($props.type, $props.plain) : "none",
    m: $props.loading,
    n: $props.formType,
    o: $props.openType,
    p: $props.appParameter,
    q: common_vendor.o((...args) => $options.bindgetuserinfo && $options.bindgetuserinfo(...args)),
    r: common_vendor.o((...args) => $options.bindgetphonenumber && $options.bindgetphonenumber(...args)),
    s: common_vendor.o((...args) => $options.bindcontact && $options.bindcontact(...args)),
    t: common_vendor.o((...args) => $options.binderror && $options.binderror(...args)),
    v: common_vendor.o((...args) => $options.bindchooseavatar && $options.bindchooseavatar(...args)),
    w: common_vendor.o((...args) => $options.bindlaunchapp && $options.bindlaunchapp(...args)),
    x: $props.disabled,
    y: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args)),
    z: !$props.link && $props.plain
  }, !$props.link && $props.plain ? {
    A: common_vendor.n($options.getShapeClass($props.shape, $props.plain)),
    B: common_vendor.n($options.getDisabledClass($props.disabled, $props.type, $props.plain)),
    C: $options.getBgColor($props.type)
  } : {}, {
    D: common_vendor.n(($props.width === "100%" || !$props.width || $props.width === true) && (!$props.btnSize || $props.btnSize === true) ? "tui-btn__flex-1" : ""),
    E: common_vendor.n($options.getShapeClass($props.shape, $props.plain)),
    F: common_vendor.n(!$props.disabled ? "tui-button__hover" : ""),
    G: $options.getWidth,
    H: $options.getHeight,
    I: $props.margin
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1bd4d121"]]);
wx.createComponent(Component);
