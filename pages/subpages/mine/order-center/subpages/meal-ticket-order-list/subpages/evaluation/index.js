import OrderService from "../../utils/orderService";

const orderService = new OrderService();

Page({
  data: {
    score: 0,
    imageList: [],
  },

  onLoad({ orderId, restaurantId }) {
    this.orderId = orderId;
    this.restaurantId = restaurantId;
  },

  setScore(e) {
    this.setData({ score: e.detail });
  },

  setContent(e) {
    this.content = e.detail.value;
  },

  async uploadImage(e) {
    const { index, file } = e.detail;
    this.setData({
      imageList: [
        ...this.data.imageList,
        { status: "uploading", message: "上传中", deletable: true },
      ],
    });
    const url = (await orderService.uploadFile(file.url)) || "";
    if (url) {
      this.setData({
        [`imageList[${index}]`]: {
          ...this.data.imageList[index],
          status: "done",
          message: "上传成功",
          url,
        },
      });
    } else {
      this.setData({
        [`imageList[${index}]`]: {
          ...this.data.imageList[index],
          status: "fail",
          message: "上传失败",
        },
      });
    }
  },

  deleteImage(e) {
    const { imageList } = this.data;
    imageList.splice(e.detail.index, 1);
    this.setData({ imageList });
  },

  submit() {
    const { score, imageList } = this.data;
    if (!score) {
      wx.showToast({
        title: "忘记评分咯！",
        icon: "none",
      });
      return;
    }
    if (!this.content) {
      wx.showToast({
        title: "评价不能为空哦！",
        icon: "none",
      });
      return;
    }
    orderService.submitEvaluation(
      this.orderId,
      this.restaurantId,
      score,
      this.content,
      imageList,
      () => {
        wx.showToast({
          title: "提交成功",
          icon: "none",
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      }
    );
  },
});
