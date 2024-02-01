import HomeService from "../../utils/homeService";

const homeService = new HomeService();

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    item: Object,
  },

  methods: {
    navToAuthorCenter() {
      const { id } = this.properties.item.authorInfo;
      const url = `/pages/subpages/home/media/author-center/index?id=${id}`;
      wx.navigateTo({ url });
    },

    navToGoodsDetail() {
      const { id } = this.properties.item.goodsInfo;
      const url = `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${id}`;
      wx.navigateTo({ url });
    },

    like() {
      let { id, isLike, likeNumber } = this.properties.item;
      homeService.toggleTourismNoteLikeStatus(id, () => {
        this.setData({
          ["item.isLike"]: !isLike,
          ["item.likeNumber"]: isLike ? --likeNumber : ++likeNumber,
        });
      });
    },

    collect() {
      let { id, isCollected, collectionTimes } = this.properties.item;
      homeService.toggleShortVideoCollectStatus(id, () => {
        this.setData({
          ["item.isCollected"]: !isCollected,
          ["item.collectionTimes"]: isCollected
            ? --collectionTimes
            : ++collectionTimes,
        });
      });
    },

    navToVideoDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/home/media/video/index?id=${id}`;
      wx.navigateTo({ url });
    },
  },
});
