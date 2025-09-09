import { cleanObject } from "../../../../../utils/index";
import MallService from "../../utils/mallService";

class ScenicService extends MallService {
  async getScenicCategoryOptions() {
    return await this.get({ url: `${this.baseUrl}/scenic/category_options` });
  }

  async getScenicList({ keywords, categoryId, sort, order, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/scenic/list`,
        data: cleanObject({ keywords, categoryId, sort, order, page, limit }),
        loadingTitle: "加载中"
      })) || {};
    return list;
  }

  async getTicketCategoryOptions() {
    return await this.get({
      url: `${this.baseUrl}/scenic/ticket/category_options`
    });
  }

  async getScenicTicketList(scenicId) {
    return await this.get({
      url: `${this.baseUrl}/scenic/ticket/list`,
      data: { scenicId },
    });
  }

  async getPaymentAmount(ticketId, categoryId, timeStamp, num) {
    return await this.get({
      url: `${this.baseUrl}/scenic/order/payment_amount`,
      data: { ticketId, categoryId, timeStamp, num },
      loadingTitle: "加载中"
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
        idCardNumber
      },
      loadingTitle: "订单提交中"
    });
  }

  async getScenicQaSummary(scenicId) {
    return await this.get({
      url: `${this.baseUrl}/scenic/question/summary`,
      data: { scenicId }
    });
  }

  async getScenicQaList(scenicId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/scenic/question/list`,
      data: { scenicId, page, limit },
      loadingTitle: "加载中"
    });
  }

  async addScenicQuestion(scenicId, content, success) {
    return await this.post({
      url: `${this.baseUrl}/scenic/question/add`,
      data: { scenicId, content },
      success
    });
  }

  async deleteScenicQuestion(questionId, success) {
    return await this.post({
      url: `${this.baseUrl}/scenic/question/delete`,
      data: { questionId },
      success
    });
  }

  async getScenicAnswerList(questionId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/scenic/answer/list`,
      data: { questionId, page, limit },
      loadingTitle: "加载中"
    });
  }

  async addScenicAnswer(questionId, content, success) {
    return await this.post({
      url: `${this.baseUrl}/scenic/answer/add`,
      data: { questionId, content },
      success
    });
  }

  async deleteScenicAnswer(questionId, answerId, success) {
    return await this.post({
      url: `${this.baseUrl}/scenic/answer/delete`,
      data: { questionId, answerId },
      success
    });
  }

  async getScenicEvaluationList(scenicId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/scenic/evaluation/list`,
      data: { scenicId, page, limit },
      loadingTitle: "加载中"
    });
  }
}

export default ScenicService;
