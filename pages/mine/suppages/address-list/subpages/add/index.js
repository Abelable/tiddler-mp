import AddressService from '../../utils/addressService'

const addressService = new AddressService()

Page({
  data: {
    name: '',
    mobile: '',
    regionCodeList: [],
    addressDetail: '',
    isDefault: 0
  },

  showRegionPicker() {
    this.setData({
      regionPickerVisible: true
    })
  },

  hideRegionPicker() {
    this.setData({
      regionPickerVisible: false
    })
  },

  confirm(e) {
    let { regionArr, regionIdArr } = e.detail
    this.setData({ regionArr })
    this.regionIdArr = regionIdArr
    this.hideRegionPicker()
  },

  textInput(e) {
    this.setData({
      text: e.detail.value
    })
  },

  // 设置为默认地址
  switchChange(e) {
    this.setData({
      isDefault: e.detail.value ? 1 : 0
    })
  },

  deleteAddress() {
    addressService.deleteAddress(this.data.addressId)
    wx.navigateBack()
  },

  // 新建、修改收货地址
  save() {
    const { name, mobile, regionCodeList, addressDetail, isDefault } = this.data
    if (!name) {
      wx.showToast({ 
        title: '请输入姓名', 
        icon: 'none' 
      })
      return
    }
    if (!mobile || !/^1[345789][0-9]{9}$/.test(mobile)) {
      wx.showToast({ 
        title: '请输入正确手机号', 
        icon: 'none' 
      })
      return
    }
    if (!addressDetail) {
      wx.showToast({ 
        title: '请输入详细地址', 
        icon: 'none' 
      })
      return
    }

    addressService.addAddress(name, mobile, regionCodeList, this.regionDesc, addressDetail, isDefault, () => {
      wx.navigateBack()
    })
  }
})