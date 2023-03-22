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
    const userInfo = await this.get({
      url: `${this.baseUrl}/user_info`,
      loadingTitle: "加载中...",
    });
    store.setUserInfo(userInfo);
    return userInfo;
  }

  async getTimLoginInfo() {
    return await this.get({ url: `${this.baseUrl}/tim_login_info` });
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

  async getOrderList({ shopId, status, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/order/list`,
        data: cleanObject({ status, page, limit, shopId }),
        loadingTitle: "加载中...",
      })) || {};
    return list;
  }

  async followAuthor(authorId, success) {
    return await this.post({
      url: `${this.baseUrl}/fan/follow`,
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

  async getUserNoteList(page, limit = 10, id = 0) {
    return await this.get({
      url: `${this.baseUrl}/media/tourism_note/user_list`,
      data: { page, limit, id },
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
    });
  }

  async getUserGoodsList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/goods/user_goods_list`,
      data: { page, limit },
    });
  }
}

export default BaseService;
