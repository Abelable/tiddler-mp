import { store } from "../../../../../store/index";
import MineService from "../../utils/mineService";

const mineService = new MineService();

Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    show: Boolean
  },

  data: {
    avatar: "",
    nickname: ""
  },

  methods: {
    async chooseAvatar(e) {
      const avatar = (await mineService.uploadFile(e.detail.avatarUrl)) || "";
      this.setData({ avatar });
    },

    setNickname(e) {
      const nickname = e.detail.value;
      this.setData({ nickname });
    },

    save() {
      const { avatar, nickname } = this.data;
      if (!avatar) {
        wx.showToast({
          title: "头像不能为空哦～"
        });
        return;
      }
      if (!nickname) {
        wx.showToast({
          title: "昵称不能为空哦～"
        });
        return;
      }
      mineService.updateUserInfo(
        { ...store.userInfo, avatar, nickname },
        () => {
          store.setUserInfo({ ...store.userInfo, avatar, nickname });
          if (
            store.superiorInfo &&
            store.superiorInfo.id === store.userInfo.id
          ) {
            store.setSuperiorInfo({ ...store.superiorInfo, avatar, nickname });
          }

          // todo 团圆家乡年
          mineService.finishTask(5);

          this.hide();
        }
      );
    },

    hide() {
      this.triggerEvent("hide");
    }
  }
});
