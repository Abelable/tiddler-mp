import { cleanObject } from "../../../../../utils/index";
import BaseService from "../../../../../services/baseService";

class WithdrawService extends BaseService {
  async applyWithdraw({ scene, withdrawAmount, path, remark }, success) {
    await this.post({
      url: `${this.baseUrl}/commission/withdraw/submit`,
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

export default WithdrawService;
