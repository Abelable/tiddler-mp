import NewYearService from "../../utils/newYearService";

const newYearService = new NewYearService();

Component({
  properties: {
    luckScore: Number,
    show: {
      type: Boolean,
      observer(truthy) {
        if (truthy) {
          this.setLuckList(true);
        }
      }
    }
  },

  data: {
    luckList: []
  },

  methods: {
    loadMore() {
      this.setLuckList();
    },

    async setLuckList(init = false) {
      if (init) this.page = 0;
      const { list = [] } =
        (await newYearService.getLuckList(++this.page)) || {};
      this.setData({
        luckList: init ? list : [...this.data.luckList, ...list]
      });
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});
