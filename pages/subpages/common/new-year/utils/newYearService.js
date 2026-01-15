import { cleanObject } from "../../../../../utils/index";
import BaseService from "../../../../../services/baseService";

class NewYearService extends BaseService {
  async getTaskList() {
    return await this.get({
      url: `${this.baseUrl}/activity/new_year/task_list`,
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

export default NewYearService;
