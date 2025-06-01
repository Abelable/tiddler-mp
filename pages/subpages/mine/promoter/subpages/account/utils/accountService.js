import { cleanObject } from "../../../../../../../utils/index";
import PromoterService from "../../../utils/promoterService";

class AccountService extends PromoterService {
  async getCommissionCashInfo() {
    return await this.get({
      url: `${this.baseUrl}/commission/cash`
    });
  }

  async getCommissionOrderList({
    scene,
    timeType,
    statusList,
    page,
    limit = 10
  }) {
    const { list = [] } = await this.post({
      url: `${this.baseUrl}/commission/order_list`,
      data: cleanObject({ scene, timeType, statusList, page, limit }),
      loadingTitle: "加载中..."
    });
    return list;
  }

  async applyWithdraw({ scene, withdrawAmount, path, remark }, success) {
    await this.post({
      url: `${this.baseUrl}/withdraw/submit`,
      data: cleanObject({ scene, withdrawAmount, path, remark }),
      success
    })
  }

  async getBankCardInfo() {
    return await this.get({
      url: `${this.baseUrl}/bank_card/detail`
    });
  }

  async addBankCard(name, code, bankName, success) {
    return await this.post({
      url: `${this.baseUrl}/bank_card/add`,
      data: { name, code, bankName },
      success
    });
  }

  async editBankCard(name, code, bankName, success) {
    return await this.post({
      url: `${this.baseUrl}/bank_card/edit`,
      data: { name, code, bankName },
      success
    });
  }
}

export default AccountService;
