const setActiveMediaItem = require("../../utils/behaviors/setActiveMediaItem");

Component({
  options: {
    multipleSlots: true
  },

  behaviors: [setActiveMediaItem],

  properties: {
    list: {
      type: Array,
      observer(newList = [], oldList = []) {
        if (!newList.length) {
          this.setData({ leftList: [], rightList: [] });
        } else {
          this.list = newList.slice(oldList.length, newList.length);
          this.render();
        }
      }
    },
    loading: Boolean,
    finished: Boolean,
    mediaScene: {
      type: Number,
      value: 1
    },
    showShopInfo: {
      type: Boolean,
      value: true
    },
    showDistance: Boolean
  },

  data: {
    leftList: [],
    rightList: []
  },

  methods: {
    async render() {
      for (let i = 0, l = this.list.length / 2 + 1; i < l; i++) {
        if (i >= l - 2) {
          const media = this.list.shift();
          if (media) {
            const { leftHeight, rightHeight } =
              await this.getListWrapperHeight();
            if (leftHeight <= rightHeight) {
              this.setData({
                [`leftList[${this.data.leftList.length}]`]: media
              });
            } else {
              this.setData({
                [`rightList[${this.data.rightList.length}]`]: media
              });
            }
          } else {
            wx.nextTick(() => {
              this.triggerEvent("finish");
            });
          }
        } else {
          this.setData({
            [`leftList[${this.data.leftList.length}]`]: this.list.shift(),
            [`rightList[${this.data.rightList.length}]`]: this.list.shift()
          });
        }
      }
    },

    getListWrapperHeight() {
      return new Promise(resolve => {
        const query = wx.createSelectorQuery().in(this);
        query.selectAll(".left-list").boundingClientRect();
        query.selectAll(".right-list").boundingClientRect();
        query.exec(res => {
          if (res[0])
            resolve({
              leftHeight: res[0][0].height,
              rightHeight: res[1][0].height
            });
        });
      });
    }
  }
});
