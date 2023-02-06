import BaseService from '../../../../../services/baseService'

class GoodsService extends BaseService {
  async getGoodsCategoryOptions() {
    return await this.get({ url: `${this.baseUrl}/goods/category_options` })
  }

  async getGoodsList(categoryId, page, limit = 10) {
    const { list = [] } = await this.get({ url: `${this.baseUrl}/goods/list`, data: { categoryId, page, limit } }) || {}
    return list
  }
}

export default GoodsService
