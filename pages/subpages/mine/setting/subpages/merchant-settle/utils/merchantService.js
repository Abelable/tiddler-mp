import SettingService from "../../../utils/settingService";

class MerchantService extends SettingService {
  async getTaskStatus(userId, taskId) {
    return await this.get({
      url: `${this.baseUrl}/task/status`,
      data: { userId, taskId }
    });
  }
}

export default MerchantService;
