import CateringService from "../../../../utils/cateringService";

const cateringService = new CateringService();

Page({
  data: {
    setMealInfo: null,
    discount: 0,
    limitTips: "",
    useTimeDescList: [],
    inapplicableProductsDesc: "",
  },

  onLoad({ restaurantId, restaurantName, setMealId }) {
    this.restaurantId = restaurantId;
    this.restaurantName = restaurantName;
    this.setMealId = setMealId;

    wx.setNavigationBarTitle({
      title: restaurantName,
    });
    this.setSetMealInfo(setMealId);
  },

  async setSetMealInfo(id) {
    const setMealInfo = await cateringService.getSetMealInfo(id);
    const {
      price,
      originalPrice,
      buyLimit,
      perTableUsageLimit,
      overlayUsageLimit,
      useTimeList,
      inapplicableProducts,
    } = setMealInfo;

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
      setMealInfo,
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
    const url = `/pages/subpages/mall/catering/subpages/set-meal-order-check/index?setMealId=${this.setMealId}&restaurantId=${this.restaurantId}&restaurantName=${this.restaurantName}`;
    wx.navigateTo({ url });
  },
});
