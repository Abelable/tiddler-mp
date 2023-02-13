import BaseService from '../../../../../services/baseService'

class AddressService extends BaseService {
  async getAddressList() {
    return await this.get({ url: `${this.baseUrl}/address/list` })
  }

  async addWxAddress(userName, telNumber, provinceName, cityName, countyName, detailInfo, country = 1) {
    await this.post({ url: `${this.mmsUrl}/api/v4/address/wximport`, data: { userName, telNumber, provinceName, cityName, countyName, detailInfo, country } })
  }

  async getRegion(region = 1, level = 1, platform = 1) {
    return await this.get({ url: `${this.mmsUrl}/api/v4/misc/region`, data: { region, level, platform } })
  }

  async getAddress(address_id) {
    return await this.post({ url: `${this.mmsUrl}/api/v4/address/show`, data: { address_id }})
  }

  async addAddress(name, mobile, regionCodeList, regionDesc, addressDetail, isDefault, success) {
    await this.post({ 
      url: `${this.mmsUrl}/api/v4/address/store`, 
      data: { name, mobile, regionCodeList, regionDesc, addressDetail, isDefault },
      success
    })
  }

  async editAddress(address_id, consignee, province, city, district, address, mobile, isDefault, country = 1) {
    await this.post({ url: `${this.mmsUrl}/api/v4/address/update`, data: { address_id, consignee, country, province, city, district, address, mobile, default: isDefault } })
  }

  async deleteAddress(id, success) {
    await this.post({
      url: `${this.baseUrl}/api/v4/address/destroy`,
      data: { id }, 
      success
    })
  }

  async recognizePic(img) {
    return await this.post({ url: `${this.mmsUrl}/api/v4/address/ocr`, data: { img } })
  }

  async recognizeText(address) {
    return await this.post({ url: `${this.mmsUrl}/api/v4/address/resolve`, data: { address } })
  }
}

export default AddressService
