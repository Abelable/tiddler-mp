const { statusBarHeight } = getApp().globalData

Page({
  data: {
    statusBarHeight,
    filterList: [
      {
        title: '',
        curIndex: 0,
        options: ['推荐排序', '好评排序', '销量排序', '价格排序'],
        visible: false
      },
      {
        title: '酒店类型',
        curIndex: 0,
        options: ['不限类型', '星级酒店', '特色民宿', '房车营地'],
        visible: false
      }
    ],
    calendarPopupVisibel: false,
    startDate: '',
    endDate: ''
  },

  onLoad() {
    this.initCalendar()
  },

  initCalendar() {
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 1)

    this.setData({
      startDate: this.formatDate(),
      endDate: this.formatDate(endDate)
    })
  },

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

  showCalendarPopup() {
    this.setData({
      calendarPopupVisibel: true
    })
  },

  hideCalendarPopup() {
    this.setData({
      calendarPopupVisibel: false
    })
  },

  setCalendar(e) {
    const [start, end] = e.detail
    this.setData({
      startDate: this.formatDate(start),
      endDate: this.formatDate(end),
      calendarPopupVisibel: false
    })
  },

  formatDate(date) {
    date = date ? new Date(date) : new Date()
    const month = `${date.getMonth() + 1}`.padStart(2, '0')
    const day = `${date.getDate()}`.padStart(2, '0')
    return `${month}-${day}`
  },

  navBack() {
    wx.navigateBack({
      delta: 1
    })
  }
})
