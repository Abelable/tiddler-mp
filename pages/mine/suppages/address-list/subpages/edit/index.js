import AddressService from '../../utils/addressService'

const addressService = new AddressService()

Page({
  data: {
    addressId: '',
    consignee: '', // 姓名
    mobile: '', // 电话
    addressDetail: '', // 详细地址
    regionArr: '', // 选中区域名称
    regionIdArr: [],
    isDefault: 0, // 是否是默认地址
    text: '', // 智能识别框内容
  },

  async onLoad(options) {
    let addressId = options.id
    wx.setNavigationBarTitle({ title: addressId ? '修改地址' : '新增地址' })
    this.setData({ addressId })
    if (addressId) {
      let { consignee, mobile, province_name, city_name, district_name, address: addressDetail, province: provinceId, city: cityId, district: areaId, default_address_id } = await addressService.getAddress(addressId)
      this.setData({ consignee, mobile, addressDetail, 
        regionArr: [province_name, city_name, district_name],
        isDefault: default_address_id === addressId ? 1 : 0
      })
      this.regionIdArr = [provinceId, cityId, areaId]
    } 
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

  async recognizeText() {
    if (this.data.text) {
      let res = await addressService.recognizeText(this.data.text)
      let { name: consignee, mobile, detail: addressDetail, province_name, city_name, county_name, province_id, city_id, county_id } = res
      this.setData({ consignee, mobile, addressDetail,
        regionArr: [province_name, city_name, county_name],
        text: ''
      })
      this.regionIdArr = [province_id, city_id, county_id]
    } else {
      wx.showToast({ title: '请输入收货地址', icon: 'none' })
    }
  },

  // 清空智能录入
  clearText() {
    this.setData({
      text: ''
    })
  },

  // 智能识别照片
  async recognizePic() {
    let { tempFilePaths } = await addressService.chooseImage(1)
    let res = await addressService.uploadFile(tempFilePaths[0])
    let { name: consignee, mobile, detail } = await addressService.recognizePic(res[0])
    let { address: addressDetail, province: provinceName, province_id: provinceId, city: cityName, city_id: cityId, district: areaName, district_id: areaId } = detail
    this.setData({ consignee, mobile, addressDetail, 
      regionArr: [provinceName, cityName, areaName],
    })
    this.regionIdArr = [provinceId, cityId, areaId]
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
  save(e) {
    let { consignee, mobile, address_detail: address } = e.detail.value
    let { addressId, isDefault } = this.data
    let [province, city, district] = this.regionIdArr
    const reg = /^1\d{10}$/;
    let toastTip = !consignee ? '请输入姓名' : !mobile || !reg.test(Number(mobile)) ? '请输入正确的手机号码' : !province ? '请选择收货地址' : !address ? '请输入详细地址' : '';
    if (toastTip) {
      wx.showToast({ title: toastTip, icon: 'none' })
    } else {
      addressId ? addressService.editAddress(addressId, consignee, province, city, district, address, mobile, isDefault) : addressService.addAddress(consignee, province, city, district, address, mobile, isDefault)
      wx.navigateBack()
    }
  }
})