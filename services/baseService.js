import { store } from "../store/index";
import { cleanObject } from "../utils/index";
import Base from "./base/index";

class BaseService extends Base {
  async getUserMobile(code) {
    return await this.post({
      url: `${this.baseUrl}/auth/wx_mp/mobile`,
      data: { code },
    });
  }

  async register(code, avatar, nickname, gender, mobile) {
    return await this.post({
      url: `${this.baseUrl}/auth/wx_mp/register`,
      data: { code, avatar, nickname, gender, mobile },
    });
  }

  async login() {
    const { code } = await this.wxLogin();
    const token = await this.post({
      url: `${this.baseUrl}/auth/wx_mp/login`,
      data: { code },
    });
    wx.setStorageSync("token", token || "");
  }

  async refreshToken() {
    const token = await this.get({ url: `${this.baseUrl}/auth/token_refresh` });
    if (token) {
      wx.setStorageSync("token", token);
    }
  }

  async getUserInfo() {
    const userInfo = await this.get({ url: `${this.baseUrl}/user_info` });
    store.setUserInfo(userInfo);
    return userInfo;
  }

  async getTimLoginInfo() {
    return await this.get({ url: `${this.baseUrl}/tim_login_info` });
  }

  async getAuthorInfo(authorId) {
    return await this.get({
      url: `${this.baseUrl}/author_info`,
      data: { authorId },
    });
  }

  async getRoomStatus() {
    return await this.get({ url: `${this.baseUrl}/media/live/room_status` });
  }

  async getAddressList() {
    return await this.get({ url: `${this.baseUrl}/address/list` });
  }

  async getOssConfig() {
    if (wx.getStorageSync("ossConfig")) {
      const ossConfig = JSON.parse(wx.getStorageSync("ossConfig"));
      if (new Date().getTime() < ossConfig.expire * 1000) {
        return ossConfig;
      }
    }
    const ossConfig = await this.get({ url: `${this.baseUrl}/oss_config` });
    wx.setStorage({
      key: "ossConfig",
      data: JSON.stringify(ossConfig),
    });
    return ossConfig;
  }

  async getQrCode(scene, page) {
    return await this.post({
      url: `${this.baseUrl}/oss_config`,
      data: { scene, page },
    });
  }

  async getPayParams(orderIds) {
    return await this.post({
      url: `${this.baseUrl}/order/pay_params`,
      data: { orderIds },
    });
  }

  async getScenicOrderPayParams(orderId) {
    return await this.post({
      url: `${this.baseUrl}/scenic/order/pay_params`,
      data: { orderId },
    });
  }

  async getHotelOrderPayParams(orderId) {
    return await this.post({
      url: `${this.baseUrl}/hotel/order/pay_params`,
      data: { orderId },
    });
  }

  async getMealTicketOrderPayParams(orderId) {
    return await this.post({
      url: `${this.baseUrl}/catering/meal_ticket/order/pay_params`,
      data: { orderId },
    });
  }

  async getSetMealOrderPayParams(orderId) {
    return await this.post({
      url: `${this.baseUrl}/catering/set_meal/order/pay_params`,
      data: { orderId },
    });
  }

  async followAuthor(authorId, success) {
    return await this.post({
      url: `${this.baseUrl}/fan/follow`,
      data: { authorId },
      success,
    });
  }

  async cancelFollowAuthor(authorId, success) {
    return await this.post({
      url: `${this.baseUrl}/fan/cancel_follow`,
      data: { authorId },
      success,
    });
  }

  async getFollowStatus(authorId) {
    return await this.get({
      url: `${this.baseUrl}/fan/follow_status`,
      data: { authorId },
    });
  }

  async subscribeAnchor(anchorId, success) {
    return await this.post({
      url: `${this.baseUrl}/media/live/subscribe`,
      data: { anchorId },
      success,
    });
  }

  async getUserVideoList({ id, page, limit = 10, loadingTitle }) {
    return await this.get({
      url: `${this.baseUrl}/media/short_video/user_list`,
      data: cleanObject({ id, page, limit }),
      loadingTitle,
    });
  }

  async getUserNoteList({ id, page, limit = 10, withComments = 0 }) {
    return await this.get({
      url: `${this.baseUrl}/media/tourism_note/user_list`,
      data: cleanObject({ id, page, limit, withComments }),
      loadingTitle: "加载中...",
    });
  }

  async getUserCollectVideoList(id, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/short_video/collect_list`,
      data: { id, page, limit },
    });
  }

  async getUserCollectNoteList(id, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/tourism_note/collect_list`,
      data: { id, page, limit },
      loadingTitle: "加载中...",
    });
  }

  async getUserLikeVideoList(id, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/short_video/like_list`,
      data: { id, page, limit },
    });
  }

  async getUserLikeNoteList(id, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/tourism_note/like_list`,
      data: { id, page, limit },
      loadingTitle: "加载中...",
    });
  }

  async getUserGoodsList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/goods/user_goods_list`,
      data: { page, limit },
    });
  }

  async toggleTourismNoteLikeStatus(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/tourism_note/toggle_like`,
      data: { id },
      success,
    });
  }

  async toggleTourismNoteCollectStatus(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/tourism_note/toggle_collect`,
      data: { id },
      success,
    });
  }

  async toggleShortVideoLikeStatus(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/short_video/toggle_like`,
      data: { id },
      success,
    });
  }

  async toggleShortVideoCollectStatus(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/short_video/toggle_collect`,
      data: { id },
      success,
    });
  }

  async submitCateringEvaluation(
    type,
    orderId,
    restaurantId,
    score,
    content,
    imageList,
    success
  ) {
    return await this.post({
      url: `${this.baseUrl}/catering/evaluation/add`,
      data: { type, orderId, restaurantId, score, content, imageList },
      success,
    });
  }
}

export default BaseService;
