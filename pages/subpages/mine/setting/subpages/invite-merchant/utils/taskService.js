import SettingService from "../../../utils/settingService";

class TaskService extends SettingService {
  async getTaskList(productType, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/task/list`,
      data: { status: 1, productType, page, limit },
      loadingTitle: "正在加载"
    });
  }

  async pickTask(id, success) {
    return await this.post({
      url: `${this.baseUrl}/task/pick`,
      data: { id },
      success
    });
  }

  async cancelTask(id, success) {
    return await this.post({
      url: `${this.baseUrl}/task/cancel`,
      data: { id },
      success
    });
  }

  async getUserTaskData() {
    return await this.get({
      url: `${this.baseUrl}/task/user_data`
    });
  }

  async getUserTaskList(status, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/task/user_list`,
      data: { status, page, limit },
      loadingTitle: "正在加载"
    });
  }

  async getTaskDetail(id) {
    return await this.get({
      url: `${this.baseUrl}/task/detail`,
      data: { id },
      loadingTitle: "正在加载"
    });
  }
}

export default TaskService;
