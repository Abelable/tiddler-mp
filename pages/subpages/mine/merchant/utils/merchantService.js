import BaseService from "../../../../../services/baseService";

class MerchantService extends BaseService {
  getShopIncomeOverview(shopId) {
    return this.get({
      url: `${this.baseUrl}/shop/income/data_overview`,
      data: { shopId }
    });
  }

  getShopIncomeSum(shopId) {
    return this.get({
      url: `${this.baseUrl}/shop/income/sum`,
      data: { shopId }
    });
  }

  getShopTimeData(shopId, timeType) {
    return this.get({
      url: `${this.baseUrl}/shop/income/time_data`,
      data: { shopId, timeType }
    });
  }

  async getShopIncomeOrderList({
    shopId,
    timeType,
    statusList,
    page,
    limit = 10
  }) {
    const { list = [] } = await this.post({
      url: `${this.baseUrl}/shop/income/order_list`,
      data: { shopId, timeType, statusList, page, limit },
      loadingTitle: "加载中..."
    });
    return list;
  }

  async getMealTicketOrderList({ status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/catering/meal_ticket/order/provider_list`,
        data: { status, page, limit },
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }

  async getMealTicketOrderDetail(id) {
    return await this.get({
      url: `${this.baseUrl}/catering/meal_ticket/order/detail`,
      data: { id },
      loadingTitle: "加载中..."
    });
  }

  async cancelMealTicketOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/catering/meal_ticket/order/cancel`,
      data: { id },
      success
    });
  }

  async publishMealTicketComment(
    order_id,
    comment_type,
    commentLists,
    success
  ) {
    return await this.post({
      url: `${this.baseUrl}/catering/meal_ticket/order/comment`,
      data: { order_id, comment_type, json_data: JSON.stringify(commentLists) },
      success,
      loadingTitle: "发布中..."
    });
  }

  async getSetMealOrderList({ status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/catering/set_meal/order/provider_list`,
        data: { status, page, limit },
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }

  async getSetMealOrderDetail(id) {
    return await this.get({
      url: `${this.baseUrl}/catering/set_meal/order/detail`,
      data: { id },
      loadingTitle: "加载中..."
    });
  }

  async cancelSetMealOrder(id, success) {
    await this.post({
      url: `${this.baseUrl}/catering/set_meal/order/cancel`,
      data: { id },
      success
    });
  }

  async publishSetMealComment(order_id, comment_type, commentLists, success) {
    return await this.post({
      url: `${this.baseUrl}/catering/set_meal/order/comment`,
      data: { order_id, comment_type, json_data: JSON.stringify(commentLists) },
      success,
      loadingTitle: "发布中..."
    });
  }
}

export default MerchantService;
