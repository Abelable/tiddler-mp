import MediaService from "../../../../utils/mediaService";

const mediaService = new MediaService();

Component({
  properties: {
    item: Object
  },

  data: {
    mediaList: []
  },

  lifetimes: {
    attached() {
      this.setMediaList();
    }
  },

  methods: {
    async setMediaList() {
      const { scenicId } = this.properties.item;
      const { list: mediaList = [] } =
        (await mediaService.getRelativeMediaList(1, scenicId, 1)) || {};
      this.setData({ mediaList });
    },

    checkDetail() {
      const { scenicId } = this.properties.item;
      const url = `/pages/subpages/mall/scenic/subpages/scenic-detail/index?id=${scenicId}`;
      wx.navigateTo({ url });
    }
  }
});
