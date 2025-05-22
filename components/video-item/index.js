import { SCENE_AUTHOR } from "../../utils/emuns/mediaScene";

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    item: Object,
    mediaScene: {
      type: Number,
      value: 1,
    },
  },

  data: {
    coverMode: "widthFix",
    visible: false,
  },

  methods: {
    onCoverLoaded(e) {
      const { width, height } = e.detail;
      const coverHeight = 350 / width * height;
      this.setData({
        [`item.coverHeight`]:
          coverHeight > 480 ? 480 : coverHeight < 260 ? 260 : coverHeight
      });
      this.setData({ visible: true });
    },

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
