import { cleanObject } from "../../../../../utils/index";
import BaseService from "../../../../../services/baseService";

class PromoterService extends BaseService {
  async getPromoterAchievement() {
    return await this.get({
      url: `${this.baseUrl}/commission/achievement`
    });
  }

  async getCommissionSumInfo() {
    return await this.get({
      url: `${this.baseUrl}/commission/sum`
    });
  }

  async getCommissionTimeData(timeType, scene) {
    return await this.get({
      url: `${this.baseUrl}/commission/time_data`,
      data: cleanObject({ timeType, scene })
    });
  }

  async getCustomerData() {
    return await this.get({
      url: `${this.baseUrl}/promoter/customer_data`
    });
  }

  async getTodayNewCustomerList() {
    return await this.get({
      url: `${this.baseUrl}/promoter/today_new_customer_list`
    });
  }

  async getTodayOrderingCustomerList() {
    return await this.get({
      url: `${this.baseUrl}/promoter/today_ordering_customer_list`
    });
  }

  async getCustomerList({ keywords, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/promoter/customer_list`,
        data: cleanObject({ keywords, page, limit }),
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }
}

export default PromoterService;
