const { statusBarHeight } = getApp().globalData

import GoodsService from './utils/goodsService'

const goodsService = new GoodsService()

Page({
  data: {
    statusBarHeight,
    categoryOptions: [],
    activeTabIdx: 0,
    tabScroll: 0,
    goodsList: []
  },

  async onLoad() {
    await this.setCategoryOptions()
    this.setGoodsList(true)
  },

  async setCategoryOptions() {
    const options = await goodsService.getGoodsCategoryOptions()
    this.setData({ 
      categoryOptions: [
        { id: 0, name: '推荐'},
        ...options
      ]
    })
  },

  selectCate(e) {
    const { idx } = e.currentTarget.dataset
    this.setData({ 
      activeTabIdx: idx, 
      tabScroll: (idx - 2) * 80
    })
    this.setGoodsList(true)
  },

  async setGoodsList(init = false) {
    if (init) this.page = 0
    const { categoryOptions, activeTabIdx, goodsList } = this.data
    const list = await goodsService.getGoodsList(categoryOptions[activeTabIdx].id, ++this.page) || []
    this.setData({
      goodsList: init ? list : [...goodsList, ...list]
    })
  },

  onReachBottom() {
    this.setGoodsList()
  },
  
  onPullDownRefresh() {
    this.setGoodsList(true)
    wx.stopPullDownRefresh() 
  },

  navBack() {
    wx.navigateBack({
      delta: 1
    })
  }
})
