import { cleanObject } from "../../../../../utils/index";
import BaseService from "../../../../../services/baseService";

class PromoterService extends BaseService {
  complain(promoterId, optionIds, content, imageList, success) {
    return this.post({
      url: `${this.baseUrl}/promoter/complaint/submit`,
      data: cleanObject({ promoterId, optionIds, content, imageList }),
      success
    });
  }

  getQaSummary(promoterId) {
    return this.get({
      url: `${this.baseUrl}/promoter/qa/summary`,
      data: { promoterId }
    });
  }

  getQaList(promoterId, page, limit = 10) {
    return this.get({
      url: `${this.baseUrl}/promoter/qa/list`,
      data: { promoterId, page, limit },
      loadingTitle: "正在加载"
    });
  }

  submitQuestion(promoterId, content, success) {
    return this.post({
      url: `${this.baseUrl}/promoter/qa/add`,
      data: { promoterId, content },
      success
    });
  }

  answerQuestion(id, content, success) {
    return this.post({
      url: `${this.baseUrl}/promoter/qa/answer`,
      data: { id, content },
      success
    });
  }

  getEvaluationSummary(promoterId) {
    return this.get({
      url: `${this.baseUrl}/promoter/evaluation/summary`,
      data: { promoterId }
    });
  }

  getEvaluationList(promoterId, page, limit = 10) {
    return this.get({
      url: `${this.baseUrl}/promoter/evaluation/list`,
      data: { promoterId, page, limit },
      loadingTitle: "正在加载"
    });
  }

  evaluate(promoterId, score, tagIds, content, imageList, success) {
    return this.post({
      url: `${this.baseUrl}/promoter/evaluation/add`,
      data: cleanObject({ promoterId, score, tagIds, content, imageList }),
      success
    });
  }
}

export default PromoterService;
