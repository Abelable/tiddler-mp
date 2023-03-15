const { statusBarHeight } = getApp().globalData.systemInfo

Page({
  data: {
    statusBarHeight,
    filterList: [
      {
        title: '',
        curIndex: 0,
        options: ['全部景点', '乘船游湖', '文化演出', '水上娱乐', '网红景点', '其他景点'],
        visible: false
      },
      {
        title: '',
        curIndex: 0,
        options: ['推荐排序', '好评排序', '销量排序'],
        visible: false
      }
    ]
  },

  onLoad() {},

  showDropdown(e) {
    const curIndex = Number(e.currentTarget.dataset.index)
    this.data.filterList.forEach((item, index) => {
      if (item.visible && curIndex !== index) {
        this.setData({
          [`filterList[${index}].visible`]: false
        })
      }
      if (curIndex === index) {
        this.setData({
          [`filterList[${index}].visible`]: !item.visible
        })
      }
    })
  },

  selectOption(e) {
    const { filterIndex, optionIndex } = e.currentTarget.dataset
    this.setData({
      [`filterList[${filterIndex}].curIndex`]: Number(optionIndex),
      [`filterList[${filterIndex}].visible`]: false
    })
  },

  hideDropdown() {
    this.data.filterList.forEach((item, index) => {
      if (item.visible) {
        this.setData({
          [`filterList[${index}].visible`]: false
        })
      }
    })
  },

  navBack() {
    wx.navigateBack({
      delta: 1
    })
  }
})
