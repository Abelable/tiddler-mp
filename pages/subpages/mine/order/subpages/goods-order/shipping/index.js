import OrderService from "../../../utils/orderService";

const orderService = new OrderService();

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
    this.expressOptions = await orderService.getExpressOptions();
    this.setData({ expressOptions });
  },

  async setShippingInfo(shipCode, shipSn, mobile) {
    const traces = await orderService.getShippingInfo(shipCode, shipSn, mobile);
    this.setData({ traces });
  }
});
