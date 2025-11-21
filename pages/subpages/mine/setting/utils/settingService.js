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

  async setPassword(password, success) {
    return await this.post({
      url: `${this.baseUrl}/auth/set_password`,
      data: { password },
      success
    });
  }

  async resetPassword(password, newPassword, success) {
    return await this.post({
      url: `${this.baseUrl}/auth/reset_password`,
      data: { password, newPassword },
      success
    });
  }
}

export default SettingService;
