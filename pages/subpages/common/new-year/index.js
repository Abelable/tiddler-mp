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
    prizes: [
      {
        name: "测试测试测试",
        cover: "https://static.tiddler.cn/mp/new_year/qdcy.webp"
      },
      {
        name: "测试测试测试",
        cover: "https://static.tiddler.cn/mp/new_year/qdcy.webp"
      },
      {
        name: "测试测试测试",
        cover: "https://static.tiddler.cn/mp/new_year/qdcy.webp",
        big: true
      },
      {
        name: "测试测试测试",
        cover: "https://static.tiddler.cn/mp/new_year/qdcy.webp"
      }
    ],

    goodsList: [
      {
        name: "测试测试商品1",
        cover: "https://static.tiddler.cn/mp/new_year/qdcy.webp",
        needLuck: 300
      },
      {
        name: "测试测试商品2",
        cover: "https://static.tiddler.cn/mp/new_year/qdcy.webp",
        needLuck: 300
      },
      {
        name: "测试测试商品3",
        cover: "https://static.tiddler.cn/mp/new_year/qdcy.webp",
        needLuck: 300
      },
      {
        name: "测试测试商品1",
        cover: "https://static.tiddler.cn/mp/new_year/qdcy.webp",
        needLuck: 300
      },
      {
        name: "测试测试商品2",
        cover: "https://static.tiddler.cn/mp/new_year/qdcy.webp",
        needLuck: 300
      },
      {
        name: "测试测试商品3",
        cover: "https://static.tiddler.cn/mp/new_year/qdcy.webp",
        needLuck: 300
      },
      {
        name: "测试测试商品2",
        cover: "https://static.tiddler.cn/mp/new_year/qdcy.webp",
        needLuck: 300
      },
      {
        name: "测试测试商品3",
        cover: "https://static.tiddler.cn/mp/new_year/qdcy.webp",
        needLuck: 300
      }
    ],

    partters: [
      { logo: "https://static.tiddler.cn/mp/new_year/qdnp.webp" },
      { logo: "https://static.tiddler.cn/mp/new_year/qdlw.webp" },
      { logo: "https://static.tiddler.cn/mp/new_year/qdcy.webp" },
      { logo: "https://static.tiddler.cn/mp/new_year/klj.webp" },
      { logo: "https://static.tiddler.cn/mp/new_year/yj.webp" },
      { title: "品牌入驻" },
      { title: "品牌入驻" },
      { title: "品牌入驻" },
      { title: "品牌入驻" }
    ],
    luckPopupVisible: false,
    taskPopupVisible: false,
    prizePopupVisible: false
  },

  onLoad() {
    this.updateCountDown();
    const timer = setInterval(this.updateCountDown.bind(this), 1000);
    this.setData({ timer });
  },

  onUnload() {
    if (this.data.timer) clearInterval(this.data.timer);
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
  },

  showLuckPopup() {
    this.setData({ luckPopupVisible: true })
  },

  hideLuckPopup() {
    this.setData({ luckPopupVisible: false })
  },

  showTaskPopup() {
    this.setData({ taskPopupVisible: true })
  },

  hideTaskPopup() {
    this.setData({ taskPopupVisible: false })
  },

  showPrizePopup() {
    this.setData({ prizePopupVisible: true })
  },

  hidePrizePopup() {
    this.setData({ prizePopupVisible: false })
  },

  onPageScroll(e) {
    if (e.scrollTop > 100 && !this.data.showBg) {
      this.setData({ showBg: true });
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ffffff',
        animation: {
          duration: 300,
          timingFunc: 'easeIn'
        }
      });
    } else if (e.scrollTop <= 100 && this.data.showBg) {
      this.setData({ showBg: false });
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: 'transparent',
        animation: {
          duration: 300,
          timingFunc: 'easeOut'
        }
      });
    }
  }
});
