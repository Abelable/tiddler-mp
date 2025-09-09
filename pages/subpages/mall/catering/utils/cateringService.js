import { cleanObject } from "../../../../../utils/index";
import MallService from "../../utils/mallService";

class CateringService extends MallService {
  async getRestaurantCategoryOptions() {
    return await this.get({
      url: `${this.baseUrl}/catering/restaurant/category_options`,
    });
  }

  async getRestaurantList({ keywords, categoryId, sort, order, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/catering/restaurant/list`,
        data: cleanObject({ keywords, categoryId, sort, order, page, limit }),
        loadingTitle: "加载中",
      })) || {};
    return list;
  }

  async getRoomTypeOptions(cateringId) {
    return await this.get({
      url: `${this.baseUrl}/catering/restaurant/room/type_options`,
      data: { cateringId },
    });
  }

  async getRestaurantRoomList(cateringId) {
    return await this.get({
      url: `${this.baseUrl}/catering/restaurant/room/list_of_catering`,
      data: { cateringId },
    });
  }

  async getMealTicketInfo(id) {
    return await this.get({
      url: `${this.baseUrl}/catering/meal_ticket/detail`,
      data: { id },
    });
  }

  async getSetMealInfo(id) {
    return await this.get({
      url: `${this.baseUrl}/catering/set_meal/detail`,
      data: { id },
    });
  }

  async getMealTicketPaymentAmount(ticketId, num) {
    return await this.get({
      url: `${this.baseUrl}/catering/meal_ticket/order/payment_amount`,
      data: { ticketId, num },
      loadingTitle: "加载中",
    });
  }

  async submitMealTicketOrder(restaurantId, restaurantName, ticketId, num) {
    return await this.post({
      url: `${this.baseUrl}/catering/meal_ticket/order/submit`,
      data: { restaurantId, restaurantName, ticketId, num },
      loadingTitle: "订单提交中",
    });
  }

  async getSetMealPaymentAmount(setMealId, num) {
    return await this.get({
      url: `${this.baseUrl}/catering/set_meal/order/payment_amount`,
      data: { setMealId, num },
      loadingTitle: "加载中",
    });
  }

  async submitSetMealOrder(restaurantId, restaurantName, setMealId, num) {
    return await this.post({
      url: `${this.baseUrl}/catering/set_meal/order/submit`,
      data: { restaurantId, restaurantName, setMealId, num },
      loadingTitle: "订单提交中",
    });
  }

  async getCateringQaList(restaurantId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/catering/question/list`,
      data: { restaurantId, page, limit },
      loadingTitle: "加载中",
    });
  }

  async addCateringQuestion(restaurantId, content, success) {
    return await this.post({
      url: `${this.baseUrl}/catering/question/add`,
      data: { restaurantId, content },
      success,
    });
  }

  async deleteCateringQuestion(questionId, success) {
    return await this.post({
      url: `${this.baseUrl}/catering/question/delete`,
      data: { questionId },
      success,
    });
  }

  async getCateringAnswerList(questionId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/catering/answer/list`,
      data: { questionId, page, limit },
      loadingTitle: "加载中",
    });
  }

  async addCateringAnswer(questionId, content, success) {
    return await this.post({
      url: `${this.baseUrl}/catering/answer/add`,
      data: { questionId, content },
      success,
    });
  }

  async deleteCateringAnswer(questionId, answerId, success) {
    return await this.post({
      url: `${this.baseUrl}/catering/answer/delete`,
      data: { questionId, answerId },
      success,
    });
  }

  async getEvaluationList(restaurantId, page, limit) {
    return await this.get({
      url: `${this.baseUrl}/catering/evaluation/list`,
      data: { restaurantId, page, limit },
    });
  }
}

export default CateringService;
