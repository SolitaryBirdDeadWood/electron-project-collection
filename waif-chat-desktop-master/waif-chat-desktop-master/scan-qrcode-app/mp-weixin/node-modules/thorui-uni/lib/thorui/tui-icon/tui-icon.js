"use strict";
const common_vendor = require("../../../../../common/vendor.js");
const _sfc_main = {
  name: "tuiIcon",
  emits: ["click"],
  props: {
    name: {
      type: String,
      default: ""
    },
    customPrefix: {
      type: String,
      default: ""
    },
    size: {
      type: [Number, String],
      default: 0
    },
    //px或者rpx
    unit: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: ""
    },
    bold: {
      type: Boolean,
      default: false
    },
    margin: {
      type: String,
      default: "0"
    },
    index: {
      type: Number,
      default: 0
    }
  },
  computed: {
    getColor() {
      return this.color || common_vendor.index && common_vendor.index.$tui && common_vendor.index.$tui.tuiIcon.color || "#999";
    },
    getSize() {
      const size = this.size || common_vendor.index && common_vendor.index.$tui && common_vendor.index.$tui.tuiIcon.size || 32;
      const unit = this.unit || common_vendor.index && common_vendor.index.$tui && common_vendor.index.$tui.tuiIcon.unit || "px";
      return size + unit;
    }
  },
  data() {
    return {
      icons: common_vendor.icons
    };
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
  return {
    a: common_vendor.t($data.icons[$props.name] || ""),
    b: common_vendor.n($props.customPrefix),
    c: common_vendor.n($props.customPrefix ? $props.name : ""),
    d: $options.getColor,
    e: $options.getSize,
    f: $props.bold ? "bold" : "normal",
    g: $props.margin,
    h: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bfc5f459"]]);
wx.createComponent(Component);
