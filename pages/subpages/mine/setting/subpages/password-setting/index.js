import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../store/index";
import SettingService from "../../utils/settingService";

const settingService = new SettingService();

Page({
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo"]
    });
  },

  setPassword(e) {
    this.password = e.detail.value;
  },

  setNewPassword(e) {
    this.newPassword = e.detail.value;
  },

  setPasswordConfirm(e) {
    this.passwordConfirm = e.detail.value;
  },

  submit() {
    if (store.userInfo.password) {
      if (!this.password) {
        wx.showToast({
          title: '请输入原始密码',
          icon: 'none'
        });
        return
      }
    }
    if (!this.newPassword) {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none'
      });
      return
    }
    if (!this.passwordConfirm) {
      wx.showToast({
        title: '请再次输入新密码',
        icon: 'none'
      });
      return
    }
    if (this.newPassword !== this.passwordConfirm) {
      wx.showToast({
        title: '两次密码不一致，请重新输入',
        icon: 'none'
      });
      return
    }

    if (store.userInfo.password) {
      settingService.resetPassword(this.password, this.newPassword, () => {
        wx.showToast({
          title: "设置成功",
          icon: "none"
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      });
    } else {
      settingService.setPassword(this.newPassword, () => {
        wx.showToast({
          title: "设置成功",
          icon: "none"
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 2000);
      });
    }
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  }
});
