import { cleanObject } from "../../../../../utils/index";
import BaseService from "../../../../../services/baseService";

class PromoterService extends BaseService {
  async getCommissionTimeData(timeType, scene) {
    return await this.get({
      url: `${this.baseUrl}/commission/time_data`,
      data: cleanObject({ timeType, scene })
    });
  }
}

export default PromoterService;
