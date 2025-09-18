import { createStoreBindings } from "mobx-miniprogram-bindings";
import { store } from "../../../../store/index";
import tim from "../../../../utils/tim/index";
import ChatService from "./utils/chatService";

const chatService = new ChatService();
const { statusBarHeight } = getApp().globalData.systemInfo;

Page({
  data: {
    statusBarHeight,
    containerBottom: 0,
    scrollTop: "",
    friendId: "",
    friendName: "",
    friendAvatarUrl: "",
    content: "", // 输入框的文本值
    emojiWrapVisiabel: false,
    moreOperateVisiabel: false,
    productInfo: null,
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

    // const {
    //   userId: friendId,
    //   name: friendName,
    //   avatar: friendAvatarUrl,
    //   productType,
    //   productId,
    //   orderId
    // } = options;

    // if (productId) {
    //   switch (+productType) {
    //     case 1:
    //       this.setScenicInfo(productId);
    //       break;
    //     case 2:
    //       this.setHotelInfo(productId);
    //       break;
    //     case 3:
    //       this.setRestaurantInfo(productId);
    //       break;
    //     case 4:
    //       this.setGoodsInfo(productId);
    //       break;
    //   }
    // }

    // if (orderId) {
    //   switch (+orderId) {
    //     case 1:
    //       this.setScenicOrderInfo(orderId);
    //       break;
    //     case 2:
    //       this.setHotelOrderInfo(orderId);
    //       break;
    //     case 4:
    //       this.setGoodsOrderInfo(orderId);
    //       break;
    //     case 5:
    //       this.setMealTicketOrderInfo(orderId);
    //       break;
    //     case 6:
    //       this.setSetMealOrderInfo(orderId);
    //       break;
    //   }
    // }

    // wx.setNavigationBarTitle({ title: friendName });
    // this.setData({ friendId, friendName, friendAvatarUrl });

    // const conversationID = `C2C${friendId}`;
    // tim.setMessageRead(conversationID);
    // tim.getMsgList(conversationID);
  },

  async setScenicInfo(scenicId) {
    const { id, imageList, name, price } = await chatService.getScenicInfo(
      scenicId
    );
    this.setData({
      productInfo: { type: 1, id, cover: imageList[0], name, price }
    });
  },

  async setHotelInfo(hotelId) {
    const { id, cover, name, price } = await chatService.getHotelInfo(hotelId);
    this.setData({
      productInfo: { type: 2, id, cover, name, price }
    });
  },

  async setRestaurantInfo(restaurantId) {
    const { id, imageList, name, price } = await chatService.getRestaurantInfo(
      restaurantId
    );
    this.setData({
      productInfo: { type: 3, id, cover: imageList[0], name, price }
    });
  },

  async setGoodsInfo(goodsId) {
    const { id, imageList, name, price } = await chatService.getGoodsInfo(
      goodsId
    );
    this.setData({
      productInfo: { type: 4, id, cover: imageList[0], name, price }
    });
  },

  async setScenicOrderInfo(orderId) {
    const { id, orderSn, ticketInfo, paymentAmount, createdAt } =
      (await chatService.getScenicOrderDetail(orderId)) || {};
    const { name: productName, number: productNum, scenicList } = ticketInfo;
    this.setData({
      orderInfo: {
        type: 1,
        id,
        orderSn,
        cover: scenicList[0].cover,
        productName,
        productNum,
        paymentAmount,
        createdAt
      }
    });
  },

  async setHotelOrderInfo(orderId) {
    const { id, orderSn, roomInfo, paymentAmount, createdAt } =
      (await chatService.getScenicOrderDetail(orderId)) || {};
    const { hotelName, typeName, number: productNum, imageList } = roomInfo;
    this.setData({
      orderInfo: {
        type: 2,
        id,
        orderSn,
        cover: imageList[0],
        productName: `${hotelName}｜${typeName}`,
        productNum,
        paymentAmount,
        createdAt
      }
    });
  },

  async setGoodsOrderInfo(orderId) {
    const { id, orderSn, goodsList, paymentAmount, createdAt } =
      (await chatService.getGoodsOrderDetail(orderId)) || {};
    this.setData({
      orderInfo: {
        type: 4,
        id,
        orderSn,
        cover: goodsList[0].cover,
        productName: goodsList[0].name,
        productNum: goodsList.length,
        paymentAmount,
        createdAt
      }
    });
  },

  async setMealTicketOrderInfo(orderId) {
    const { id, orderSn, ticketInfo, paymentAmount, createdAt } =
      (await chatService.getMealTicketOrderDetail(orderId)) || {};
    const {
      restaurantCover: cover,
      restaurantName,
      originalPrice,
      number: productNum
    } = ticketInfo;
    this.setData({
      orderInfo: {
        type: 5,
        id,
        orderSn,
        cover,
        productName: `${restaurantName}｜${originalPrice}元代金券`,
        productNum,
        paymentAmount,
        createdAt
      }
    });
  },

  async setSetMealOrderInfo(orderId) {
    const { id, orderSn, setMealInfo, paymentAmount, createdAt } =
      (await chatService.getMealTicketOrderDetail(orderId)) || {};
    const { cover, restaurantName, name, number: productNum } = setMealInfo;
    this.setData({
      orderInfo: {
        type: 6,
        id,
        orderSn,
        cover,
        productName: `${restaurantName}｜${name}`,
        productNum,
        paymentAmount,
        createdAt
      }
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
    const { type } = e.currentTarget.dataset;
    const { productInfo, orderInfo, friendId } = this.data;
    const msg = JSON.stringify({
      type: type === 1 ? "product" : "order",
      value: type === 1 ? productInfo : orderInfo
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

  onUnload() {
    this.storeBindings.destroyStoreBindings();
  }
});
