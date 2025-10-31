import PromoterService from "../../utils/promoterService";

const promoterService = new PromoterService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    promoterId: Number
  },

  data: {
    containerBottom: 0,
    focus: true
  },

  methods: {
    bindInput(e) {
      this.content = e.detail.value;
    },

    setContainerBottom(e) {
      this.setData({
        containerBottom: e.detail.height
      });
    },

    setFocus() {
      this.setData({ focus: true });
    },

    send() {
      if (!this.content) {
        wx.showToast({
          title: "请输入您需要咨询的问题",
          icon: "none"
        });
        return;
      }
      promoterService.submitQuestion(
        this.properties.promoterId,
        this.content,
        () => {
          this.triggerEvent("finish");
        }
      );
    }
  }
});
