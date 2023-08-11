import { cleanObject } from "../../../../../utils/index";
import BaseService from "../../../../../services/baseService";

class HotelService extends BaseService {
  async getHotelCategoryOptions() {
    return await this.get({ url: `${this.baseUrl}/hotel/category_options` });
  }

  async getHotelList({ name, categoryId, sort, order, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/hotel/list`,
        data: cleanObject({ name, categoryId, sort, order, page, limit }),
        loadingTitle: "加载中...",
      })) || {};
    return list;
  }

  async getHotelInfo(id) {
    return await this.get({
      url: `${this.baseUrl}/hotel/detail`,
      data: { id },
      loadingTitle: "加载中...",
    });
  }

  async getTicketCategoryOptions() {
    return await this.get({
      url: `${this.baseUrl}/hotel/ticket/category_options`,
    });
  }

  async getHotelTicketList(hotelId) {
    return await this.get({
      url: `${this.baseUrl}/hotel/ticket/list_of_hotel`,
      data: { hotelId },
      loadingTitle: "加载中...",
    });
  }

  async getPaymentAmount(ticketId, categoryId, timeStamp, num) {
    return await this.get({
      url: `${this.baseUrl}/hotel/order/calc_payment_amount`,
      data: { ticketId, categoryId, timeStamp, num },
      loadingTitle: "加载中...",
    });
  }

  async submitOrder(
    ticketId,
    categoryId,
    timeStamp,
    num,
    consignee,
    mobile,
    idCardNumber
  ) {
    return await this.post({
      url: `${this.baseUrl}/hotel/order/submit`,
      data: {
        ticketId,
        categoryId,
        timeStamp,
        num,
        consignee,
        mobile,
        idCardNumber,
      },
      loadingTitle: "订单提交中...",
    });
  }
}

export default HotelService;
