import BaseService from "../../../../../services/baseService";

class AccountService extends BaseService {
  async getAccountInfo() {
    return await this.get({
      url: `${this.baseUrl}/account/info`,
    })
  }

  async getAccountChangeLogList(accountId, page, limit = 10) {
    const { list = [] } = await this.get({
      url: `${this.baseUrl}/account/change_log_list`,
      data: { accountId, page, limit },
      loadingTitle: "正在加载"
    });
    return list;
  }
}

export default AccountService;
