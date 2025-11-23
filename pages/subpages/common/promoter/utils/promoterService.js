import { cleanObject } from "../../../../../utils/index";
import BaseService from "../../../../../services/baseService";

class PromoterService extends BaseService {
  async complain(promoterId, optionIds, content, imageList, success) {
    return await this.post({
      url: `${this.baseUrl}/promoter/complaint/submit`,
      data: cleanObject({ promoterId, optionIds, content, imageList }),
      success
    });
  }

  async getQaSummary(promoterId) {
    return await this.get({
      url: `${this.baseUrl}/promoter/qa/summary`,
      data: { promoterId }
    });
  }

  async getQaList(promoterId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/promoter/qa/list`,
      data: { promoterId, page, limit },
      loadingTitle: "正在加载"
    });
  }

  async submitQuestion(promoterId, content, success) {
    return await this.post({
      url: `${this.baseUrl}/promoter/qa/add`,
      data: { promoterId, content },
      success
    });
  }

  async answerQuestion(id, content, success) {
    return await this.post({
      url: `${this.baseUrl}/promoter/qa/answer`,
      data: { id, content },
      success
    });
  }

  async getEvaluationSummary(promoterId) {
    return await this.get({
      url: `${this.baseUrl}/promoter/evaluation/summary`,
      data: { promoterId }
    });
  }

  async getEvaluationList(promoterId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/promoter/evaluation/list`,
      data: { promoterId, page, limit },
      loadingTitle: "正在加载"
    });
  }

  async evaluate(promoterId, score, tagIds, content, imageList, success) {
    return await this.post({
      url: `${this.baseUrl}/promoter/evaluation/add`,
      data: cleanObject({ promoterId, score, tagIds, content, imageList }),
      success
    });
  }
}

export default PromoterService;
