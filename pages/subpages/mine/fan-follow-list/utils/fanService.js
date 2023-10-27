import BaseService from '../../../../../services/baseService'

class AddressService extends BaseService {
  async getFollowList({ page, limit = 10, loadingTitle }) {
    return await this.get({
      url: `${this.baseUrl}/fan/follow_list`,
      data: { page, limit },
      loadingTitle
    });
  }

  async getFanList({ page, limit = 10, loadingTitle }) {
    return await this.get({
      url: `${this.baseUrl}/fan/fan_list`,
      data: { page, limit },
      loadingTitle
    });
  }
}

export default AddressService
