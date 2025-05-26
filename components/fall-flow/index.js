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
    mediaScene: {
      type: Number,
      value: 1
    },
    isGift: Boolean
  },

  data: {
    leftList: [],
    rightList: []
  },

  methods: {
    async render() {
      for (let i = 0, l = this.list.length / 2; i < l; i++) {
        const { leftHeight, rightHeight } = await this.getListWrapperHeight();
        if (leftHeight <= rightHeight) {
          if (rightHeight - leftHeight > 200) {
            this.setData({
              [`leftList[${this.data.leftList.length}]`]: this.list.shift(),
              [`leftList[${this.data.leftList.length}]`]: this.list.shift()
            });
          } else {
            this.setData({
              [`leftList[${this.data.leftList.length}]`]: this.list.shift(),
              [`rightList[${this.data.rightList.length}]`]: this.list.shift()
            });
          }
        } else {
          if (leftHeight - rightHeight > 200) {
            this.setData({
              [`rightList[${this.data.rightList.length}]`]: this.list.shift(),
              [`rightList[${this.data.rightList.length}]`]: this.list.shift()
            });
          } else {
            this.setData({
              [`rightList[${this.data.rightList.length}]`]: this.list.shift(),
              [`leftList[${this.data.leftList.length}]`]: this.list.shift()
            });
          }
        }
      }
      this.triggerEvent("finish");
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
