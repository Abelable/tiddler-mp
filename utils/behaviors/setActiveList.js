import { store } from "../../store/index";

const { windowHeight } = getApp().globalData.systemInfo;

module.exports = Behavior({
  methods: {
    setActiveList() {
      const query = wx.createSelectorQuery().in(this);
      query.selectAll(".item").boundingClientRect();
      query.exec((res) => {
        const list = res[0].filter((item) => {
          const { media_type, start_time, is_stopped } = item.dataset.info;
          if (
            (media_type == 1 && start_time == 0 && is_stopped != 1) ||
            media_type == 2
          )
            return item;
        });
        if (list.length) {
          list.sort((a, b) => a.top - b.top);
          let activeList;
          for (let i = 0; i < list.length; i++) {
            if (
              list[i].top > windowHeight * 0.1 &&
              list[i].top < windowHeight * 0.5
            ) {
              activeList = list[i];
              break;
            }
          }
          const { dataset, top } = activeList || list[0];
          store.setActiveListInfo({ id: dataset.info.id, top });
        }
      });
    },
  },
});
