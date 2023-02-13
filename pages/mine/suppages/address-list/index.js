
import AddressService from './utils/addressService'
let addressService = new AddressService

Page({
  data: {
    addressList: []
  },

  onShow() {
    this.getAddressList()
  },

  async getAddressList() {
    this.setData({
      addressList: await addressService.getAddressList()
    })
  },

  chooseAddress(e) {
    let addressId = e.currentTarget.dataset.id
    let addressInfo = e.currentTarget.dataset
    let pages = getCurrentPages()
    let prevPage = pages[pages.length - 2]
    if (prevPage.route === 'pages/subpages/mall/goods-detail/subpages/order-check/index') {
      prevPage.setData({ addressId, addressInfo })
      wx.navigateBack()
    } else {
      wx.navigateTo({ url: `./add-address/index?id=${addressId}`})
    }
  },

  editAddress(e) {
    wx.navigateTo({ url: `./add-address/index?id=${e.currentTarget.dataset.addressId}`})
  },
  
  // 显示新建收货地址
  addAddress() {
    wx.navigateTo({ url: './add-address/index'})
  },

  deleteAddress(e) {
    let { listId, idx } = e.detail
    let addressList = this.data.addressList
    addressList.splice(idx, 1)
    this.setData({ addressList })
    addressService.deleteAddress(listId)
    e.detail.close()
  }
})