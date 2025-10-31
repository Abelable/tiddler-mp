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

  getEvaluationSummary(promoterId) {
    return this.get({
      url: `${this.baseUrl}/promoter/evalution/summary`,
      data: { promoterId }
    });
  }

  getEvaluationList(promoterId, page, limit = 10) {
    return this.get({
      url: `${this.baseUrl}/promoter/evalution/list`,
      data: { promoterId, page, limit },
      loadingTitle: "正在加载"
    });
  }

  evaluate(promoterId, tagIds, score, content, imageList, success) {
    return this.post({
      url: `${this.baseUrl}/promoter/evalution/add`,
      data: cleanObject({ promoterId, tagIds, score, content, imageList }),
      success
    });
  }
}

export default PromoterService;
