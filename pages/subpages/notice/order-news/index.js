import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../../../store/index'
import BaseService from '../../../../service/baseService'

Page({
  data: {
    type: 1,
    newsList: []
  },

  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['sellGoodsNewsBarVisible', 'businessNewsBarVisible', 'unreadMsgCountOfBuyGoods', 'unreadMsgCountOfSellGoods', 'unreadMsgCountOfBusiness']
    })

    this.setNewsList(true)
  },

  selectMenu(e) {
    const type = Number(e.currentTarget.dataset.type)
    this.setData({ type })
    this.setNewsList(true)
  },

  async setNewsList(init = false) {
    const { type, newsList } = this.data
    const readTime = newsList.length ? newsList[newsList.length - 1].read_tim : 0
    if (init) this.page = 0
    const { list } = await new BaseService().getNewsList(type, ++this.page, readTime)
    this.setData({ 
      newsList: init ? list : [...newsList, ...list]
    })
    this.updateUnreadMsgCount()
  },

  updateUnreadMsgCount() {
    const { unreadMsgCount, unreadMsgCountOfBuyGoods, unreadMsgCountOfSellGoods, unreadMsgCountOfBusiness } = store
    switch (this.data.type) {
      case 1:
        if (unreadMsgCountOfBuyGoods) {
          store.setUnreadMsgCountOfBuyGoods(0)
          store.setUnreadMsgCount(unreadMsgCount - unreadMsgCountOfBuyGoods)
        }
        break

      case 2:
        if (unreadMsgCountOfSellGoods) {
          store.setUnreadMsgCountOfSellGoods(0)
          store.setUnreadMsgCount(unreadMsgCount - unreadMsgCountOfSellGoods)
        }
        break

      case 3:
        if (unreadMsgCountOfBusiness) {
          store.setUnreadMsgCountOfBusiness(0)
          store.setUnreadMsgCount(unreadMsgCount - unreadMsgCountOfBusiness)
        }
        break
    }
  },

  onPullDownRefresh() {
    this.setNewsList(true)
    wx.stopPullDownRefresh()
  },

  onReachBottom() {
    this.setNewsList()
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings()
  }
})