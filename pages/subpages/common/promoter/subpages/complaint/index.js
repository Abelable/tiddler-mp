import PromoterService from "../../utils/promoterService";

const promoterService = new PromoterService();

Page({
  data: {
    options: [
      { title: "态度恶劣", content: "对游客冷漠、不耐烦或言语不当", value: 1 },
      { title: "服务不积极", content: "咨询回复慢，承诺服务未兑现", value: 2 },
      { title: "虚假宣传", content: "推荐内容与实际情况不符", value: 3 },
      { title: "信息不透明", content: "未说明价格、条件或真实情况", value: 4 },
      {
        title: "诱导消费",
        content: "有强制推销或额外收费行为",
        value: 5
      },
      { title: "代游客下单", content: "未经授权擅自帮游客下单", value: 6 },
      {
        title: "不安全引导",
        content: "推荐存在安全隐患的路线或场所",
        value: 7
      },
      {
        title: "泄露隐私",
        content: "未经允许泄露游客隐私信息",
        value: 8
      },
      { title: "冒充官方身份", content: "假借平台名义接单或宣传", value: 9 },
      { title: "不当推广行为", content: "私下拉群、推销其他平台", value: 10 },
      { title: "其他问题", content: "请填写具体情况", value: 11 }
    ],
    result: ["a", "b"],
    content: "",
    imageList: []
  },

  onLoad({ promoterId }) {
    this.promoterId = +promoterId;
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
