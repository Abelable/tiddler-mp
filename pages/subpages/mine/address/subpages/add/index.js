import AddressService from "../../utils/addressService";

const addressService = new AddressService();

Page({
  data: {
    text: "",
    regionCodeList: [],
    regionDesc: "",
    name: "",
    addressDetail: ""
  },

  textInput(e) {
    this.setData({ text: e.detail.value });
  },

  clearText() {
    this.setData({ text: "" });
  },

  async recognizeText() {
    if (!this.data.text) {
      wx.showToast({
        title: "请输入识别地址",
        icon: "none"
      });
      return;
    }
    const {
      town,
      detail,
      province,
      zipCode,
      city,
      cityCode,
      area,
      countyCode,
      name,
      mobile
    } = await addressService.analyzeAddress(this.data.text);

    const regionDesc = `${province} ${city} ${area}`;
    const regionCodeList = [zipCode, cityCode, countyCode];
    const addressDetail = `${town}${detail}`;

    this.setData({ name, mobile, regionCodeList, regionDesc, addressDetail });
  },

  setName(e) {
    this.setData({ name: e.detail.value });
  },

  setMobile(e) {
    this.setData({ mobile: e.detail.value });
  },

  selectRegion(e) {
    const { code, value } = e.detail;
    const regionCodeList = code;
    const regionDesc = Array.from(new Set(value)).join(" ");
    this.setData({ regionCodeList, regionDesc });
  },

  setAddressDetail(e) {
    this.setData({ addressDetail: e.detail.value });
  },

  toggleDefaultValue(e) {
    this.isDefault = e.detail.value ? 1 : 0;
  },

  save() {
    const { name, mobile, regionCodeList, regionDesc, addressDetail } = this.data;
    if (!name) {
      wx.showToast({
        title: "请输入姓名",
        icon: "none"
      });
      return;
    }
    if (!mobile || !/^1[3-9]\d{9}$/.test(mobile)) {
      wx.showToast({
        title: "请输入正确手机号",
        icon: "none"
      });
      return;
    }
    if (!regionCodeList.length) {
      wx.showToast({
        title: "请选择省市区",
        icon: "none"
      });
      return;
    }
    const errRegionCodeIdx = regionCodeList.findIndex(item => item.length !== 6)
    if (errRegionCodeIdx !== -1) {
      wx.showToast({
        title: "省市区获取异常，请手动选择省市区",
        icon: "none"
      });
      return;
    }
    if (!addressDetail) {
      wx.showToast({
        title: "请输入详细地址",
        icon: "none"
      });
      return;
    }

    addressService.addAddress(
      name,
      mobile,
      JSON.stringify(regionCodeList),
      regionDesc,
      addressDetail,
      this.isDefault,
      () => {
        wx.navigateBack();
      }
    );
  }
});
