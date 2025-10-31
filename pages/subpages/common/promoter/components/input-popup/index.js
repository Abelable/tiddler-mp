import PromoterService from "../../utils/promoterService";

const promoterService = new PromoterService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    promoterId: Number,
    questionId: Number
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
          title: "内容不能为空",
          icon: "none"
        });
        return;
      }
      const { promoterId, questionId } = this.properties;
      if (questionId) {
        promoterService.answerQuestion(questionId, this.content, () => {
          this.triggerEvent("finish");
        });
      } else {
        promoterService.submitQuestion(promoterId, this.content, () => {
          this.triggerEvent("finish");
        });
      }
    }
  }
});
