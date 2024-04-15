import { store } from "../../store/index";
import { SCENE_GOODS, SCENE_LIVE } from "../../utils/emuns/posterScene";

const descList = [
  "发现精彩直播",
  "发现有趣短视频",
  "发现有趣游记",
  "推荐秀美景点",
  "推荐舒适酒店",
  "推荐美味餐馆",
  "推荐特色商品",
  "推荐优质店铺",
  "发现有趣达人"
];
let canvas = null;
let ctx = null;

Component({
  properties: {
    scene: Number,
    info: Object
  },

  lifetimes: {
    async attached() {
      wx.showLoading({ title: "海报生成中..." });
      await this.init();
      await this.createPoster();
      wx.hideLoading();
    }
  },

  methods: {
    init() {
      return new Promise(resolve => {
        this.createSelectorQuery()
          .select("#poster")
          .fields({ node: true, size: true })
          .exec(res => {
            if (res && res.length) {
              canvas = res[0].node;
              const renderWidth = res[0].width;
              const renderHeight = res[0].height;
              ctx = canvas.getContext("2d");

              const dpr = getApp().globalData.systemInfo.pixelRatio;
              canvas.width = renderWidth * dpr;
              canvas.height = renderHeight * dpr;
              ctx.scale(dpr, dpr);
              resolve();
            }
          });
      });
    },

    async createPoster() {
      const { avatar, nickname } = store.userInfo;
      const { scene, info } = this.properties;
      const { cover, title, price, marketPrice } = info || {};

      await this.drawImage(
        "https://img.ubo.vip/tiddler/poster_bg.png",
        0,
        0,
        291,
        416
      );

      await this.roundRect(15, 17, 32, 32, 16, avatar);
      this.setText(14, "#fff", 55, 28, nickname);
      this.setText(12, "#fff", 55, 46, descList[scene - 1]);

      await this.drawImage(cover, 27, 71, 237, 130);
      if (title.length < 16) {
        this.setText(14, "#333", 145, 225, title, "center");
      } else if (title.length > 16 && title.length < 32) {
        this.setText(14, "#333", 145, 225, title.slice(0, 16), "center");
        this.setText(14, "#333", 145, 246, title.slice(16), "center");
      } else {
        this.setText(14, "#333", 145, 225, title.slice(0, 16), "center");
        this.setText(
          14,
          "#333",
          145,
          246,
          `${title.slice(16, 31)}...`,
          "center"
        );
      }

      await this.drawImage("./images/qrcode.jpg", 189, 360, 86, 86);
      this.setText(ctx, 10, "#999", 145, 380, "长按识别小程序码", "center");

      wx.canvasToTempFilePath(
        {
          canvas,
          success: res => {
            this.posterUrl = res.tempFilePath;
          }
        },
        this
      );
    },

    /**
     * 绘制圆角矩形
     * @param {Number} x - 矩形的x坐标
     * @param {Number} y - 矩形的y坐标
     * @param {Number} w - 矩形的宽度
     * @param {Number} h - 矩形的高度
     * @param {Number} r - 矩形的圆角半径
     * @param {Number} cover - 矩形的封面
     * @param {Object} shadow - 矩形的阴影
     * @param {String} [c = 'transparent'] - 矩形的填充色
     */
    async roundRect(
      x,
      y,
      w,
      h,
      r = 0,
      cover = "",
      shadow = null,
      c = "transparent"
    ) {
      ctx.save();
      ctx.beginPath();

      if (shadow) {
        let { x, y, blur, color } = shadow;
        ctx.shadowOffsetX = x;
        ctx.shadowOffsetY = y;
        ctx.shadowBlur = blur;
        ctx.shadowColor = color;
      }
      let r1, r2, r3, r4;
      typeof r === "number" ? (r1 = r2 = r3 = r4 = r) : ([r1, r2, r3, r4] = r);

      ctx.moveTo(x, y);
      r2 ? ctx.arcTo(x + w, y, x + w, y + h, r2) : ctx.lineTo(x + w, y);
      r3 ? ctx.arcTo(x + w, y + h, x, y + h, r3) : ctx.lineTo(x + w, y + h);
      r4 ? ctx.arcTo(x, y + h, x, y, r4) : ctx.lineTo(x, y + h);
      r1 ? ctx.arcTo(x, y, x + w, y, r1) : ctx.lineTo(x, y);

      ctx.fillStyle = c;
      ctx.fill();

      if (cover) {
        ctx.clip();
        await this.drawImage(cover, x, y, w, h);
      }
      ctx.restore();
    },

    setText(fs, color, x, y, c, align = "left") {
      ctx.font = `${fs}px`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.fillText(c, x, y);
      ctx.restore();
    },

    drawImage(src, x, y, w, h) {
      return new Promise(resolve => {
        const image = canvas.createImage();
        image.src = src;
        image.onload = () => {
          ctx.drawImage(image, x, y, w, h);
          resolve();
        };
      });
    },

    save() {
      wx.getSetting({
        success: res => {
          if (res.authSetting["scope.writePhotosAlbum"] !== false)
            this.saveImageToPhotosAlbum();
          else
            wx.showModal({
              title: "信息授权提示",
              content: "您当前为未授权状态，请到小程序的设置中打开授权",
              showCancel: true,
              cancelText: "取消",
              confirmText: "去设置",
              success: res => {
                if (res.confirm)
                  wx.openSetting({
                    success: () => {
                      this.saveImageToPhotosAlbum();
                    }
                  });
              }
            });
        }
      });
    },

    saveImageToPhotosAlbum() {
      wx.saveImageToPhotosAlbum({
        filePath: this.posterUrl,
        success: () => {
          this.triggerEvent("hide");
          wx.showToast({ title: "成功保存", icon: "none" });
        }
      });
    }
  }
});
