import { cleanObject } from "../../../../../utils/index";
import BaseService from "../../../../../services/baseService";

class NewYearService extends BaseService {
  async getTaskList() {
    return await this.get({
      url: `${this.baseUrl}/activity/new_year/task_list`,
      loadingTitle: "正在加载"
    });
  }

  async getGoodsList() {
    return await this.get({
      url: `${this.baseUrl}/activity/new_year/goods_list`
    });
  }
}

export default NewYearService;
