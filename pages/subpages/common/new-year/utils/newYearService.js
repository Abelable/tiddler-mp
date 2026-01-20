import BaseService from "../../../../../services/baseService";

class NewYearService extends BaseService {
  async getPrizeList() {
    return await this.get({
      url: `${this.baseUrl}/activity/new_year/prize_list`
    });
  }

  async getGoodsList() {
    return await this.get({
      url: `${this.baseUrl}/activity/new_year/goods_list`
    });
  }

  async getTaskList() {
    return await this.get({
      url: `${this.baseUrl}/activity/new_year/task_list`,
      loadingTitle: "正在加载"
    });
  }

  async getLuckScore() {
    return await this.get({
      url: `${this.baseUrl}/activity/new_year/luck_score`
    });
  }

  async getLuckList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/activity/new_year/luck_list`,
      data: { page, limit },
      loadingTitle: "正在加载"
    });
  }

   async draw() {
    return await this.post({
      url: `${this.baseUrl}/activity/new_year/draw`
    });
  }

  async getUserPrizeList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/activity/new_year/user_prize_list`,
      data: { page, limit },
      loadingTitle: "正在加载"
    });
  }
}

export default NewYearService;
