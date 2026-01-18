import { store } from "../../../../store/index";
import { checkLogin } from "../../../../utils/index";
import NewYearService from "./utils/newYearService";

const newYearService = new NewYearService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    showBg: false,
    luckScore: 0,
    press: false,
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
    timer: null,
    translateX: 0,
    transition: "none",
    prizeList: [],
    renderList: [],
    listWidth: 0,
    animating: false,
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
    prizePopupVisible: false,
    qrCode: "",
    posterModalVisible: false,
    rulePopupVisible: false
  },

  onLoad(options) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    });

    const { scene = "" } = options || {};
    const decodedSceneList = scene ? decodeURIComponent(scene).split("-") : [];
    this.superiorId = decodedSceneList[0] || "";

    getApp().onLaunched(async () => {
      if (this.superiorId && !store.superiorInfo) {
        wx.setStorageSync("superiorId", this.superiorId);
        const superiorInfo = await newYearService.getUserInfoById(
          this.superiorId
        );
        if (superiorInfo.promoterInfo) {
          store.setSuperiorInfo(superiorInfo);
        }
      }
    });

    this.updateCountDown();
    const timer = setInterval(this.updateCountDown.bind(this), 1000);
    this.setData({ timer });

    this.setGoodsList();
    this.setPrizeList();
  },

  onShow() {
    checkLogin(() => {
      this.setLuckScore();
    }, false);
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

  async setLuckScore() {
    const luckScore = await newYearService.getLuckScore();
    this.setData({ luckScore });
  },

  async setGoodsList() {
    const goodsList = await newYearService.getGoodsList();
    this.setData({ goodsList });
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
    const query = wx.createSelectorQuery().in(this);
    query.select(".prize-viewport").boundingClientRect();
    query.selectAll(".prize").boundingClientRect();
    query.exec(res => {
      const viewport = res[0];
      const rects = res[1];
      if (!rects || rects.length === 0) return;

      const singleCount = this.data.prizeList.length;
      let singleListWidth = 0;
      // 计算一组奖品的总宽度（包含margin）
      for (let i = 0; i < singleCount; i++) {
        const nextRect = rects[i + 1];
        const currentRect = rects[i];
        // 宽度 = 当前奖品宽 + 奖品间的间距
        const margin = nextRect ? nextRect.left - currentRect.right : 18;
        singleListWidth += currentRect.width + margin;
      }

      this.setData({
        listWidth: singleListWidth,
        viewportWidth: viewport.width,
        // 初始位置停在第二组的开头
        translateX: -singleListWidth
      });
    });
  },

  onPressStart() {
    this.setData({ press: true });
  },

  onPressEnd() {
    this.setData({ press: false });
    if (this.animating || !this.data.listWidth) return;
    this.animating = true;

    const { prizeList, listWidth, viewportWidth } = this.data;

    // 1. 模拟中奖索引 (0 - 8)
    const targetIndex = Math.floor(Math.random() * prizeList.length);

    // 2. 重新获取位置信息（防止布局抖动）
    const query = wx.createSelectorQuery().in(this);
    query.selectAll(".prize").boundingClientRect();
    query.exec(res => {
      const rects = res[0];
      const singleCount = prizeList.length;

      // 目标设在第二组里的对应位置
      const targetRect = rects[singleCount + targetIndex];

      // 3. 计算居中偏移量
      // 奖品相对于 track 起点的中心点 = (奖品left - 容器left) + 奖品宽度/2
      const prizeCenterRelative =
        targetRect.left - rects[0].left + targetRect.width / 2;
      // 最终 X = 视口中心 - 奖品中心
      const finalX = viewportWidth / 2 - prizeCenterRelative;

      // 4. 执行动画
      // 先瞬间重置到“第一组”对应的位置，为滚动留出至少一圈的距离
      const startX = finalX + listWidth;

      this.setData(
        {
          transition: "none",
          translateX: startX
        },
        () => {
          // 延迟触发动画，确保重置位置已渲染
          setTimeout(() => {
            this.setData({
              // 使用贝塞尔曲线：先极快，后极慢，最后丝滑停止
              transition: "transform 4s cubic-bezier(0.1, 0, 0.1, 1)",
              translateX: finalX
            });

            // 5. 动画结束回调
            setTimeout(() => {
              this.animating = false;
              wx.showModal({
                title: "中奖啦",
                content: `恭喜获得：${prizeList[targetIndex].name}`,
                showCancel: false
              });
            }, 4000);
          }, 50);
        }
      );
    });
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

  showLuckPopup() {
    checkLogin(() => {
      this.setData({ luckPopupVisible: true });
    });
  },

  hideLuckPopup() {
    this.setData({ luckPopupVisible: false });
  },

  showTaskPopup() {
    checkLogin(() => {
      this.setData({ taskPopupVisible: true });
    });
  },

  hideTaskPopup() {
    this.setData({ taskPopupVisible: false });
    this.setLuckScore();
  },

  showPrizePopup() {
    checkLogin(() => {
      this.setData({ prizePopupVisible: true });
    });
  },

  hidePrizePopup() {
    this.setData({ prizePopupVisible: false });
  },

  showRulePopup() {
    this.setData({ rulePopupVisible: true });
  },

  hideRulePopup() {
    this.setData({ rulePopupVisible: false });
  },

  showPosterModal() {
    checkLogin(async () => {
      const scene = store.superiorInfo ? `${store.superiorInfo.id}` : "";
      const page = "pages/subpages/common/new-year/index";
      const qrCode = await newYearService.getQrCode(scene, page);

      this.setData({
        posterModalVisible: true,
        qrCode
      });
    });
  },

  hidePosterModal() {
    this.setData({ posterModalVisible: false });
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
  },

  onShareAppMessage() {
    const { id } = store.superiorInfo || {};
    const originalPath = "/pages/subpages/common/new-year/index";
    const path = id ? `${originalPath}?superiorId=${id}` : originalPath;
    return {
      path,
      title: "团圆家乡年",
      imageUrl: "https://static.tiddler.cn/mp/new_year/share_cover.webp"
    };
  },

  onShareTimeline() {
    const { id } = store.superiorInfo || {};
    const query = id ? `superiorId=${id}` : "";
    return {
      query,
      title: "团圆家乡年",
      imageUrl: "https://static.tiddler.cn/mp/new_year/share_cover.png"
    };
  }
});
