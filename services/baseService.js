import { store } from "../store/index";
import { cleanObject, randomNickname } from "../utils/index";
import Base from "./base/index";

class BaseService extends Base {
  async getLocationInfo() {
    const { authSetting } = await this.getSetting();
    if (authSetting["scope.userLocation"] !== false) {
      const { longitude, latitude } = await this.getLocation();
      store.setLocationInfo({ longitude, latitude });
      return { longitude, latitude };
    }
  }

  async getUserMobile(code) {
    return await this.post({
      url: `${this.baseUrl}/auth/wx_mp/mobile`,
      data: { code }
    });
  }

  async register(code, mobile, superiorId) {
    return await this.post({
      url: `${this.baseUrl}/auth/wx_mp/register`,
      data: cleanObject({
        code,
        avatar: "https://static.tiddler.cn/mp/default_avatar.png",
        nickname: `用户${randomNickname()}`,
        mobile,
        superiorId,
        gender: 0
      })
    });
  }

  async login() {
    const { code } = await this.wxLogin();
    const token = await this.post({
      url: `${this.baseUrl}/auth/wx_mp/login`,
      data: { code }
    });
    wx.setStorageSync("token", token || "");
  }

  async refreshToken() {
    const token = await this.get({ url: `${this.baseUrl}/auth/token_refresh` });
    if (token) {
      wx.setStorageSync("token", token);
    }
  }

  async getWaybillToken(id) {
    return await this.get({
      url: `${this.baseUrl}/order/waybill_token`,
      data: { id }
    });
  }

  async getMyInfo() {
    const userInfo = await this.get({ url: `${this.baseUrl}/user/me` });
    store.setUserInfo(userInfo);
    return userInfo;
  }

  async updateMyInfo(userInfo, success) {
    return await this.post({
      url: `${this.baseUrl}/user/update`,
      data: cleanObject(userInfo),
      success
    });
  }

  async getUserInfo(userId) {
    return this.get({
      url: `${this.baseUrl}/user/info`,
      data: { userId }
    });
  }

  async getTimLoginInfo() {
    return await this.get({ url: `${this.baseUrl}/user/tim_login_info` });
  }

  async getAuthorInfo(authorId) {
    return await this.get({
      url: `${this.baseUrl}/user/author_info`,
      data: { authorId }
    });
  }

  async getAdInfo() {
    return await this.get({ url: `${this.baseUrl}/banner/pop` });
  }

  async getBannerList(position = 2) {
    return await this.get({
      url: `${this.baseUrl}/banner/list`,
      data: { position }
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
      data: JSON.stringify(ossConfig)
    });
    return ossConfig;
  }

  async getPayParams(orderIds) {
    return await this.post({
      url: `${this.baseUrl}/order/pay_params`,
      data: { orderIds }
    });
  }

  async getScenicPayParams(orderId) {
    return await this.post({
      url: `${this.baseUrl}/scenic/order/pay_params`,
      data: { orderId }
    });
  }

  async getHotelPayParams(orderId) {
    return await this.post({
      url: `${this.baseUrl}/hotel/order/pay_params`,
      data: { orderId }
    });
  }

  async getMealTicketPayParams(orderId) {
    return await this.post({
      url: `${this.baseUrl}/catering/meal_ticket/order/pay_params`,
      data: { orderId }
    });
  }

  async getSetMealPayParams(orderId) {
    return await this.post({
      url: `${this.baseUrl}/catering/set_meal/order/pay_params`,
      data: { orderId }
    });
  }

  async followAuthor(authorId, success) {
    return await this.post({
      url: `${this.baseUrl}/fan/follow`,
      data: { authorId },
      success
    });
  }

  async cancelFollowAuthor(authorId, success) {
    return await this.post({
      url: `${this.baseUrl}/fan/cancel_follow`,
      data: { authorId },
      success
    });
  }

  async getFollowStatus(authorId) {
    return await this.get({
      url: `${this.baseUrl}/fan/follow_status`,
      data: { authorId }
    });
  }

  async subscribeAnchor(anchorId, success) {
    return await this.post({
      url: `${this.baseUrl}/media/live/subscribe`,
      data: { anchorId },
      success
    });
  }

  async getUserVideoList({ id, page, limit = 10, loadingTitle }) {
    return await this.get({
      url: `${this.baseUrl}/media/short_video/user_list`,
      data: cleanObject({ id, page, limit }),
      loadingTitle
    });
  }

  async getUserNoteList({
    id,
    page,
    limit = 10,
    withComments = 0,
    loadingTitle
  }) {
    return await this.get({
      url: `${this.baseUrl}/media/tourism_note/user_list`,
      data: cleanObject({ id, page, limit, withComments }),
      loadingTitle
    });
  }

