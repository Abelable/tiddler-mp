import BaseService from '../../../../../services/baseService'

class GoodsService extends BaseService {
  async getGoodsCategoryOptions() {
    return await this.get({ url: `${this.baseUrl}/goods/category_options` })
  }

  async getGoodsList(categoryId, page, limit = 10) {
    const { list = [] } = await this.get({ 
      url: `${this.baseUrl}/goods/list`, 
      data: { categoryId, page, limit },
      loadingTitle: '加载中...'
    }) || {}
    return list
  }

  async getGoodsInfo(id) {
    return await this.get({
      url: `${this.baseUrl}/goods/detail`,
      data: { id },
      loadingTitle: '加载中...'
    })
  }

  async getShopInfo(id) {
    return await this.get({
      url: `${this.baseUrl}/shop/info`,
      data: { id },
    })
  }

  async getShopGoodsList(shopId, page, limit = 10) {
    const { list = [] } = await this.get({ 
      url: `${this.baseUrl}/shop/goods_list`, 
      data: { shopId, page, limit },
      loadingTitle: '加载中...'
    }) || {}
    return list
  }

  async getCartGoodsNumber() {
    return await this.get({ url: `${this.baseUrl}/cart/goods_number` })
  }

  async getCartList() {
    return await this.get({
      url: `${this.baseUrl}/cart/list`,
      loadingTitle: "加载中..."
    })
  }

  async addCart(goodsId, selectedSkuIndex, number) {
    return await this.post({
      url: `${this.baseUrl}/cart/add`,
      data: { goodsId, selectedSkuIndex, number }
    })
  }
}

export default GoodsService
