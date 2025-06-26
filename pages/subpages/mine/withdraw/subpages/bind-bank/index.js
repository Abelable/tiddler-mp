import WithdrawService from "../../utils/withdrawService";

const withdrawService = new WithdrawService();

Page({
  data: {
    name: "",
    code: "",
    bankName: ""
  },

  onLoad() {
    this.setBankCardInfo();
  },

  async setBankCardInfo() {
    const bancCardInfo = await withdrawService.getBankCardInfo();
    if (bancCardInfo) {
      const { id, name, code, bankName } = bancCardInfo;
      this.bancCardId = id;
      this.setData({ name, code, bankName });
    }
  },

  setName(e) {
    const name = e.detail.value;
    this.setData({ name });
  },

  setCode(e) {
    const code = e.detail.value;
    this.setData({ code });
  },

  setBankName(e) {
    const bankName = e.detail.value;
    this.setData({ bankName });
  },

  submit() {
    const { name, code, bankName } = this.data;
    if (name && code && bankName) {
      if (this.bancCardId) {
        withdrawService.editBankCard(name, code, bankName, () => {
          wx.showToast({
            title: "提交成功",
            icon: "none"
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        });
      } else {
        withdrawService.addBankCard(name, code, bankName, () => {
          wx.showToast({
            title: "提交成功",
            icon: "none"
          });
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        });
      }
    }
  }
});