  async getUserCollectVideoList(id, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/short_video/collect_list`,
      data: { id, page, limit }
    });
  }

  async getUserCollectNoteList(id, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/tourism_note/collect_list`,
      data: { id, page, limit }
    });
  }

  async getUserLikeVideoList(id, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/short_video/like_list`,
      data: { id, page, limit }
    });
  }

  async getUserLikeNoteList(id, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/tourism_note/like_list`,
      data: { id, page, limit }
    });
  }

  async getUserGoodsList(page, status = 1, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/shop/goods/list`,
      data: { status, page, limit }
    });
  }

  async shareTourismNote(id, scene, page, success) {
    return await this.post({
      url: `${this.baseUrl}/media/tourism_note/share`,
      data: { id, scene, page },
      success
    });
  }

  async toggleTourismNoteLikeStatus(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/tourism_note/toggle_like`,
      data: { id },
      success
    });
  }

  async toggleTourismNoteCollectStatus(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/tourism_note/toggle_collect`,
      data: { id },
      success
    });
  }

  async shareShortVideo(id, scene, page, success) {
    return await this.post({
      url: `${this.baseUrl}/media/short_video/share`,
      data: { id, scene, page },
      success
    });
  }

  async toggleShortVideoLikeStatus(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/short_video/toggle_like`,
      data: { id },
      success
    });
  }

  async toggleShortVideoCollectStatus(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/short_video/toggle_collect`,
      data: { id },
      success
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
      success
    });
  }

  async getQrCode(scene, page) {
    return await this.get({
      url: `${this.baseUrl}/wx/qr_code`,
      data: { scene, page },
      loadingTitle: "加载中..."
    });
  }

  async getHistoryKeywords() {
    return await this.get({
      url: `${this.baseUrl}/keyword/list`,
      loadingTitle: "加载中..."
    });
  }

  async saveKeywords(keywords) {
    return await this.post({
      url: `${this.baseUrl}/keyword/add`,
      data: { keywords }
    });
  }

  async clearHistoryKeywords() {
    return await this.post({
      url: `${this.baseUrl}/keyword/clear`
    });
  }

  async getHotKeywords() {
    return await this.get({
      url: `${this.baseUrl}/keyword/hot_list`,
      loadingTitle: "加载中..."
    });
  }

  async searchMediaList(keywords, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/search`,
      data: { keywords, page, limit }
    });
  }

  async searchVideoList(keywords, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/short_video/search`,
      data: { keywords, page, limit }
    });
  }

  async searchNoteList(keywords, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/tourism_note/search`,
      data: { keywords, page, limit }
    });
  }

  async searchLiveRoomList(keywords, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/live/search`,
      data: { keywords, page, limit }
    });
  }

  async searchScenicList(keywords, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/scenic/search`,
      data: { keywords, page, limit }
    });
  }

  async searchHotelList(keywords, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/hotel/search`,
      data: { keywords, page, limit }
    });
  }

  async searchRestaurantList(keywords, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/catering/restaurant/search`,
      data: { keywords, page, limit }
    });
  }

  async getShopCategoryOptions() {
    return await this.get({ url: `${this.baseUrl}/shop/category_options` });
  }

  async getGoodsCategoryOptions(shopCategoryId) {
    return await this.get({
      url: `${this.baseUrl}/goods/category_options`,
      data: { shopCategoryId }
    });
  }

  async searchGoodsList({
    keywords,
    categoryId,
    sort,
    order,
    page,
    limit = 10
  }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/goods/search`,
        data: cleanObject({ keywords, categoryId, sort, order, page, limit })
      })) || {};
    return list;
  }

  async getRecommedGoodsList(goodsIds, shopCategoryIds, page, limit = 10) {
    const { list = [] } =
      (await this.post({
        url: `${this.baseUrl}/goods/recommend_list`,
        data: { goodsIds, shopCategoryIds, page, limit }
      })) || {};
    return list;
  }

  async searchUserList({ keywords, page, limit = 10 }) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/user/search`,
        data: { keywords, page, limit }
      })) || {};
    return list;
  }

  async getScenicOrderTotal() {
    const total = await this.get({
      url: `${this.baseUrl}/scenic/order/total`
    });
    store.setScenicOrderTotal(total);
    return total;
  }

  async getGoodsOrderTotal() {
    const total = await this.get({
      url: `${this.baseUrl}/order/total`
    });
    store.setGoodsOrderTotal(total);
    return total;
  }
}

export default BaseService;
