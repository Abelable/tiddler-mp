import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../../../../../store/index'
import { getQueryString, checkLogin } from '../../../../../../utils/index'
import GoodsService from '../../utils/goodsService'

const goodsService = new GoodsService()
const { statusBarHeight } = getApp().globalData
const navBarHeight = statusBarHeight + 44

Page({
  data: {
    statusBarHeight,
    // 导航栏相关
    showNavBar: false, // 导航栏显隐
    detailActive: false, // 导航栏'详情'激活状态
    // 轮播图相关
    curDot: 1,
    bannerHeight: '',
    // 规格相关
    specData: '', // 商品规格数据
    specTips: '',
    showSpecModal: false,
    actionType: '', // 点击'完成'按钮的行为状态：0-关闭弹窗 1-加购物车 2-直接购买
    shareModalVisible: false,
    posterInfo: null, // 分享海报
    posterModalVisible: false, // 海报弹窗
    shareDesc: '',
    goodsInfo: {}
  },

  onLoad({ id, scene, q }) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['cartCount'],
    })

    wx.showShareMenu({
      withShareTicket:true,
      menus:['shareAppMessage','shareTimeline']
    })

    const decodedScene = scene ? decodeURIComponent(scene) : ''
    const decodedQ = q ? decodeURIComponent(q) : ''
    this.goodsId = id || decodedScene.split('-')[0] || getQueryString(decodedQ, 'id')

    this.getBannerHeight()

    setTimeout(() => { 
      this.setGoodsInfo() 
    }, 500)
  },

  async setGoodsInfo() {
    const goodsInfo = await goodsService.getGoodsInfo(this.goodsId)
    this.setData({ goodsInfo }, () => {
      this.getDetailTop()
    })
  },

  getBannerHeight() {
    const query = wx.createSelectorQuery()
    query.select('.banner-wrap').boundingClientRect()
    query.exec(res => {
      this.setData({
        bannerHeight: res[0].height
      })
    })
  },

  // 获取详情部分离窗口顶部的距离
  getDetailTop() {
    const query = wx.createSelectorQuery()
    query.select('.goods-detail-line').boundingClientRect()
    query.exec(res => {
      if (res[0] !== null) {
        this.detailTop = res[0].top
      }
    })
  },

  // 监听滚动
  onPageScroll(e) {
    const { bannerHeight, showNavBar, detailActive } = this.data

    // 控制导航栏显隐
    if (e.scrollTop >= bannerHeight) {
      if (!showNavBar) this.setData({ showNavBar: true })
    } else {
      if (showNavBar) this.setData({ showNavBar: false })
    }

    // 控制导航栏tab的状态切换
    if (e.scrollTop >= this.detailTop - navBarHeight) {
      if (!detailActive) this.setData({ detailActive: true })
    } else {
      if (detailActive) this.setData({ detailActive: false })
    }
  },

  // 滚动到顶部
  scrollToTop() {
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  // 滚动到详情部分
  scrollToDetail() {
    wx.pageScrollTo({
      scrollTop: this.detailTop - navBarHeight * 0.9
    })
  },

  bannerChange(event) {
    this.setData({
      curDot: event.detail.current + 1
    })
  },

  // 图片预览
  previewImage(e) {
    const { current, urls } =  e.currentTarget.dataset
    wx.previewImage({ current, urls })
  },

  // 客服
  contact() {
    if (this.data.goodsInfo.shopInfo) {
      const { id, name, avatar } = this.data.goodsInfo.shopInfo.keeperInfo
      const url = `/pages/subpages/news/chat/index?userId=${id}&name=${name}&avatar=${avatar}&goodsId=${this.goodsId}`
      wx.navigateTo({ url })
    }
  },

  // 页面跳转
  goShop() {
    wx.navigateTo({ url: `./subpages/shop/index?id=${this.data.supplierInfo.supplier_id}` })
  },

  // 通过遮罩关闭弹窗
  hideModal() {
    this.data.showSpecModal && this.setData({ showSpecModal: false })
    this.data.shareModalVisible && this.setData({ shareModalVisible: false })
    this.data.posterModalVisible && this.setData({ posterModalVisible: false })
    this.data.showMask && this.setData({ showMask: false })
  },

  // 显示规格弹窗
  showSpecModal(e) {
    const { stock, isOnSale } = this.data
    if (stock && isOnSale) {
      this.setData({
        showSpecModal: true,
        showMask: true,
        actionType: e.currentTarget.dataset.actionType
      })
    }
  },

  // 关闭规格弹窗
  hideSpecModal() {
    this.setData({
      showSpecModal: false,
      showMask: false
    })
  },

  async setPosterInfo() {
    let { wxacode_pic, goodsView } = await goodsService.getGoodsPoster(this.data.goodsId)
    let { goods_img, goods_name, shop_price: shopPrice } = goodsView
    let goodsName = goods_name.length > 16 ? goods_name.slice(0, 16) + '...' : goods_name
    let { path: qrCode } = await goodsService.getImageInfo(wxacode_pic)
    let { path: goodsPic } = await goodsService.getImageInfo(goods_img)
    this.setData({
      posterInfo: { goodsPic, shopPrice, goodsName, qrCode }
    })
  },

  showShareModal() {
    checkLogin(() => {
      this.setData({ shareModalVisible: true, showMask: true })
      this.setPosterInfo()
    })
  },

  showPosterModal() {
    this.setData({ shareModalVisible: false, posterModalVisible: true })
  },

  hidePosterModal() {
    this.setData({
      posterModalVisible: false
    })
  }, 

  navigateBack() {
    wx.navigateBack()
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings()
  },

  // 分享
  onShareAppMessage() {
    const { id, name: title, image: imageUrl } = this.data.goodsInfo
    const path = `/pages/mall/subpages/goods/subpages/goods-detailindex?id=${id}`
    return { title, imageUrl, path }
  },

  onShareTimeline() {
    const { id, name, image: imageUrl } = this.data
    const title = `小鱼游商品：${name}`
    const query = `id=${id}`
    return { query, title, imageUrl }
  }
})
