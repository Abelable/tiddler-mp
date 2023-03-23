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

  data: {
    overSize: false
  },

  methods: {
    observe() {
      const query = this.createSelectorQuery();
      query.select(".cover").boundingClientRect();
      query.exec((res) => {
        if (res[0].height > 240) {
          this.setData({ overSize: true })
        }
      });
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
