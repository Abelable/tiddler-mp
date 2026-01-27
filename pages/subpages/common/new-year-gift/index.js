import { store } from "../../../../store/index";
import { checkLogin } from "../../../../utils/index";
import BaseService from "../../../../services/baseService";

const baseService = new BaseService();

Page({
  data: {
    xgList: [
      {
        name: "金榜题名",
        cover: "https://static.tiddler.cn/mp/new_year_gift/xg_5.webp"
      },
      {
        name: "如意顺遂",
        cover: "https://static.tiddler.cn/mp/new_year_gift/xg_2.webp"
      },
      {
        name: "吉祥常临",
        cover: "https://static.tiddler.cn/mp/new_year_gift/xg_3.webp"
      },
      {
        name: "青云直上",
        cover: "https://static.tiddler.cn/mp/new_year_gift/xg_4.webp"
      },
      {
        name: "马到成功",
        cover: "https://static.tiddler.cn/mp/new_year_gift/xg_1.webp"
      }
    ],
    mrList: [
      {
        name: "金榜题名",
        cover: "https://static.tiddler.cn/mp/new_year_gift/mr_5.webp"
      },
      {
        name: "万事如意",
        cover: "https://static.tiddler.cn/mp/new_year_gift/mr_2.webp"
      },
      {
        name: "吉祥如意",
        cover: "https://static.tiddler.cn/mp/new_year_gift/mr_3.webp"
      },
      {
        name: "鹏程万里",
        cover: "https://static.tiddler.cn/mp/new_year_gift/mr_4.webp"
      },
      {
        name: "马到成功",
        cover: "https://static.tiddler.cn/mp/new_year_gift/mr_1.webp"
      }
    ],
    rbList: [0, 1],

    curXgIdx: 0,
    curMrIdx: 0,
    curRbIdx: 0,

    skuList: [],
    specList: [],
    qrCode: "",
    posterModalVisible: false
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
        const superiorInfo = await baseService.getUserInfoById(
          this.superiorId
        );
        if (superiorInfo.promoterInfo) {
          store.setSuperiorInfo(superiorInfo);
        }
      }
    });

    this.setGoodsInfo();
  },

  async setGoodsInfo() {
    const goodsInfo = await baseService.getGoodsInfo(87);
    this.setData({
      specList: goodsInfo.specList,
      skuList: goodsInfo.skuList
    });
  },

  onSelectXg(e) {
    this.setData({ curXgIdx: e.currentTarget.dataset.index });
  },

  onSelectMr(e) {
    this.setData({ curMrIdx: e.currentTarget.dataset.index });
  },

  onSelectRb(e) {
    this.setData({ curRbIdx: e.currentTarget.dataset.index });
  },

  showPosterModal() {
    checkLogin(async () => {
      const scene = store.superiorInfo ? `${store.superiorInfo.id}` : "";
      const page = "pages/subpages/common/new-year-gift/index";
      const qrCode = await baseService.getQrCode(scene, page);

      this.setData({
        posterModalVisible: true,
        qrCode
      });
    });
  },

  hidePosterModal() {
    this.setData({ posterModalVisible: false });
  },

  submit() {
    checkLogin(async () => {
      const { specList, skuList, curXgIdx, curMrIdx, curRbIdx } = this.data;
      if (!specList.length) return;

      const curSkuName = specList
        .map((spec, index) => {
          return spec.options[[curXgIdx, curMrIdx, curRbIdx][index]];
        })
        .join(",");

      const selectedSkuIndex = skuList.findIndex(
        sku => sku.name === curSkuName
      );

      const cartGoodsId = await baseService.fastAddCart(
        87,
        selectedSkuIndex,
        1
      );

      wx.navigateTo({
        url: `/pages/subpages/mall/goods/subpages/order-check/index?cartGoodsIds=${JSON.stringify([cartGoodsId])}`
      });
    });
  },

  onShareAppMessage() {
    const { id } = store.superiorInfo || {};
    const originalPath = "/pages/subpages/common/new-year-gift/index";
    const path = id ? `${originalPath}?superiorId=${id}` : originalPath;
    return {
      path,
      title: "千岛礼物新春礼包",
      imageUrl: "https://static.tiddler.cn/mp/new_year_gift/share_cover.webp"
    };
  },

  onShareTimeline() {
    const { id } = store.superiorInfo || {};
    const query = id ? `superiorId=${id}` : "";
    return {
      query,
      title: "千岛礼物新春礼包",
      imageUrl: "https://static.tiddler.cn/mp/new_year_gift/share_cover.png"
    };
  }
});
