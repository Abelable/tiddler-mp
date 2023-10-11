import CateringService from "../../../../utils/cateringService";

const cateringService = new CateringService();

Page({
  data: {
    restaurantName: "",
    ticketInfo: null,
    discount: 0,
    limitTips: "",
    useTimeDescList: [],
    inapplicableProductsDesc: "",
  },

  onLoad({ restaurantId, restaurantName, ticketId }) {
    this.restaurantId = restaurantId;
    this.restaurantName = restaurantName;
    this.ticketId = ticketId;
    this.setData({ restaurantName });
    this.setMealTicketInfo(ticketId);
  },

  async setMealTicketInfo(id) {
    const ticketInfo = await cateringService.getMealTicketInfo(id);
    const {
      price,
      originalPrice,
      buyLimit,
      perTableUsageLimit,
      overlayUsageLimit,
      useTimeList,
      inapplicableProducts,
    } = ticketInfo;

    const discount = parseFloat(((price / originalPrice) * 10).toFixed(1));

    const limitTipList = [];
    if (buyLimit) {
      limitTipList.push(`每人每日限购${buyLimit}张`);
    }
    if (perTableUsageLimit) {
      limitTipList.push(`每桌限用${buyLimit}张`);
    }
    if (overlayUsageLimit) {
      limitTipList.push(`单次可用${buyLimit}张`);
    }

    this.setUseTimeDescList(useTimeList);

    this.setData({
      ticketInfo,
      discount,
      limitTips: limitTipList.join("，"),
      inapplicableProductsDesc: inapplicableProducts.join("、"),
    });
  },

  setUseTimeDescList(useTimeList) {
    const useTimeDescList = useTimeList.map((time) => {
      const startWeekDay = weekDayList.find(
        (week) => week.value == time.startWeekDay
      ).text;
      const endWeekDay = weekDayList.find(
        (week) => week.value == time.endWeekDay
      ).text;
      const timeFrameDesc = time.timeFrameList
        .map((timeFrame) => `${timeFrame.openTime}-${timeFrame.closeTime}`)
        .join();
      return `${startWeekDay}至${endWeekDay}: ${timeFrameDesc}`;
    });

    this.setData({ useTimeDescList });
  },

  buy() {
    const url = `/pages/subpages/mall/catering/subpages/order-check/index?ticketId=${this.ticketId}&restaurantId=${this.restaurantId}&restaurantName=${this.restaurantName}`;
    wx.navigateTo({ url });
  },
});
