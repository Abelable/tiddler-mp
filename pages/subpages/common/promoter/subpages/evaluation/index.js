import PromoterService from "../../utils/promoterService";

const promoterService = new PromoterService();

Page({
  data: {
    tagList: [
      { text: "热情友好", value: 1, selected: false },
      { text: "耐心细致", value: 2, selected: false },
      { text: "专业高效", value: 3, selected: false },
      { text: "回复迅速", value: 4, selected: false },
      { text: "服务周到", value: 5, selected: false },
      { text: "沟通顺畅", value: 6, selected: false },
      { text: "积极跟进", value: 7, selected: false },
      { text: "超出预期", value: 8, selected: false }
    ],
    score: 0,
    content: "",
    imageList: []
  },

  onLoad({ promoterId }) {
    this.promoterId = +promoterId;
  },

  setScore(e) {
    this.setData({ score: e.detail });
  },

  selectTag(e) {
    const { index } = e.currentTarget.dataset;
    const { selected } = this.data.tagList[index];
    this.setData({
      [`tagList[${index}].selected`]: !selected
    });
  },

  setContent(e) {
    const content = e.detail.value;
    this.setData({ content });
  },

  async uploadImage(e) {
    const { index, file } = e.detail;
    this.setData({
      imageList: [
        ...this.data.imageList,
        { status: "uploading", message: "上传中", deletable: true }
      ]
    });
    const url = (await promoterService.uploadFile(file.url)) || "";
    if (url) {
      this.setData({
        [`imageList[${index}]`]: {
          ...this.data.imageList[index],
          status: "done",
          message: "上传成功",
          url
        }
      });
    } else {
      this.setData({
        [`imageList[${index}]`]: {
          ...this.data.imageList[index],
          status: "fail",
          message: "上传失败"
        }
      });
    }
  },

  deleteImage(e) {
    const { imageList } = this.data;
    imageList.splice(e.detail.index, 1);
    this.setData({ imageList });
  },

  submit() {
    const { score, content } = this.data;
    if (!score) {
      wx.showToast({
        title: "请评个分吧！",
        icon: "none"
      });
      return;
    }
    if (!content) {
      wx.showToast({
        title: "评价内容不能为空哦！",
        icon: "none"
      });
      return;
    }
    if (score <= 2) {
      wx.showModal({
        title: "评分较低哦",
        content: "确定要给出低分评价吗？",
        showCancel: true,
        cancelText: "再想想",
        success: result => {
          if (result.confirm) {
            this.evaluate();
          }
        }
      });
    } else {
      this.evaluate();
    }
  },

  evaluate() {
    const { score, content, goodsList, imageList } = this.data;
    const goodsIds = goodsList.map(item => item.goodsId);
    promoterService.submitEvaluation(
      this.status,
      this.orderId,
      goodsIds,
      score,
      content,
      imageList.map(item => item.url),
      () => {
        wx.showToast({
          title: "提交成功",
          icon: "none"
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      }
    );
  }
});
