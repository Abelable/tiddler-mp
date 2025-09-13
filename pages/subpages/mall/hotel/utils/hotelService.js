import { cleanObject } from "../../../../../utils/index";
import MallService from "../../utils/mallService";

class HotelService extends MallService {
  async getHotelCategoryOptions() {
    return await this.get({ url: `${this.baseUrl}/hotel/category_options` });
  }

  async getHotelList({ keywords, categoryId, sort, order, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/hotel/list`,
        data: cleanObject({ keywords, categoryId, sort, order, page, limit }),
        loadingTitle: "正在加载",
      })) || {};
    return list;
  }

  async getRoomTypeOptions(hotelId) {
    return await this.get({
      url: `${this.baseUrl}/hotel/room/type_options`,
      data: { hotelId },
    });
  }

  async getHotelRoomList(hotelId) {
    return await this.get({
      url: `${this.baseUrl}/hotel/room/list`,
      data: { hotelId },
    });
  }

  async getPaymentAmount(roomId, checkInDate, checkOutDate, num) {
    return await this.get({
      url: `${this.baseUrl}/hotel/order/payment_amount`,
      data: { roomId, checkInDate, checkOutDate, num },
      loadingTitle: "正在加载",
    });
  }

  async submitOrder(roomId, checkInDate, checkOutDate, num, consignee, mobile) {
    return await this.post({
      url: `${this.baseUrl}/hotel/order/submit`,
      data: {
        roomId,
        checkInDate,
        checkOutDate,
        num,
        consignee,
        mobile,
      },
      loadingTitle: "订单提交中",
    });
  }

  async getHotelQaSummary(hotelId) {
    return await this.get({
      url: `${this.baseUrl}/hotel/question/summary`,
      data: { hotelId },
    });
  }

  async getHotelQaList(hotelId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/hotel/question/list`,
      data: { hotelId, page, limit },
      loadingTitle: "正在加载",
    });
  }

  async addHotelQuestion(hotelId, content, success) {
    return await this.post({
      url: `${this.baseUrl}/hotel/question/add`,
      data: { hotelId, content },
      success,
    });
  }

  async deleteHotelQuestion(questionId, success) {
    return await this.post({
      url: `${this.baseUrl}/hotel/question/delete`,
      data: { questionId },
      success,
    });
  }

  async getHotelAnswerList(questionId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/hotel/answer/list`,
      data: { questionId, page, limit },
      loadingTitle: "正在加载",
    });
  }

  async addHotelAnswer(questionId, content, success) {
    return await this.post({
      url: `${this.baseUrl}/hotel/answer/add`,
      data: { questionId, content },
      success,
    });
  }

  async deleteHotelAnswer(questionId, answerId, success) {
    return await this.post({
      url: `${this.baseUrl}/hotel/answer/delete`,
      data: { questionId, answerId },
      success,
    });
  }

  async getHotelEvaluationList(hotelId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/hotel/evaluation/list`,
      data: { hotelId, page, limit },
      loadingTitle: "正在加载",
    });
  }
}

export default HotelService;
