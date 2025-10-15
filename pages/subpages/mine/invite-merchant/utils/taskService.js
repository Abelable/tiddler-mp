import MallService from "../../../mall/utils/mallService";

class TaskService extends MallService {
  async getTaskList(productType, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/task/list`,
      data: { status: 1, productType, page, limit },
      loadingTitle: "正在加载"
    });
  }

  async receiveTask(id, success) {
    return await this.post({
      url: `${this.baseUrl}/task/receive`,
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
}

export default TaskService;
