import { cleanObject } from "../../../../../../../utils/index";
import PromoterService from "../../../utils/promoterService";

class AccountService extends PromoterService {
  async getCommissionCashInfo() {
    return await this.get({
      url: `${this.baseUrl}/commission/cash`
    });
  }

  async getCommissionOrderList({
    scene,
    timeType,
    statusList,
    page,
    limit = 10
  }) {
    const { list = [] } = await this.post({
      url: `${this.baseUrl}/commission/order_list`,
      data: cleanObject({ scene, timeType, statusList, page, limit }),
      loadingTitle: "加载中"
    });
    return list;
  }
}

export default AccountService;
