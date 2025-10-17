import MallService from "../../../../../mall/utils/mallService";

class MerchantService extends MallService {
  async getTaskList(productType, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/task/list`,
      data: { status: 1, productType, page, limit },
      loadingTitle: "正在加载"
    });
  }

  async receiveTask(id, success) {
    return await this.post({
      url: `${this.baseUrl}/task/receive`,
      data: { id },
      success
    });
  }
}

export default MerchantService;
