import BaseService from "../../../../services/baseService";

const baseService = new BaseService();

Page({
  data: {
    shipChannel: "",
    shipSn: "",
    traces: []
  },

  async onLoad({ shipCode, shipSn, mobile }) {
    await this.setExpressOptions();
    const shipChannel = this.expressOptions.find(
      item => item.value === shipCode
    ).name;
    this.setData({ shipChannel, shipSn });
    this.setShippingInfo(shipCode, shipSn, mobile);
  },

  async setExpressOptions() {
    this.expressOptions = await baseService.getExpressOptions();
    this.setData({ expressOptions });
  },

  async setShippingInfo(shipCode, shipSn, mobile) {
    const traces = await baseService.getShippingInfo(shipCode, shipSn, mobile);
    this.setData({ traces });
  }
});
