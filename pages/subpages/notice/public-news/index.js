import { store } from '../../../../store/index'
import BaseService from '../../../../service/baseService'

Page({
  data: {
    newsList: []
  },

  onLoad() {
    this.setNewsList(true)
    this.updateUnreadMsgCount()
  },

  async setNewsList(init = false) {
    const { newsList } = this.data
    const readTime = newsList.length ? newsList[newsList.length - 1].read_tim : 0
    if (init) this.page = 0
    const { list } = await new BaseService().getNewsList(8, ++this.page, readTime)
    this.setData({ 
      newsList: init ? list : [...newsList, ...list]
    })
  },

  updateUnreadMsgCount() {
    const { unreadMsgCount, unreadMsgCountOfPublic } = store
    if (unreadMsgCountOfPublic) {
      store.setUnreadMsgCountOfPublic(0)
      store.setUnreadMsgCount(unreadMsgCount - unreadMsgCountOfPublic)
    }
  },

  navTo(e) {
    const { info = '' } = e.currentTarget.dataset
    if (info) {
      const { type, data } = JSON.parse(info)
      if (type) {
        switch (type) {
          case 1:
            wx.navigateTo({ url: `/pages/subpages/mine/order/order-detail/index?id=${data.order_id}` })
            break
    
          case 2:
            wx.navigateTo({ url: `/pages/subpages/common/webview/index?url=${webviewBaseUrl}/refund/detail/index.html&ret_id=${data.ret_id}` })
            break
    
          case 3:
            wx.navigateTo({ url: `/pages/subpages/index/short-video/subpages/personal-center/index?id=${data.user_id}` })
            break
    
          case 4:
            wx.navigateTo({ url: `/pages/subpages/index/room/index?id=${data.room_id}` })
            break
    
          case 5:
            wx.navigateTo({ url: `/pages/subpages/common/webview/index?url=${data.h5.replace('http:', 'https:').replace('?', '&')}` })
            break
        }
      }
    }
  },

  onPullDownRefresh() {
    this.setNewsList(true)
    wx.stopPullDownRefresh()
  },

  onReachBottom() {
    this.setNewsList()
  }
})