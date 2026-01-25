import { store } from "../../../../store/index";
import WithdrawService from "./utils/withdrawService";

const withdrawService = new WithdrawService();

const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    navBarBgVisible: false,
    scene: 1, // 1，2，3-佣金提现；4，5，6，7-店铺收益提现；8-任务奖励提现；
    amount: 0,
    taxFee: 0,
    handlingFee: 0,
    actualAmount: 0,
    pathOptions: [],
    curOptionIdx: 0,
    bancCardInfo: null,
    remark: "",
    authModalVisible: false,
    btnActive: false
  },

  onLoad(options) {
    this.taskId = Number(options.taskId || 0);
    const scene = Number(options.scene);
    const amount = Number(options.amount);

    const taxFee = [2, 3, 8].includes(scene)
      ? Math.round(amount * 0.06 * 100) / 100
      : 0;
      
    // todo 除了商家收益外，都需要手续费
    const handlingFee = [1, 2, 3, 8].includes(scene)
      ? Math.round(amount * 0.006 * 100) / 100
      : 0;

    const actualAmount = Math.max(0, amount - taxFee - handlingFee);

    this.setData({
      scene,
      amount,
      taxFee,
      handlingFee,
      actualAmount,
      pathOptions: [4, 5, 6, 7].includes(scene)
        ? [{ cn: "银行卡（1~3个工作日到账）", en: "card", value: 2 }]
        : actualAmount >= 500
          ? [
              { cn: "余额（立即到账）", en: "balance", value: 3 },
              { cn: "银行卡（1~3个工作日到账）", en: "card", value: 2 }
            ]
          : [
              { cn: "余额（立即到账）", en: "balance", value: 3 },
              { cn: "微信（1~3个工作日到账）", en: "wx", value: 1 },
              { cn: "银行卡（1~3个工作日到账）", en: "card", value: 2 }
            ]
    });

    if (scene === 8) {
      this.setData({ btnActive: true });
    } else {
      const date = new Date().getDate();
      if (date >= 25 && amount > 1) {
        this.setData({ btnActive: true });
      }
    }
  },

  onShow() {
    this.setBankCardInfo();
    withdrawService.getUserInfo();
  },

  selectOption(e) {
    const curOptionIdx = e.currentTarget.dataset.index;
    this.setData({ curOptionIdx });
  },

  async setBankCardInfo() {
    let bankName, code;
    switch (this.data.scene) {
      case 4:
        ({ bankName, bankCardNumber: code } =
          await withdrawService.getScenicMerchantInfo());
        break;

      case 5:
        ({ bankName, bankCardNumber: code } =
          await withdrawService.getHotelMerchantInfo());
        break;

      case 6:
        ({ bankName, bankCardNumber: code } =
          await withdrawService.getCateringMerchantInfo());
        break;

      case 7:
        ({ bankName = "", bankCardNumber: code = "" } =
          (await withdrawService.getGoodsMerchantInfo()) || {});
        break;

      default:
        ({ bankName, code } = (await withdrawService.getBankCardInfo()) || {});
        break;
    }

    if (bankName) {
      this.setData({
        bancCardInfo: {
          bankName,
          code: `${code.slice(0, 5)}****${code.slice(-5)}`
        }
      });
    }
  },

  onPageScroll(e) {
    if (e.scrollTop >= 10) {
      if (!this.data.navBarBgVisible) {
        this.setData({ navBarBgVisible: true });
      }
    } else {
      if (this.data.navBarBgVisible) {
        this.setData({ navBarBgVisible: false });
      }
    }
  },

  bindBank() {
    wx.navigateTo({
      url: "./subpages/bind-bank/index"
    });
  },

  setRemark(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  withdraw() {
    const { btnActive, scene, amount, pathOptions, curOptionIdx, remark } =
      this.data;
    const path = pathOptions[curOptionIdx].value;

    if (!btnActive) {
      return;
    }
    if (path !== 3 && !store.userInfo.authInfoId) {
      this.setData({ authModalVisible: true });
      return;
    }

    if (scene <= 3) {
      withdrawService.applyCommissionWithdraw(
        { scene, amount, path, remark },
        this.withdrawSuccess
      );
    } else if (scene > 3 && scene <= 7) {
      withdrawService.applyIncomeWithdraw(
        { merchantType: scene - 3, amount, remark },
        this.withdrawSuccess
      );
    } else {
      withdrawService.applyRewardWithdraw(
        { taskId: this.taskId, amount, path, remark },
        this.withdrawSuccess
      );
    }
  },

  withdrawSuccess() {
    const { scene, curOptionIdx } = this.data;
    if (curOptionIdx === 0) {
      this.setData({ amount: 0 });
      wx.showToast({
        title: "已成功提现至我的余额",
        icon: "none"
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 2000);
    } else {
      wx.navigateTo({
        url: `./subpages/withdraw-result/index?scene=${scene}`
      });
    }
  },

  hideAuthModal() {
    this.setData({ authModalVisible: false });
  }
});
