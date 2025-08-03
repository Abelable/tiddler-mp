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
      this.setMediaList()
    }
  },

  methods: {
    async setMediaList() {
      const { list: mediaList = [] } =
        (await mediaService.getRelativeMediaList(1, 1, 1)) || {};
      this.setData({ mediaList });
      console.log('mediaList', mediaList)
    },

    checkDetail() {
      const { scenicId } = this.properties.item;
      const url = `/pages/subpages/mall/scenic/subpages/scenic-detail/index?id=${scenicId}`;
      wx.navigateTo({ url });
    }
  }
});
