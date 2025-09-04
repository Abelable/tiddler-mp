import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import tim from "../../../../utils/tim/index";
import { emojiName, emojiMap, emojiUrl } from "../../../../utils/tim/emojiMap";
import { judgeOrderStatus } from "../../../../utils/judgeOrderStatus";
import ChatService from "./utils/chatService";

const chatService = new ChatService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    emojiName,
    emojiMap,
    emojiUrl,
    containerBottom: 0,
    scrollTop: "",
    friendId: "",
    friendName: "",
    friendAvatarUrl: "",
    content: "", // 输入框的文本值
    emojiWrapVisiabel: false,
    moreOperateVisiabel: false,
    goodsInfo: null,
    orderInfo: null,
    // 限购相关
    limitTips: "",
    limitBuyNum: 0,
    limitStartBuyNum: 0
  },

  onLoad(options) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["userInfo", "msgList"]
    });

    const {
      userId: friendId,
      name: friendName,
      avatar: friendAvatarUrl,
      goodsId,
      orderId
    } = options;

    goodsId && this.setGoodsInfo(goodsId);
    orderId && this.setOrderInfo(orderId);

    wx.setNavigationBarTitle({ title: friendName });
    this.setData({ friendId, friendName, friendAvatarUrl });

    const conversationID = `C2C${friendId}`;
    tim.setMessageRead(conversationID);
    tim.getMsgList(conversationID);
  },

  async setGoodsInfo(goodsId) {
    const { id, imageList, name, price } = await chatService.getGoodsInfo(
      goodsId
    );
    this.setData({ goodsInfo: { id, cover: imageList[0], name, price } });
  },

  async setOrderInfo(orderId) {
    const orderInfo = (await chatService.getOrderDetail(orderId)) || {};
    const { order_status, pay_status, shipping_status } = orderInfo;
    this.setData({
      orderInfo,
      compositeStatus: judgeOrderStatus(
        order_status,
        pay_status,
        shipping_status
      )
    });
  },

  showKeyBoard(e) {
    const { emojiWrapVisiabel, moreOperateVisiabel, containerBottom } =
      this.data;
    emojiWrapVisiabel && this.setData({ emojiWrapVisiabel: false });
    moreOperateVisiabel && this.setData({ moreOperateVisiabel: false });
    !containerBottom && this.setData({ containerBottom: e.detail.height });
  },

  hideKeyBoard() {
    this.data.containerBottom && this.setData({ containerBottom: 0 });
  },

  showEmojiWrap() {
    const { emojiWrapVisiabel, moreOperateVisiabel, containerBottom } =
      this.data;
    containerBottom && this.setData({ containerBottom: 0 });
    moreOperateVisiabel && this.setData({ moreOperateVisiabel: false });
    !emojiWrapVisiabel && this.setData({ emojiWrapVisiabel: true });
  },

  showMoreOperate() {
    const { emojiWrapVisiabel, moreOperateVisiabel, containerBottom } =
      this.data;
    containerBottom && this.setData({ containerBottom: 0 });
    emojiWrapVisiabel && this.setData({ emojiWrapVisiabel: false });
    !moreOperateVisiabel && this.setData({ moreOperateVisiabel: true });
  },

  blurInput() {
    const { emojiWrapVisiabel, moreOperateVisiabel, containerBottom } =
      this.data;
    containerBottom && this.setData({ containerBottom: 0 });
    emojiWrapVisiabel && this.setData({ emojiWrapVisiabel: false });
    moreOperateVisiabel && this.setData({ moreOperateVisiabel: false });
  },

  getContent(e) {
    this.setData({
      content: e.detail.value
    });
  },

  chooseEmoji(e) {
    this.setData({
      content: `${this.data.content}${e.currentTarget.dataset.emoji}`
    });
  },

  sendMsg() {
    const { content, friendId } = this.data;
    if (content) {
      tim.sendMsg(content, friendId);
      this.setData({ content: "" });
      this.blurInput();
    } else wx.showToast({ title: "消息不能为空" });
  },

  sendCustomMsg(e) {
    const {type} = e.currentTarget.dataset;
    const { goodsInfo, orderInfo, friendId } = this.data;
    let msgData;
    switch (type) {
      case "1":
        msgData = goodsInfo;
        break;
      case "2":
        msgData = orderInfo;
        break;
    }
    msgData.type = type;
    const msg = JSON.stringify({
      type: type,
      data: JSON.stringify(msgData)
    });
    tim.sendCustomMsg(msg, friendId);
  },

  sendPhoto(e) {
    let name = e.currentTarget.dataset.name;
    if (name === "album") {
      this.chooseImage(name);
    } else if (name === "camera") {
      wx.getSetting({
        success: res => {
          if (!res.authSetting["scope.camera"]) {
            // 无权限，跳转设置权限页面
            wx.authorize({
              scope: "scope.camera",
              success: () => {
                this.chooseImage(name);
              }
            });
          } else {
            this.chooseImage(name);
          }
        }
      });
    }
  },

  chooseImage(name) {
    wx.chooseImage({
      sourceType: [name],
      count: 1,
      success: res => {
        tim.sendImage(res, this.data.friendId);
      }
    });
    this.blurInput();
  },

  toGoodsDetail(e) {
    wx.navigateTo({
      url: `/pages/subpages/mall/goods/subpages/goods-detail/index?id=${e.currentTarget.dataset.id}`
    });
  },

  toOrderDetail(e) {
    wx.navigateTo({
      url: `/pages/subpages/mine/order/subpages/goods-order/order-detail/index?id=${e.currentTarget.dataset.id}`
    });
  },

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  }
});
