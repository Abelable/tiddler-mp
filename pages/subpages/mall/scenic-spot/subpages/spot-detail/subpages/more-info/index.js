Page({
  data: {
    curMenuIdx: 0,
    introductionFold: true,
    introduction: "",
    projectList: [
      {
        image:
          "https://img.ubo.vip/images/202208/thumb_img/0_thumb_P_1660717847911.jpg",
        name: "森林滑道",
      },
      {
        image:
          "https://img.ubo.vip/images/202208/thumb_img/_thumb_P_1660717980300.jpg",
        name: "红叶滩",
      },
      {
        image:
          "https://img.ubo.vip/images/202208/thumb_img/_thumb_P_1660717983502.jpg",
        name: "叠瀑欢歌",
      },
      {
        image:
          "https://img.ubo.vip/images/202208/thumb_img/0_thumb_P_1660717847911.jpg",
        name: "七彩滑道",
      },
      {
        image:
          "https://img.ubo.vip/images/202208/thumb_img/0_thumb_P_1660717847911.jpg",
        name: "凝翠潭",
      },
    ],
  },

  async onLoad({ id }) {
    wx.setNavigationBarTitle({
      title: "千岛湖森林氧吧",
    });

    this.introduction =
      "千岛湖森林氧吧是由千岛湖国家森林公园于2003年正式向外推出的又一处生态旅游景点，位于千岛湖风光秀丽的东南湖区边缘，交通极其便利。森林氧吧拥有千岛湖最好的森林植被(国家亚热带原始次森林保护区、最美的自然风光(森林、瀑布、彩岩)和最佳的生态环境(负离子含量非常高)。景区周边群山叠翠，湖湾优美，自然生态环境一流。该区域以丰富的植物资源(初步统计有各种植物达300余种，拥有全国最大的野生甜槠林、形态各异的山石(喀斯特地貌的石灰岩和色泽鲜艳的砂质沉积岩）、秀美曲折的溪润、跌宕多姿的瀑布、色彩斑斓的水潭共同组成了地形复杂多样、景致变化万千的森林游憩景观，被誉为千岛湖的世外桃源。经中南林学院生态研究专家采用DLY-3F型森林大气离子测量仪测定，氧吧内每立方厘米空气中含58000-62000个对人体健康极有益处的负氧离子。此外，氧吧内有充沛的森林浴能，在这里可以浴大气、浴水源，还可以浴身心、除疾病、陶冶情操。开业一年来，景点被评为和授子浙江省最佳生态景点、杭州市环境教育基地、浙江林学院教学实习基地和杭州市级森林公园等称号。";

    this.setData({
      introduction: `${this.introduction.slice(0, 68)}...`,
    });
  },

  selectMenu(e) {
    const curMenuIdx = Number(e.currentTarget.dataset.index);
    this.setData({ curMenuIdx });
  },

  toggleIntroductionFold() {
    const { introductionFold } = this.data;
    this.setData({
      introductionFold: !introductionFold,
      introduction: introductionFold
        ? this.introduction
        : `${this.introduction.slice(0, 68)}...`,
    });
  },
});
