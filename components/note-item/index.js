import { SCENE_AUTHOR } from "../../utils/emuns/mediaScene";

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object,
    mediaScene: {
      type: Number,
      value: 1
    }
  },

  data: {
    visible: false
  },

  methods: {
    onCoverLoaded(e) {
      const { width, height } = e.detail;
      const coverHeight = (350 / width) * height;
      this.setData({
        [`item.coverHeight`]:
          coverHeight > 480 ? 480 : coverHeight < 300 ? 300 : coverHeight
      });
      this.setData({ visible: true });
    },

    navToNoteDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/home/media/note/index?id=${id}`;
      wx.navigateTo({ url });
    }
  }
});
