import { cleanObject } from "../../../../../../../utils/index";
import MerchantService from "../../../utils/merchantService";

class RefundService extends MerchantService {
  async getShopRefundTotal(shopId) {
    return await this.get({
      url: `${this.baseUrl}/shop/refund/total`,
      data: { shopId }
    });
  }

  async getRefundList({ shopId, status, orderSn, page, limit = 10 }) {
    const { list = [] } =
      (await this.post({
        url: `${this.baseUrl}/shop/refund/list`,
        data: cleanObject({ shopId, status, orderSn, page, limit }),
        loadingTitle: "正在加载"
      })) || {};
    return list;
  }

  async getRefundDetail(shopId, orderId) {
    return await this.get({
      url: `${this.baseUrl}/shop/refund/detail`,
      data: { shopId, orderId },
      loadingTitle: "正在加载"
    });
  }
}

export default RefundService;
