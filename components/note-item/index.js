import { store } from "../../store/index";
import { calcDistance } from "../../utils/index";

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object,
    mediaScene: {
      type: Number,
      value: 1
    },
    marginBottom: {
      type: Number,
      value: 30
    },
    marginRight: {
      type: Number,
      value: 0
    },
    coverWidth: {
      type: Number,
      value: 350
    },
    coverHeight: Number,
    showAddress: {
      type: Boolean,
      value: true
    },
    showDistance: Boolean,
    titleSingle: Boolean,
    titleColor: {
      type: String,
      value: "#333"
    },
    titleFontSize: {
      type: Number,
      value: 26
    },
    infoColor: {
      type: String,
      value: "#666"
    },
    infoFontSize: {
      type: Number,
      value: 22
    },
    avatarSize: {
      type: Number,
      value: 36
    },
    whiteHeart: Boolean
  },

  data: {
    visible: false,
    distance: ""
  },

  lifetimes: {
    attached() {
      const { showDistance, item } = this.properties;
      if (showDistance) {
        const { longitude: lo1 = 0, latitude: la1 = 0 } =
          store.locationInfo || {};
        const { longitude: lo2, latitude: la2 } = item;
        const distance = lo1 ? calcDistance(la1, lo1, la2, lo2) : 0;
        this.setData({ distance });
      }
    }
  },

  methods: {
    onCoverLoaded(e) {
      const { width, height } = e.detail;
      const coverHeight = (350 / width) * height;
      this.setData({
        [`item.coverHeight`]:
          coverHeight > 480 ? 480 : coverHeight < 300 ? 300 : coverHeight
      });
    },

    onVisible() {
      this.setData({ visible: true });
    },

    navToNoteDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/home/media/note/index?id=${id}`;
      wx.navigateTo({ url });
    }
  }
});
