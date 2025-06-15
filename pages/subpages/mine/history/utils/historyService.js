import BaseService from "../../../../../services/baseService";

class HistotyService extends BaseService {
  async getMediaHistoryList(page, limit = 10) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/history/media`,
        data: { page, limit }
      })) || {};
    return list;
  }

  async getProductHistoryList(type, page, limit = 10) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/history/product`,
        data: { type, page, limit }
      })) || {};
    return list;
  }
}

export default HistotyService;
