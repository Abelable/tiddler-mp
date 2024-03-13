import { cleanObject } from "../../../../../utils/index";
import MallService from "../../utils/mallService";

class ScenicService extends MallService {
  async getScenicCategoryOptions() {
    return await this.get({ url: `${this.baseUrl}/scenic/category_options` });
  }

  async getScenicList({ name, categoryId, sort, order, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/scenic/list`,
        data: cleanObject({ name, categoryId, sort, order, page, limit }),
        loadingTitle: "加载中...",
      })) || {};
    return list;
  }

  async getScenicInfo(id) {
    return await this.get({
      url: `${this.baseUrl}/scenic/detail`,
      data: { id },
      loadingTitle: "加载中...",
    });
  }

  async getTicketCategoryOptions() {
    return await this.get({
      url: `${this.baseUrl}/scenic/ticket/category_options`,
    });
  }

  async getScenicTicketList(scenicId) {
    return await this.get({
      url: `${this.baseUrl}/scenic/ticket/list_of_scenic`,
      data: { scenicId },
      loadingTitle: "加载中...",
    });
  }

  async getPaymentAmount(ticketId, categoryId, timeStamp, num) {
    return await this.get({
      url: `${this.baseUrl}/scenic/order/calc_payment_amount`,
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
      url: `${this.baseUrl}/scenic/order/submit`,
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

  async getScenicQaSummary() {
    return await this.get({
      url: `${this.baseUrl}/scenic/question/summary`,
      data: { scenicId },
    });
  }

  async getScenicQaList(scenicId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/scenic/question/list`,
      data: { scenicId, page, limit },
      loadingTitle: "加载中...",
    });
  }

  async addScenicQuestion(scenicId, content, success) {
    return await this.post({
      url: `${this.baseUrl}/scenic/question/add`,
      data: { scenicId, content },
      success,
    });
  }

  async deleteScenicQuestion(questionId, success) {
    return await this.post({
      url: `${this.baseUrl}/scenic/question/delete`,
      data: { questionId },
      success,
    });
  }

  async getScenicAnswerList(questionId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/scenic/answer/list`,
      data: { questionId, page, limit },
      loadingTitle: "加载中...",
    });
  }

  async addScenicAnswer(questionId, content, success) {
    return await this.post({
      url: `${this.baseUrl}/scenic/answer/add`,
      data: { questionId, content },
      success,
    });
  }

  async deleteScenicAnswer(questionId, answerId, success) {
    return await this.post({
      url: `${this.baseUrl}/scenic/answer/delete`,
      data: { questionId, answerId },
      success,
    });
  }
}

export default ScenicService;
