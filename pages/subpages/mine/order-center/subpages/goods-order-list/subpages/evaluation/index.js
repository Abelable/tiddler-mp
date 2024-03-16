Page({
  data: {
    goodsInfoList: [],
  },

  onLoad({ goodsInfoList, orderId }) {
    goodsInfoList = JSON.parse(goodsInfoList);
    this.setData({ goodsInfoList });
    this.orderId = orderId;
  },

  
});
