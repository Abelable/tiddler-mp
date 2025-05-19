import BaseService from "../../../../services/baseService";

class GiftService extends BaseService {
  async getGiftList(type, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/gift_goods_list`,
      data: { type, page, limit },
      loadingTitle: '加载中...'
    });
  }
}

export default GiftService;
