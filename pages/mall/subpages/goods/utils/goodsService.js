import { cleanObject } from '../../../../../utils/index'
import BaseService from '../../../../../services/baseService'

class GoodsService extends BaseService {
  async getGoodsCategoryOptions() {
    return await this.get({ url: `${this.baseUrl}/goods/category_options` })
  }

  async getGoodsList({ name, categoryId, sort, order, page, limit = 10 }) {
    const { list = [] } = await this.get({ 
      url: `${this.baseUrl}/goods/list`, 
      data: cleanObject({ name, categoryId, sort, order, page, limit }) ,
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

  async fastAddCart(goodsId, selectedSkuIndex, number) {
    return await this.post({
      url: `${this.baseUrl}/cart/fast_add`,
      data: { goodsId, selectedSkuIndex, number },
    })
  }

  async addCart(goodsId, selectedSkuIndex, number) {
    return await this.post({
      url: `${this.baseUrl}/cart/add`,
      data: { goodsId, selectedSkuIndex, number },
    })
  }

  async editCart(id, goodsId, selectedSkuIndex, number, success) {
    return await this.post({
      url: `${this.baseUrl}/cart/edit`,
      data: { id, goodsId, selectedSkuIndex, number },
      success
    })
  }

  async deleteCartList(ids, success) {
    return await this.post({
      url: `${this.baseUrl}/cart/delete`,
      data: { ids },
      success,
    })
  }

  async getPreOrderInfo(cartIds, addressId) {
    return await this.get({
      url: `${this.baseUrl}/order/pre_order_info`,
      data: cleanObject({ cartIds, addressId }),
    })
  }
}

export default GoodsService
