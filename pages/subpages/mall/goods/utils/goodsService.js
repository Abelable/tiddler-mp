import { cleanObject } from "../../../../../utils/index";
import MallService from "../../utils/mallService";

class GoodsService extends MallService {
  async getGoodsList({ shopCategoryId, categoryId, sort, order, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/goods/list`,
        data: cleanObject({ shopCategoryId, categoryId, sort, order, page, limit }),
      })) || {};
    return list;
  }

  async getPurchasedGoodsList(goodsId, scene = 1) {
    return await this.get({
      url: `${this.baseUrl}/goods/purchased_list`,
      data: { goodsId, scene }
    });
  }

  async getGoodsInfo(id, addressId) {
    return await this.get({
      url: `${this.baseUrl}/goods/detail`,
      data: cleanObject({ id, addressId }),
    });
  }

  async getGoodsEvaluationSummary(goodsId) {
    return await this.get({
      url: `${this.baseUrl}/goods/evaluation/summary`,
      data: { goodsId },
    });
  }

  async getShopInfo(id) {
    return await this.get({
      url: `${this.baseUrl}/shop/info`,
      data: { id },
    });
  }

  async getShopGoodsList(shopId, page, limit = 10) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/goods/shop_list`,
        data: { shopId, page, limit },
      })) || {};
    return list;
  }

  async getCartGoodsNumber() {
    return await this.get({ url: `${this.baseUrl}/cart/goods_number` });
  }

  async getCartList() {
    return await this.get({
      url: `${this.baseUrl}/cart/list`,
      loadingTitle: "加载中...",
    });
  }

  async fastAddCart(goodsId, selectedSkuIndex, number) {
    return await this.post({
      url: `${this.baseUrl}/cart/fast_add`,
      data: { goodsId, selectedSkuIndex, number },
    });
  }

  async addCart(goodsId, selectedSkuIndex, number) {
    return await this.post({
      url: `${this.baseUrl}/cart/add`,
      data: { goodsId, selectedSkuIndex, number },
    });
  }

  async editCart(id, goodsId, selectedSkuIndex, number, success) {
    return await this.post({
      url: `${this.baseUrl}/cart/edit`,
      data: { id, goodsId, selectedSkuIndex, number },
      success,
    });
  }

  async deleteCartList(ids, success) {
    return await this.post({
      url: `${this.baseUrl}/cart/delete`,
      data: { ids },
      success,
    });
  }

  async getPickupAddressList(cartGoodsId) {
    return await this.get({
      url: `${this.baseUrl}/order/pickup_address_list`,
      data: { cartGoodsId },
      loadingTitle: "加载中..."
    });
  }

  async getPreOrderInfo(
    deliveryMode,
    cartGoodsIds,
    addressId,
    useBalance = false
  ) {
    return await this.post({
      url: `${this.baseUrl}/order/pre_order_info`,
      data: cleanObject({
        deliveryMode,
        cartGoodsIds,
        addressId,
        useBalance
      })
    });
  }

  async submitOrder({
    deliveryMode,
    addressId = "",
    pickupAddressId = "",
    pickupTime = "",
    pickupMobile = "",
    cartGoodsIds,
    useBalance
  }) {
    return await this.post({
      url: `${this.baseUrl}/order/submit`,
      data: cleanObject({
        deliveryMode,
        addressId,
        pickupAddressId,
        pickupTime,
        pickupMobile,
        cartGoodsIds,
        useBalance
      }),
      loadingTitle: "订单提交中..."
    });
  }

  async getGoodsEvaluationList(goodsId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/goods/evaluation/list`,
      data: { goodsId, page, limit },
      loadingTitle: "加载中...",
    });
  }
}

export default GoodsService;
