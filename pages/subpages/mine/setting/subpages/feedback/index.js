import SettingService from "../../utils/settingService";

const settingService = new SettingService();

Page({
  data: {
    content: "",
    imageList: []
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
    const url = (await settingService.uploadFile(file.url)) || "";
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
    const { content, imageList } = this.data;
    if (!this.data.content) {
      wx.showToast({
        title: "反馈描述不能为空",
        icon: "none"
      });
      return;
    }
    settingService.submitFeedback(content, imageList, this.mobile, () => {
      wx.showToast({
        title: "提交成功",
        icon: "none"
      });
      setTimeout(() => {
        wx.navigateTo();
      }, 2000);
    });
  }
});
