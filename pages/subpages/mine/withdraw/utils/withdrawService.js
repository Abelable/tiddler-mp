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

  async commissionTransferSuccess(
    { outBillNo, scene, amount, path, remark },
    success
  ) {
    await this.post({
      url: `${this.baseUrl}/withdraw/commission/transfer_success`,
      data: cleanObject({ outBillNo, scene, amount, path, remark }),
      success
    });
  }

  async commissionTransferFail(outBillNo, reason) {
    await this.post({
      url: `${this.baseUrl}/withdraw/commission/transfer_fail`,
      data: cleanObject({ outBillNo, reason })
    });
  }

  async applyIncomeWithdraw({ merchantType, amount, remark }, success) {
    await this.post({
      url: `${this.baseUrl}/withdraw/income/submit`,
      data: cleanObject({ merchantType, amount, remark }),
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

  async rewardTransferSuccess(
    { outBillNo, taskId, amount, path, remark },
    success
  ) {
    await this.post({
      url: `${this.baseUrl}/withdraw/reward/transfer_success`,
      data: cleanObject({ outBillNo, taskId, amount, path, remark }),
      success
    });
  }

  async rewardTransferFail(outBillNo, reason) {
    await this.post({
      url: `${this.baseUrl}/withdraw/reward/transfer_fail`,
      data: cleanObject({ outBillNo, reason })
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

  async getScenicMerchantInfo() {
    return await this.get({
      url: `${this.baseUrl}/scenic/merchant/info`
    });
  }

  async getHotelMerchantInfo() {
    return await this.get({
      url: `${this.baseUrl}/hotel/merchant/info`
    });
  }

  async getCateringMerchantInfo() {
    return await this.get({
      url: `${this.baseUrl}/catering/merchant/info`
    });
  }

  async getGoodsMerchantInfo() {
    return await this.get({
      url: `${this.baseUrl}/merchant/info`
    });
  }
}

export default WithdrawService;
