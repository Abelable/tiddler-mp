const { statusBarHeight } = getApp().globalData

import { checkLogin, customBack } from '../../../../utils/index'
import GoodsService from './utils/goodsService'

const goodsService = new GoodsService()

Page({
  data: {
    statusBarHeight,
    cartGoodsNumber: 0,
    categoryOptions: [],
    activeTabIdx: 0,
    tabScroll: 0,
    goodsList: [],
    finished: false
  },

  async onLoad() {
    await this.setCategoryOptions()
    this.setGoodsList(true)
  },

  onShow() {
    checkLogin(() => {
      this.setCartGoodsNumber()
    }, false)
  },

  async setCartGoodsNumber() {
    const cartGoodsNumber = await goodsService.getCartGoodsNumber();
    this.setData({ cartGoodsNumber })
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
    const limit = 10
    if (init) {
      this.page = 0
      this.setData({
        finished: false
      })
    }
    const { categoryOptions, activeTabIdx, goodsList } = this.data
    const list = await goodsService.getGoodsList(categoryOptions[activeTabIdx].id, ++this.page, limit) || []
    this.setData({
      goodsList: init ? list : [...goodsList, ...list]
    })
    if (list.length < limit) {
      this.setData({
        finished: true
      })
    }
  },

  onReachBottom() {
    this.setGoodsList()
  },
  
  onPullDownRefresh() {
    this.setGoodsList(true)
    wx.stopPullDownRefresh() 
  },
  
  navBack() {
    customBack()
  }
})
