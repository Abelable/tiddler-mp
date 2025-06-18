import AccountService from "./utils/accountService";

const accountService = new AccountService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    integerPart: "",
    floatPart: "",
    logList: [],
    finished: false
  },

  async onLoad() {
    await this.setAccountInfo();
    this.setLogList(true);
  },

  async setAccountInfo() {
    const { id, balance } = await accountService.getAccountInfo();
    this.accountId = id;
    const list = `${balance.toFixed(2)}`.split(".");
    this.setData({ integerPart: list[0], floatPart: list[1] });
  },

  async setLogList(init = false) {
    if (init) {
      this.page = 0;
      this.setData({ finished: false });
    }
    const { logList } = this.data;
    const list = await accountService.getAccountChangeLogList(
      this.accountId,
      ++this.page
    );
    this.setData({ logList: init ? list : [...logList, ...list] });
    if (list.length < 10) {
      this.setData({ finished: true });
    }
  },

  onReachBottom() {
    this.setLogList();
  }
});
