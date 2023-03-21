import { SCENE_AUTHOR } from "../../utils/emuns/mediaScene";

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    item: Object,
    mediaScene: {
      type: Number,
      value: 1
    },
  },

  methods: {
    navToVideoDetail() {
      const { item, mediaScene } = this.properties;
      const { id, authorInfo } = item;

      const url = `/pages/subpages/home/media/video/index?id=${id}&mediaScene=${mediaScene}&authorId=${
        mediaScene === SCENE_AUTHOR ? authorInfo.id : 0
      }`;
      wx.navigateTo({ url });
    },
  },
});
