import CateringService from '../../utils/cateringService'

const cateringService = new CateringService()

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    list: Array
  },
  
  methods: {
    cancelOrder(e) {
      const { id, index } = e.currentTarget.dataset
      cateringService.cancelMealTicketOrder(id, () => {
        this.triggerEvent('update', { type: 'cancel', index })
      })
    },
  
    navToDetail(e) {
      const id = e.currentTarget.dataset.id
      const url = `/pages/subpages/mine/merchant-center/subpages/catering-management/subpages/meal-ticket-order-detail/index?id=${id}`
      wx.navigateTo({ url })
    },

    contact() {},

    copyOrderSn(e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.sn, 
        success: () => {
          wx.showToast({ title: '复制成功', icon: 'none' })
        }
      })
    },
    
    copyAddress(e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.address, 
        success: () => {
          wx.showToast({ title: '复制成功', icon: 'none' })
        }
      })
    },
  }
})
