Page({
  data: {
    goodsList: [],
    score: 0,
  },

  onLoad({ goodsList, orderId }) {
    goodsList = JSON.parse(goodsList);
    this.setData({ goodsList });
    this.orderId = orderId;
  },

  setScore(e) {
    this.setData({ score: e.detail });
  },
});
