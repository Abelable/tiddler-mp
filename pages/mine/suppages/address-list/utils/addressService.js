import BaseService from '../../../../../services/baseService'

class AddressService extends BaseService {
  async getAddressList() {
    return await this.get({ url: `${this.mmsUrl}/api/v4/address` })
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

  async addAddress(consignee, province, city, district, address, mobile, isDefault, country = 1) {
    await this.post({ url: `${this.mmsUrl}/api/v4/address/store`, data: { consignee, country, province, city, district, address, mobile, default: isDefault } })
  }

  async editAddress(address_id, consignee, province, city, district, address, mobile, isDefault, country = 1) {
    await this.post({ url: `${this.mmsUrl}/api/v4/address/update`, data: { address_id, consignee, country, province, city, district, address, mobile, default: isDefault } })
  }

  async deleteAddress(address_id) {
    await this.post({ url: `${this.mmsUrl}/api/v4/address/destroy`, data: { address_id } })
  }

  async recognizePic(img) {
    return await this.post({ url: `${this.mmsUrl}/api/v4/address/ocr`, data: { img } })
  }

  async recognizeText(address) {
    return await this.post({ url: `${this.mmsUrl}/api/v4/address/resolve`, data: { address } })
  }
}

export default AddressService
