import LiveService from "../../../utils/liveService";

const liveService = new LiveService();

Component({
  properties: {
    roomId: Number,
  },

  data: {
    total: 0,
    goodsList: [],
    finished: false,
  },

  lifetimes: {
    attached() {
      this.setGoodsList(true);
    },
  },

  methods: {
    loadMore() {
      this.setGoodsList();
    },

    async setGoodsList(init = false) {
      const { roomId, goodsList } = this.data;
      if (init) {
        this.page = 0;
      }
      const { list = [], total = 0 } =
        (await liveService.getRoomGoodsList(roomId, ++this.page)) || {};
      if (init) {
        this.setData({ total });
      }
      this.setData({
        goodsList: init ? list : [...goodsList, ...list],
      });
    },

    showGoodsDetailPopup(e) {
      
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
