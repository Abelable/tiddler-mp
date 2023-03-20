import BaseService from "../../../../../../services/baseService";

const baseService = new BaseService();

Component({
  properties: {
    videoId: String,
    commentId: String,
  },

  data: {
    containerBottom: 0,
    content: "",
    focus: true,
    attedUserList: [],
    userList: [],
    usersPopupVisible: false,
  },

  methods: {
    onFocus(e) {
      if (!this.data.containerBottom) {
        this.setData({
          containerBottom: `calc(${e.detail.height}px - env(safe-area-inset-bottom))`,
        });
      }
      this.setData({ focus: true });
    },

    onBlur() {
      this.setData({ focus: false });
    },

    onInput(e) {
      const content = e.detail.value;
      this.content = content;
      const lastCharacter = content.charAt(content.length - 1);
      let { usersPopupVisible } = this.data;

      if (lastCharacter === "@" && !usersPopupVisible) {
        this.setData({ usersPopupVisible: true });
        usersPopupVisible = true;
        this.curAtIndex = content.lastIndexOf("@");
      }

      if (lastCharacter === "@" && usersPopupVisible) {
        this.curAtIndex = content.lastIndexOf("@");
      }

      if (usersPopupVisible && content.length < this.curAtIndex + 1) {
        this.setData({ usersPopupVisible: false });
        usersPopupVisible = false;
        if (this.setAtStringTimeout) clearTimeout(this.setAtStringTimeout);
      }

      if (usersPopupVisible) {
        if (this.setAtStringTimeout) clearTimeout(this.setAtStringTimeout);
        this.setAtStringTimeout = setTimeout(() => {
          const atString = content.slice(this.curAtIndex + 1, content.length);

          // 如果字符后跟2个空字符，则作为普通文本输入
          const reg = /(^\S*\s{2,}$)/;
          if (reg.test(atString)) {
            usersPopupVisible = false;
            this.setData({ usersPopupVisible: false });
            clearTimeout(this.setAtStringTimeout);
            return;
          }

          this.searchUser(atString);
          this.atString = atString;
        }, 500);
      }
    },

    async searchUser(atString = "") {
      const { list: userList } = await baseService.getRelationshipLists(
        1,
        1,
        atString,
        100
      );
      this.setData({ userList });
    },

    atUser() {
      const content = `${this.content || ""}@`;
      this.content = content;
      this.curAtIndex = content.lastIndexOf("@");
      this.setData({
        content,
        usersPopupVisible: true,
        focus: true,
      });
      this.searchUser();
    },

    selectUser(e) {
      const { index } = e.currentTarget.dataset;
      let { userList, attedUserList } = this.data;
      const user = userList[index];

      let attedUserIsExist = false;
      attedUserList.forEach((item) => {
        if (item.user_id === user.user_id) attedUserIsExist = true;
      });

      if (!attedUserIsExist) {
        attedUserList.push(user);
        const content = this.content.replace(`@${this.atString || ""}`, "");
        this.setData({
          attedUserList,
          content,
          usersPopupVisible: false,
        });
        this.content = content;
      } else {
        wx.showToast({
          title: "你已经@过Ta啦",
          icon: "none",
        });
      }
    },

    deleteAttedUser(e) {
      const { index } = e.currentTarget.dataset;
      let { attedUserList } = this.data;
      attedUserList.splice(index, 1);
      this.setData({ attedUserList });
    },

    sendMsg() {
      let { videoId, replyCommentId, content, attedUserList } = this.data;
      if (this.content !== content) content = this.content;
      if (!content) {
        wx.showToast({ title: "请输入消息", icon: "none" });
        return;
      }

      let atUserids = [];
      if (attedUserList.length) {
        attedUserList.forEach((item) => {
          atUserids.push(item.user_id);
        });
      }

      baseService.sendComments(
        videoId,
        content,
        replyCommentId,
        atUserids.join(),
        () => {
          this.triggerEvent("sendedMsg");
          this.resetData();
        }
      );
    },

    resetData() {
      this.content = "";
      this.atString = "";
      this.curAtIndex = 0;
      this.setData({
        content: "",
        focus: true,
        attedUserList: [],
        userList: [],
        usersPopupVisible: false,
      });
    },
  },
});
