import { cleanObject } from "../../../../../utils/index";
import BaseService from "../../../../../services/baseService";

class SettingService extends BaseService {
  async submitFeedback(content, imageList, mobile, success) {
    return await this.post({
      url: `${this.baseUrl}/feedback/submit`,
      data: cleanObject({
        content,
        imageList,
        mobile
      }),
      success
    });
  }
}

export default SettingService;
