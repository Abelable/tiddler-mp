import BaseService from "../../../../services/baseService";

class GiftService extends BaseService {
  async getGiftTypeOptions() {
    return await this.get({
      url: `${this.baseUrl}/gift/type_options`
    });
  }

  async getGiftList(typeId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/gift/list`,
      data: { typeId, page, limit }
    });
  }
}

export default GiftService;
