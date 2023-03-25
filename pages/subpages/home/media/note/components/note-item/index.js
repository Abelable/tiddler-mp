import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { store } from "../../../../../../../store/index";
import { checkLogin } from "../../../../../../../utils/index";

Component({
  options: {
    addGlobalClass: true,
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
    contentFold: true,
  },

  methods: {
    previewImage(e) {
      const { current } = e.currentTarget.dataset;
      const urls = this.properties.item.imageList;
      wx.previewImage({ current, urls });
    },

    toggleContentFold() {
      this.setData({
        contentFold: !this.data.contentFold,
      });
    },

    follow() {
      checkLogin(() => {
        const { index: curNoteIdx } = this.properties;
        this.triggerEvent("follow", { curNoteIdx });
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

    navToGoodsDetail() {
      const { id } = this.properties.item.goodsInfo;
      const url = `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${id}`;
      wx.navigateTo({ url });
    },

    like() {
      checkLogin(() => {
        const { index: curNoteIdx } = this.properties;
        this.triggerEvent("like", { curNoteIdx });
      });
    },

    collect() {
      checkLogin(() => {
        const { index: curNoteIdx } = this.properties;
        this.triggerEvent("collect", { curNoteIdx });
      });
    },

    showCommentPopup() {
      const { index: curNoteIdx } = this.properties;
      this.triggerEvent("showCommentPopup", { curNoteIdx });
    },

    comment() {
      checkLogin(() => {
        const { index: curNoteIdx } = this.properties;
        this.triggerEvent("comment", { curNoteIdx });
      });
    },

    share() {
      checkLogin(() => {
        const { index: curNoteIdx } = this.properties;
        this.triggerEvent("share", { curNoteIdx });
      });
    },

    more() {
      const { index: curNoteIdx } = this.properties;
      this.triggerEvent("more", { curNoteIdx });
    },
  },
});
