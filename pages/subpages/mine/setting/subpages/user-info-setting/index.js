import { store } from "../../../../../../store/index";
import { debounce } from "../../../../../../utils/index";

const constellationOptions = [
  "水瓶座",
  "双鱼座",
  "白羊座",
  "金牛座",
  "双子座",
  "巨蟹座",
  "狮子座",
  "处女座",
  "天秤座",
  "天蝎座",
  "射手座",
  "摩羯座",
];

Page({
  data: {
    constellationOptions,
    genderOptions: ["保密", "男", "女"],
    userInfo: null,
    constellationIndex: -1,
    saveBtnActive: false,
  },

  onLoad() {
    const { constellation } = store.userInfo;
    const constellationIndex = constellationOptions.findIndex(
      (item) => item === constellation
    );
    this.setData({ userInfo: store.userInfo, constellationIndex });
  },

  setNickname: debounce(function(e) {
    this.setData({
      ["userInfo.nickname"]: e.detail.value
    })
    if (!this.data.saveBtnActive) {
      this.setData({
        saveBtnActive: true,
      });
    }
  }),

  selectGender(e) {
    this.setData({
      ["userInfo.gender"]: Number(e.detail.value),
    });
    if (!this.data.saveBtnActive) {
      this.setData({
        saveBtnActive: true,
      });
    }
  },

  selectConstellation(e) {
    const constellationIndex = Number(e.detail.value);
    this.setData({
      ["userInfo.constellation"]: constellationOptions[constellationIndex],
      constellationIndex,
    });
    if (!this.data.saveBtnActive) {
      this.setData({
        saveBtnActive: true,
      });
    }
  },

  selectBirthday(e) {
    this.setData({
      ["userInfo.birthday"]: e.detail.value,
    });
    if (!this.data.saveBtnActive) {
      this.setData({
        saveBtnActive: true,
      });
    }
  },

  setCareer: debounce(function(e) {
    this.setData({
      ["userInfo.career"]: e.detail.value
    })
    if (!this.data.saveBtnActive) {
      this.setData({
        saveBtnActive: true,
      });
    }
  }),

  setSignature: debounce(function(e) {
    this.setData({
      ["userInfo.signature"]: e.detail.value
    })
    if (!this.data.saveBtnActive) {
      this.setData({
        saveBtnActive: true,
      });
    }
  }),

  save() {
    if (!this.data.saveBtnActive) {
      return;
    }
  },

  cancel() {
    if (this.data.saveBtnActive) {
      wx.showModal({
        title: '信息已修改',
        content: '确定放弃修改吗？',
        success: (result) => {
          if(result.confirm){
            wx.navigateBack();
          }
        }
      });
    } else {
      wx.navigateBack();
    }
  },
});
