import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../../store/index";
import { checkLogin } from "../../../../../../../utils/index";
import NoteService from "../../utils/noteService";

const noteService = new NoteService();

Component({
  options: {
    addGlobalClass: true
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ["userInfo"],
  },
  
  properties: {
    item: Object,
    index: Number,
  },

  data: {
    contentFold: true
  },

  methods: {
    previewImage(e) {
      const { current } = e.currentTarget.dataset
      wx.previewImage({ current, urls: this.data.imgs })
    },

    follow() {
      checkLogin(() => {
        const { id } = this.properties.item.authorInfo;
        noteService.followAuthor(id, () => {
          this.setData({
            [`item.isFollow`]: true,
          });
        });
      });
    },

    navToUserCenter() {
      const { id } = this.properties.item.authorInfo;
      if (store.userInfo.id !== id) {
        wx.navigateTo({
          url: `/pages/subpages/index/short-video/subpages/personal-center/index?id=${user_id}`,
        });
      }
    },

    like() {
      checkLogin(() => {
        let { id, isLike, likeNumber } = this.properties.item;
        noteService.toggleLikeStatus(id, () => {
          this.setData({
            [`item.isLike`]: !isLike,
            [`item.likeNumber`]: isLike ? --likeNumber : ++likeNumber,
          });
        });
      });
    },

    collect() {
      checkLogin(() => {
        let { id, isCollected, collectionTimes } = this.properties.item;
        noteService.toggleCollectStatus(id, () => {
          this.setData({
            [`item.isCollected`]: !isCollected,
            [`item.collectionTimes`]: isCollected ? --collectionTimes : ++collectionTimes,
          });
        });
      });
    },

    comment() {
      checkLogin(() => {
        this.triggerEvent("comment");
      });
    },

    more() {
      this.triggerEvent("more");
    },
  }
})