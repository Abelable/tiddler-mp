import PromoterService from "../../utils/promoterService";

const promoterService = new PromoterService();

Page({
  data: {
    options: [],
    content: "",
    imageList: []
  },

  onLoad({ promoterId }) {
    this.promoterId = +promoterId;

    this.setOptions()
  },

  async setOptions() {
    const options = await promoterService.getComplaintOptions(5);
    this.setData({ options });
  },

  selectOption(e) {
    this.reasonIds = e.detail.value.join();
  },

  setContent(e) {
    this.setData({
      content: e.detail.value
    });
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

  setMobile(e) {
    this.mobile = e.detail.value;
  },

  submit() {
    if (!this.reasonIds || !this.reasonIds.length) {
      wx.showToast({
        title: "请选择投诉原因",
        icon: "none"
      });
      return;
    }
    const { content, imageList } = this.data;
    promoterService.complain(
      this.promoterId,
      this.reasonIds,
      content,
      imageList,
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
