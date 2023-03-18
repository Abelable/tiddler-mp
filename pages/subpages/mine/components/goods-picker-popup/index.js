import BaseService from "../../../../../services/baseService";

const baseService = new BaseService();

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    show: {
      type: Boolean,
      observer(truthy) {
        if (truthy && !this.data.goodsList.length) {
          this.setGoodsList(true);
        }
      },
    },
  },

  data: {
    goodsList: [],
    selectedIndex: 0,
  },

  methods: {
    loadMore() {
      this.setGoodsList();
    },

    async setGoodsList(init = false) {
      if (init) this.page = 0;
      const { list = [] } =
        (await baseService.getUserGoodsList(++this.page)) || {};
      this.setData({
        goodsList: init ? list : [...this.data.goodsList, ...list],
      });
    },

    selectedGoods(e) {
      const selectedIndex = Number(e.currentTarget.dataset.index);
      this.setData({ selectedIndex });
    },

    confirm() {
      const { goodsList, selectedIndex } = this.data;
      const { id, name } = goodsList[selectedIndex];
      this.triggerEvent("confirm", { id, name });
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
