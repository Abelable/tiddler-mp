import { cleanObject } from "../../../../../utils/index";
import BaseService from "../../../../../services/baseService";

class WithdrawService extends BaseService {
  async applyCommissionWithdraw({ scene, amount, path, remark }, success) {
    await this.post({
      url: `${this.baseUrl}/withdraw/commission/submit`,
      data: cleanObject({ scene, amount, path, remark }),
      success
    });
  }

  async applyIncomeWithdraw({ merchantType, amount, path, remark }, success) {
    await this.post({
      url: `${this.baseUrl}/withdraw/income/submit`,
      data: cleanObject({ merchantType, amount, path, remark }),
      success
    });
  }

  async applyRewardWithdraw({ taskId, amount, path, remark }, success) {
    await this.post({
      url: `${this.baseUrl}/withdraw/reward/submit`,
      data: cleanObject({ taskId, amount, path, remark }),
      success
    });
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
