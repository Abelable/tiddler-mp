import { cleanObject } from "../../../../../utils/index";
import BaseService from "../../../../../services/baseService";

class CateringService extends BaseService {
  async getRestaurantCategoryOptions() {
    return await this.get({
      url: `${this.baseUrl}/catering/restaurant/category_options`,
    });
  }

  async getRestaurantList({ name, categoryId, sort, order, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/catering/restaurant/list`,
        data: cleanObject({ name, categoryId, sort, order, page, limit }),
        loadingTitle: "加载中...",
      })) || {};
    return list;
  }

  async getRestaurantInfo(id) {
    return await this.get({
      url: `${this.baseUrl}/catering/restaurant/detail`,
      data: { id },
      loadingTitle: "加载中...",
    });
  }

  async getRoomTypeOptions(hotelId) {
    return await this.get({
      url: `${this.baseUrl}/catering/restaurant/room/type_options`,
      data: { hotelId },
      loadingTitle: "加载中...",
    });
  }

  async getRestaurantRoomList(hotelId) {
    return await this.get({
      url: `${this.baseUrl}/catering/restaurant/room/list_of_hotel`,
      data: { hotelId },
      loadingTitle: "加载中...",
    });
  }

  async getMealTicketInfo(id) {
    return await this.get({
      url: `${this.baseUrl}/catering/meal_ticket/detail`,
      data: { id },
      loadingTitle: "加载中...",
    });
  }

  async getMealTicketPaymentAmount(ticketId, num) {
    return await this.get({
      url: `${this.baseUrl}/catering/meal_ticket/order/calc_payment_amount`,
      data: { ticketId, num },
      loadingTitle: "加载中...",
    });
  }

  async submitMealTicketOrder(restaurantId, restaurantName, ticketId, num) {
    return await this.post({
      url: `${this.baseUrl}/catering/meal_ticket/order/submit`,
      data: { restaurantId, restaurantName, ticketId, num },
      loadingTitle: "订单提交中...",
    });
  }
}

export default CateringService;
