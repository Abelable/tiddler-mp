import BaseService from "../../../../../services/baseService";

class AccountService extends BaseService {
  async getAccountInfo() {
    return await this.get({
      url: `${this.baseUrl}/account/info`,
    })
  }

  async getTransactionRecordList(accountId, page, limit = 10) {
    const { list = [] } = await this.get({
      url: `${this.baseUrl}/account/transaction_record_list`,
      data: { accountId, page, limit },
      loadingTitle: "加载中..."
    });
    return list;
  }
}

export default AccountService;
