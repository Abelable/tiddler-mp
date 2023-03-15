import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import LiveService from "../../../utils/liveService";

const liveService = new LiveService();

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
  },

  data: {
    goodsList: [],
  },

  attached() {
    this.setGoodsList(true);
  },

  methods: {
    selectOne(e) {
      const { index } = e.currentTarget.dataset;
      this.setData({
        [`goodsList[${index}].checked`]: !this.data.goodsList[+index].checked,
      });
    },

    loadMore() {
      this.setGoodsList();
    },

    async setGoodsList(init = false) {
      if (init) this.page = 0;
      const { list = [] } =
        (await liveService.getUserGoodsList(++this.page)) || {};
      const goodsList = list.map((item) => ({ ...item, checked: false }));
      this.setData({
        goodsList: init ? goodsList : [...this.data.goodsList, ...goodsList],
      });
    },

    confirm() {
      const goodsIds = this.data.goodsList
        .filter((item) => item.checked)
        .map((item) => item.id);
      this.triggerEvent("confirm", goodsIds);
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
