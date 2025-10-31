import { cleanObject } from "../../../../../utils/index";
import BaseService from "../../../../../services/baseService";

class PromoterService extends BaseService {
  complain(promoterId, optionIds, content, imageList, success) {
    return this.post({
      url: `${this.baseUrl}/promoter/complaint/submit`,
      data: cleanObject({ promoterId, optionIds, content, imageList }),
      success
    });
  }
}

export default PromoterService;
