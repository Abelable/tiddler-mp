const { statusBarHeight } = getApp().globalData

Page({
  data: {
    statusBarHeight,
    categoryOptions: ['全部景点', '乘船游湖', '文化演出', '水上娱乐', '网红景点', '其他景点'],
    sortOptions: ['推荐排序', '好评排序', '销量排序'],
    curCategoryOptionIdx: 0,
    curSortOptionIdx: 0,
    categoryOptionsDropdownVisible: false,
    sortOptionsDropdownVisible: false
  },

  onLoad() {},

  showCategoryOptionsDropdown() {
    const { categoryOptionsDropdownVisible, sortOptionsDropdownVisible } = this.data
    if (categoryOptionsDropdownVisible) {
      this.setData({
        categoryOptionsDropdownVisible: false
      })
      return
    }

    if (sortOptionsDropdownVisible) {
      this.setData({
        sortOptionsDropdownVisible: false
      })
    }

    this.setData({
      categoryOptionsDropdownVisible: true
    })
  },

  showSortOptionsDropdown() {
    const { categoryOptionsDropdownVisible, sortOptionsDropdownVisible } = this.data
    if (sortOptionsDropdownVisible) {
      this.setData({
        sortOptionsDropdownVisible: false
      })
      return
    }

    if (categoryOptionsDropdownVisible) {
      this.setData({
        categoryOptionsDropdownVisible: false
      })
    }

    this.setData({
      sortOptionsDropdownVisible: true
    })
  },

  selectSortOption(e) {
    this.setData({
      curSortOptionIdx: Number(e.currentTarget.dataset.index),
      sortOptionsDropdownVisible: false
    })
  },

  selectCategoryOption(e) {
    this.setData({
      curCategoryOptionIdx: Number(e.currentTarget.dataset.index),
      categoryOptionsDropdownVisible: false
    })
  },

  hideDropdown() {
    if (this.data.categoryOptionsDropdownVisible) {
      this.setData({
        categoryOptionsDropdownVisible: false
      })
    }
    if (this.data.sortOptionsDropdownVisible) {
      this.setData({
        sortOptionsDropdownVisible: false
      })
    }
  },

  navBack() {
    wx.navigateBack({
      delta: 1
    })
  }
})
