import BaseService from '../../../../../services/baseService'
import { cleanObject } from '../../../../../utils/index'

class SettingService extends BaseService {
  async editUserInfo(userInfo, success) {
    return await this.post({ 
      url: `${this.baseUrl}/user/user_info_update`, 
      data: cleanObject(userInfo),
      success
    })
  }
}

export default SettingService
