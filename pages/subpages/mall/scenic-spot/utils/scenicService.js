import { cleanObject } from '../../../../../utils/index'
import BaseService from '../../../../../services/baseService'

class ScenicService extends BaseService {
  async getScenicCategoryOptions() {
    return await this.get({ url: `${this.baseUrl}/scenic/category_options` })
  }

  async getScenicList({ name, categoryId, sort, order, page, limit = 10 }) {
    const { list = [] } = await this.get({ 
      url: `${this.baseUrl}/scenic/list`, 
      data: cleanObject({ name, categoryId, sort, order, page, limit }) ,
      loadingTitle: '加载中...'
    }) || {}
    return list
  }

  async getScenicInfo(id) {
    return await this.get({
      url: `${this.baseUrl}/scenic/detail`,
      data: { id },
      loadingTitle: '加载中...'
    })
  }
}

export default ScenicService
