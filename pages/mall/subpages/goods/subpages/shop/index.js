import { getQueryString, checkLogin } from '../../../../../../utils/index'
import GoodsService from '../../utils/goodsService'

const goodsService = new GoodsService()
const { statusBarHeight } = getApp().globalData

Page({
  data: {
    statusBarHeight,
    shopInfo: null,
    goodsList: [],
    finished: false
  },

  onLoad({ id, scene, q }) {
    wx.showShareMenu({
      withShareTicket:true,
      menus:['shareAppMessage','shareTimeline']
    })

    const decodedScene = scene ? decodeURIComponent(scene) : ''
    const decodedQ = q ? decodeURIComponent(q) : ''
    this.shopId = id || decodedScene.split('-')[0] || getQueryString(decodedQ, 'id')

    this.setGoodsInfo()
    this.setGoodsList(true)
  },

  async setGoodsInfo() {
    const shopInfo = await goodsService.getGoodsInfo(this.shopId)
    this.setData({ shopInfo })
  },

  async setGoodsList(init = false) {
    const limit = 10
    if (init) {
      this.page = 0
      this.setData({ finished: false })
    }
    const list = await goodsService.getShopGoodsList(this.shopId, ++this.page, limit) || []
    this.setData({
      goodsList: init ? list : [...this.data.goodsList, ...list]
    })
    if (list.length < limit) {
      this.setData({ finished: true })
    }
  },

  onReachBottom() {
    this.setGoodsList()
  },
  
  onPullDownRefresh() {
    this.setGoodsList(true)
    wx.stopPullDownRefresh() 
  },

  // 分享
  onShareAppMessage() {
    const { id, name: title, image: imageUrl } = this.data.shopInfo
    const path = `/pages/mall/subpages/goods/subpages/shop/index?id=${id}`
    return { title, imageUrl, path }
  },

  onShareTimeline() {
    const { id, name, image: imageUrl } = this.data.shopInfo
    const title = `小鱼游商家店铺：${name}`
    const query = `id=${id}`
    return { query, title, imageUrl }
  }
})
