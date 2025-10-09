Component({
  properties: {
    info: Object
  },

  methods: {
    linkTo() {
      const { scene, param } = this.properties.info || {};
      if (scene) {
        switch (scene) {
          case 1:
            wx.navigateTo({
              url: `/pages/subpages/common/webview/index?url=${param}`
            });
            break;

          case 2:
            wx.navigateTo({
              url: `/pages/subpages/home/goods-detail/index?id=${param}`
            });
            break;
        }
      }
      this.hide();
    },

    hide() {
      this.triggerEvent("hide");
    },

    catchtap() {}
  }
});
