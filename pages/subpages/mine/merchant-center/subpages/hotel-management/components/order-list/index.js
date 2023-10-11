import ScenicService from '../../utils/hotelService'

const scenicService = new ScenicService()

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
      scenicService.cancelOrder(id, () => {
        this.triggerEvent('update', { type: 'cancel', index })
      })
    },

    checkedOrder(e) {
      const { id, index } = e.currentTarget.dataset
      scenicService.checkedOrder(id, () => {
        this.triggerEvent('update', { type: 'checked', index })
      })
    },
  
    navToDetail(e) {
      const id = e.currentTarget.dataset.id
      const url = `/pages/subpages/mine/merchant-center/subpages/hotel-management/subpages/order-detail/index?id=${id}`
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
