import { cleanObject } from "../../../../../utils/index";
import BaseService from "../../../../../services/baseService";

class CateringService extends BaseService {
  async getRestaurantCategoryOptions() {
    return await this.get({ url: `${this.baseUrl}/catering/restaurant/category_options` });
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

  async getPaymentAmount(roomId, checkInDate, checkOutDate, num) {
    return await this.get({
      url: `${this.baseUrl}/catering/restaurant/order/calc_payment_amount`,
      data: { roomId, checkInDate, checkOutDate, num },
      loadingTitle: "加载中...",
    });
  }

  async submitOrder(roomId, checkInDate, checkOutDate, num, consignee, mobile) {
    return await this.post({
      url: `${this.baseUrl}/catering/restaurant/order/submit`,
      data: {
        roomId,
        checkInDate,
        checkOutDate,
        num,
        consignee,
        mobile,
      },
      loadingTitle: "订单提交中...",
    });
  }
}

export default CateringService;
