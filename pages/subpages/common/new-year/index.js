import NewYearService from "./utils/newYearService";

const newYearService = new NewYearService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    showBg: false,
    press: false,
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    timer: null,
    prizeList: [],
    renderList: [],
    translateX: 0,
    listWidth: 0,
    startX: 0,
    startTranslateX: 0,
    goodsList: [],
    partters: [
      { logo: "qdnp" },
      { logo: "qdlw" },
      { logo: "qdcy" },
      { logo: "klj" },
      { logo: "yj" },
      { logo: "" },
      { logo: "" },
      { logo: "" },
      { logo: "" }
    ],
    luckPopupVisible: false,
    taskPopupVisible: false,
    prizePopupVisible: false
  },

  async onLoad() {
    this.updateCountDown();
    const timer = setInterval(this.updateCountDown.bind(this), 1000);
    this.setData({ timer });

    this.setGoodsList();
    await this.setPrizeList();
    this.calcListWidth();
  },

  async setPrizeList() {
    const list = await newYearService.getPrizeList();

    const prizeList = [
      ...list,
      {
        cover: "https://static.tiddler.cn/mp/new_year/thanks.webp",
        name: "谢谢参与"
      }
    ];

    this.setData({
      prizeList,
      renderList: prizeList.concat(prizeList, prizeList)
    });

    wx.nextTick(() => {
      this.calcListWidth();
    });
  },

  calcListWidth() {
    wx.createSelectorQuery()
      .in(this)
      .selectAll(".prize")
      .boundingClientRect(rects => {
        const singleCount = rects.length / 3;
        let width = 0;

        for (let i = 0; i < singleCount; i++) {
          width += rects[i].width;
        }

        this.setData({
          listWidth: width,
          translateX: -width
        });
      })
      .exec();
  },

  onTouchStart(e) {
    this.data.startX = e.touches[0].clientX;
    this.data.startTranslateX = this.data.translateX;
  },

  onTouchMove(e) {
    this.lastX = e.touches[0].clientX;
    if (this.rafLock) return;

    this.rafLock = true;

    setTimeout(() => {
      const delta = this.lastX - this.data.startX;
      let nextX = this.data.startTranslateX + delta;
      const { listWidth } = this.data;

      if (!listWidth) {
        this.rafLock = false;
        return;
      }

      if (nextX > 0) nextX -= listWidth;
      if (nextX < -listWidth * 2) nextX += listWidth;

      this.setData({ translateX: nextX });
      this.rafLock = false;
    }, 16);
  },

  async setGoodsList() {
    const goodsList = await newYearService.getGoodsList();
    this.setData({ goodsList });
  },

  updateCountDown() {
    const targetTime = new Date("2026-02-16T23:59:59+08:00").getTime();
    const now = Date.now();
    let diff = targetTime - now;

    if (diff <= 0) {
      this.setData({ days: "00", hours: "00", minutes: "00", seconds: "00" });
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff %= 1000 * 60 * 60 * 24;
    const h = Math.floor(diff / (1000 * 60 * 60));
    diff %= 1000 * 60 * 60;
    const m = Math.floor(diff / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);
    const format = n => String(n).padStart(2, "0");

    this.setData({
      days: format(d),
      hours: format(h),
      minutes: format(m),
      seconds: format(s)
    });
  },

  onPressStart() {
    this.setData({ press: true });
  },

  onPressEnd() {
    this.setData({ press: false });

    if (this.animating) return;
    this.animating = true;

    const { translateX, listWidth, renderList } = this.data;
    if (!listWidth || !renderList.length) {
      this.animating = false;
      return;
    }

    let currentX = translateX;

    // 模拟服务端返回中奖索引
    const prizeIndex = Math.floor(Math.random() * renderList.length);
    console.log("中奖索引：", prizeIndex);

    const totalSpins = 3;
    const duration = 3500; // 增加滚动时间
    const fps = 60;
    const interval = 1000 / fps;

    const prizeWidth = listWidth / renderList.length;
    const prizeOffset = prizeIndex * prizeWidth;
    const totalDistance = listWidth * totalSpins + prizeOffset;

    let elapsed = 0;

    const easeInOutCubic = t =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = () => {
      elapsed += interval;
      const t = Math.min(elapsed / duration, 1);
      const eased = easeInOutCubic(t);
      const deltaX = totalDistance * eased;

      let nextX = currentX - deltaX;

      // ✅ while 修正，保证 translateX 永远在 [-listWidth*2, 0] 之间
      while (nextX < -listWidth * 2) nextX += listWidth;
      while (nextX > 0) nextX -= listWidth;

      this.setData({ translateX: nextX });

      if (t < 1) {
        setTimeout(step, interval);
      } else {
        // 精准停在中奖位置
        const finalX = currentX - totalDistance;
        let correctedX = finalX;
        while (correctedX < -listWidth * 2) correctedX += listWidth;
        while (correctedX > 0) correctedX -= listWidth;

        this.setData({ translateX: correctedX });
        this.animating = false;

        console.log("抽奖结束，中奖索引：", prizeIndex);
      }
    };

    step();
  },

  showLuckPopup() {
    this.setData({ luckPopupVisible: true });
  },

  hideLuckPopup() {
    this.setData({ luckPopupVisible: false });
  },

  showTaskPopup() {
    this.setData({ taskPopupVisible: true });
  },

  hideTaskPopup() {
    this.setData({ taskPopupVisible: false });
  },

  showPrizePopup() {
    this.setData({ prizePopupVisible: true });
  },

  hidePrizePopup() {
    this.setData({ prizePopupVisible: false });
  },

  checkBrand(e) {
    const { brand } = e.currentTarget.dataset;
    if (brand) {
      switch (brand) {
        case "qdnp":
          wx.navigateTo({
            url: "/pages/subpages/mall/goods/subpages/shop/index?id=1"
          });
          break;

        case "qdlw":
          wx.navigateTo({
            url: "/pages/subpages/mall/goods/subpages/shop/index?id=5"
          });
          break;
      }
    } else {
      wx.navigateTo({
        url: "/pages/subpages/mine/setting/subpages/merchant-settle/index?type=4"
      });
    }
  },

  exchange(e) {
    const { id, goodsId } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${goodsId}`
    });
  },

  onPageScroll(e) {
    if (e.scrollTop > 100 && !this.data.showBg) {
      this.setData({ showBg: true });
      wx.setNavigationBarColor({
        frontColor: "#000000",
        backgroundColor: "#ffffff",
        animation: {
          duration: 300,
          timingFunc: "easeIn"
        }
      });
    } else if (e.scrollTop <= 100 && this.data.showBg) {
      this.setData({ showBg: false });
      wx.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: "transparent",
        animation: {
          duration: 300,
          timingFunc: "easeOut"
        }
      });
    }
  },

  onUnload() {
    if (this.data.timer) clearInterval(this.data.timer);
  }
});
