import Base from './base/index'
import { store } from '../store/index'
import { tmplId } from '../config'

class BaseService extends Base {
  async checkIdentify() {
    const { is_can_buy_invite_package } = await this.get({ url: `${this.baseUrl}/api/v4/invitePackage/isCanBuyInvitePackage` })
    const { identity } = await this.getMineInfo()
    let { is_expired } = await this.checkIsExpired()
    store.setsettlePageVisible(!!is_can_buy_invite_package)
    store.setUserInfo({...store.userInfo, isAnchor: identity != 1 && !is_expired })
  }

  async getMineInfo() {
    return await this.get({ url: `${this.baseUrl}/api/v4/user/profile` })
  }

  async checkIsExpired() {
    return await this.get({ url: `${this.baseUrl}/api/v4/anchor/isExpired` })
  }

  async getMsgCenterInfo() {
    return await this.post({ url: `${this.baseUrl}chat/message-center/msg-count` })
  }

  async getNewsList(branch, page = 1, read_time = 0) {
    return await this.post({ url: `${this.baseUrl}chat/message-center/msg-list`, data: { branch, page, read_time } })
  }

  async getCartCount() {
    const { cart_number } = await this.get({ url: `${this.baseUrl}/api/v4/cart/cartNum` })
    store.updateCartCount(Number(cart_number))
  }

  async addCart(goods_id, spec, num, rec_type = 10) {
    await this.post({ 
      url: `${this.baseUrl}/api/v4/cart/add`,
      data: { goods_id, spec, num, rec_type },
      success() {
        rec_type !== 10 && store.updateCartCount(store.cartCount + num)
      }
    })
  }

  async updateCartGoods({ recId, count, spec = '' }) {
    return await this.post({ url: `${this.baseUrl}/api/v4/cart/update`, data: { rec_id: recId, num: count, spec } })
  }

  async updateUserInfo(userName, userAvatar) {
    store.setUserInfo({ ...store.userInfo, userName, userAvatar })
    return await this.post({ url: `${this.baseUrl}/api/v4/user/update`, data: { nick_name: userName, user_picture: userAvatar } })
  }

  async getTimAccount() {
    return await this.post({ url: `${this.baseUrl}lv/user/tim-login-info` })
  }

  async followAnchor(f_user_id, live_room_id = '') {
    await this.post({ url: `${this.baseUrl}lv/relationship/follow`, data: { f_user_id, live_room_id } })
  }

  async unFollowAnchor(uf_user_id) {
    await this.post({ url: `${this.baseUrl}lv/relationship/unfollow`, data: { uf_user_id }})
  }

  async subscribeAnchor(room_id,success,fail) {
    let wxSubRes = await this.requestSubscribeMessage(tmplId)
    if (wxSubRes[tmplId] === 'accept') {
       return this.post({ 
        url: `${this.baseUrl}lv/live/preview-destine`, 
        data: { switch: 1, roomId:room_id },
        success,
        fail
      })
    } else wx.showToast({ title: '订阅失败，如未点击取消，请到小程序的设置中打开授权', icon: 'none', duration: 3000 })
  }
  async unSubscribeAnchor(room_id,success,fail){
    return this.post({ 
      url: `${this.baseUrl}lv/live/preview-destine`, 
      data: { switch: 0, roomId:room_id },
      success,
      fail
    })
  }

  async uploadFile(filePath) {
    const _filePath = `data:image/jpeg;base64,${wx.getFileSystemManager().readFileSync(filePath, "base64")}`
    return await this.post({ url: `${this.baseUrl}/api/v4/user/material`, data: { 'file[0][content]': _filePath, 'file[1][content]': _filePath } })
  }

  async getSupplierInfo(supplier_id) {
    return await this.post({ url: `${this.baseUrl}tbb/supplier/index`, data: { supplier_id } })
  }

  async getGoodsInfo(goods_id) {
    return await this.post({ 
      url: `${this.baseUrl}tbb/goods-detail/index`, 
      data: { goods_id },
      fail(res) {
        wx.showToast({
          title: res.data.message, 
          icon: 'none', 
          success() { 
            setTimeout(() => { wx.navigateBack() }, 2000)
          }
        })
      }
    })
  }

  async getOrderDetail(order_id) {
    return await this.post({ url: `${this.baseUrl}/api/v4/order/detail`, data: { order_id } })
  }


  async prepay(order_sn) {
    return await this.post({ url: `${this.baseUrl}/api/v4/payment/wxapp_change_app_payment`, data: { order_sn, openid: wx.getStorageSync("openid"), pay_code: "wxpay", platform: "MP-WEIXIN", pay_appid_type: 1 } })
  }

  /**
   * 记录用户在观看直播的过程中添加购物车的次数
   */
  async recordUserAddCart(room_id, group_id) {
    await this.post({ url: `${this.baseUrl}lv/goods/live-product-add-car`, data: { room_id, group_id, nick_name: store.userInfo.userName } })
  }

  /**
   * 记录用户在观看直播的过程中进入商品详情的次数
   */
  async recordUserToViewGoodsDetail(room_id) {
    await this.post({ url: `${this.baseUrl}lv/goods/product-click-save`, data: { room_id } })
  }

  async getServiceTime() {
    return await this.get({ url: `${this.baseUrl}/api/v4/time` })
  }

  async getShopRoomList(shop_id, lastId) {
    return await this.post({ url: `${this.baseUrl}lv/owner-live/shop-room-list`, data: { shop_id, lastId } })
  }

  async getRecommendGoodsLists(module = 1) {
    return await this.post({ url: `${this.baseUrl}lv/live-front/recommend-goods`, data: { module }})
  }

  async getNewBonus(type_id, success) {
    return await this.post({ url: `${this.baseUrl}tbb/bonus/get-new-bonus`, data: { type_id } , success })
  }

  async getCommentsLists({ videoId, parentId = 0, page = 1 }) {
    return await this.post({ url: `${this.baseUrl}lv/short-video/comment-list` , data: { video_id: videoId, parent_id: parentId, page } })
  }

  async sendComments(video_id, content, comment_id = 0, success) {
    return await this.post({ url: `${this.baseUrl}lv/short-video/create-comment`, data: { video_id, content, comment_id }, success })
  }
  
  async togglePraiseStatus(video_id) {
    await this.post({ url: `${this.baseUrl}lv/short-video/video-like`, data: { video_id } })
  }

  async record(goods_id, type) {
    await this.post({ url: `${this.baseUrl}/api/auction/home/record`, data: { goods_id, type } })
  }

  async getYoubaoWelcomeAdInfo() {
    return await this.get({ url: `${this.youbaoUrl}/api/v1/popularize/youbo/open` })
  }
}

export default BaseService
