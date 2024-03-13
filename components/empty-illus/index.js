Component({
  properties: {
    desc: String,
    btnContent: String,
    height: {
      type: String,
      value: '800rpx'
    }
  },

  methods: {
    btnClick() {
      this.triggerEvent('btnClick');
    },
  },
});
