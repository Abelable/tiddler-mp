import { store } from "../../store/index";

const { windowHeight } = getApp().globalData.systemInfo;

module.exports = Behavior({
  methods: {
    setActiveMediaItem() {
      const query = this.createSelectorQuery();
      query.selectAll(".item").boundingClientRect();
      query.exec((res) => {
        const list = res[0].filter((item) => {
          const { type, status } = item.dataset.info;
          if (type === 1 && status === 1) return item;
        });
        if (list.length) {
          list.sort((a, b) => a.top - b.top);
          let activeMediaItem;
          for (let i = 0; i < list.length; i++) {
            if (
              list[i].top > windowHeight * 0.1 &&
              list[i].top < windowHeight * 0.5
            ) {
              activeMediaItem = list[i];
              break;
            }
          }
          const { dataset, top } = activeMediaItem || list[0];
          store.setActiveMediaItem({ id: dataset.info.id, top });
        }
      });
    },
  },
});
