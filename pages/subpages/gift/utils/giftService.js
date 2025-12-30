import BaseService from "../../../../services/baseService";

class GiftService extends BaseService {
  async getGiftTypeOptions() {
    return await this.get({
      url: `${this.baseUrl}/gift/type_options`
    });
  }

  async getGiftList(typeId, page, loadingTitle, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/gift/list`,
      data: { typeId, page, limit },
      loadingTitle
    });
  }
}

export default GiftService;
