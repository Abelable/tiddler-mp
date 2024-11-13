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
    visible: false,
  },

  methods: {
    onCoverLoaded() {
      this.setData({ visible: true });
    },

    navToNoteDetail() {
      const { item, mediaScene } = this.properties;
      const { id, authorInfo } = item;

      const url = `/pages/subpages/home/media/note/index?id=${id}&mediaScene=${mediaScene}&authorId=${
        mediaScene === SCENE_AUTHOR ? authorInfo.id : 0
      }`;
      wx.navigateTo({ url });
    },
  },
});
