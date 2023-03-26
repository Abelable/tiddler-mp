Component({
  properties: {
    height: {
      type: Number,
      value: 250,
    },
  },

  data: {
    src: "",
  },

  lifetimes: {
    attached() {
      this.cropper = this.selectComponent("#image-cropper");
      this.cropper.upload();
    },
  },

  loadimage() {
    wx.hideLoading();
    this.cropper.imgReset();
  },

  clickcut(e) {
    wx.previewImage({
      current: e.detail.url,
      urls: [e.detail.url],
    });
  },

  submit() {
    this.cropper.getImg(({ url }) => {
      this.triggerEvent("confirm", { url });
    });
  },

  hide() {
    this.triggerEvent("hide");
  },
});
