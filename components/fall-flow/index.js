const setActiveMediaItem = require("../../utils/behaviors/setActiveMediaItem");

Component({
  options: {
    multipleSlots: true,
  },

  behaviors: [setActiveMediaItem],

  properties: {
    list: {
      type: Array,
      observer(list) {
        const leftList = [];
        const rightList = [];
        list.forEach((item, index) => {
          if (index % 2 === 0) {
            leftList.push(item);
          } else {
            rightList.push(item);
          }
        });
        this.setData({ leftList, rightList }, () => {
          this.triggerEvent("finish");
        });
      },
    },
    mediaScene: {
      type: Number,
      value: 1
    },
    isGift: Boolean
  },

  data: {
    leftList: [],
    rightList: [],
  },
});
