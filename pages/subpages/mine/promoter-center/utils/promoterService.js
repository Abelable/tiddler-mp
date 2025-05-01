import { cleanObject } from "../../../../../utils/index";
import BaseService from "../../../../../services/baseService";

class PromoterService extends BaseService {
  async getCommissionTimeData(timeType, scene) {
    return await this.get({
      url: `${this.baseUrl}/commission/time_data`,
      data: cleanObject({ timeType, scene })
    });
  }

  async getTodayNewCustomerList() {
    return await this.get({
      url: `${this.baseUrl}/user/today_new_customer_list`
    });
  }

  async getTodayOrderingCustomerList() {
    return await this.get({
      url: `${this.baseUrl}/user/today_ordering_customer_list`
    });
  }
}

export default PromoterService;
