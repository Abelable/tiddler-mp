Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    price: {
      type: Number,
      observer(val) {
        const arr = `${val.toFixed(2)}`.split(".");
        const integerPart = arr[0];
        const floatPart = arr[1] === "00" ? "" : arr[1];
        this.setData({ integerPart, floatPart });
      },
    },
    color: {
      type: String,
      value: "#EE0D23",
    },
    fontSize: {
      type: String,
      value: "24rpx",
    },
    integerFontSize: {
      type: String,
      value: "32rpx",
    },
    symbol: {
      type: String,
      value: "¥",
    },
    isStartPrice: Boolean,
    startFontSize: {
      type: String,
      value: "22rpx",
    },
  },

  data: {
    integerPart: "0",
    floatPart: "",
  },
});
