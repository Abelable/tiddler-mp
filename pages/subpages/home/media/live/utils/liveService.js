import MediaService from "../../../utils/mediaService";

class LiveService extends MediaService {
  async createLive(roomInfo, success) {
    return await this.post({
      url: `${this.baseUrl}/media/live/create`,
      data: roomInfo,
      success,
    });
  }

  async getNoticeRoomInfo() {
    return await this.get({
      url: `${this.baseUrl}/media/live/notice_room`,
      loadingTitle: "正在加载",
    });
  }

  async deleteNoticeRoom(success) {
    return await this.post({
      url: `${this.baseUrl}/media/live/delete_notice_room`,
      success,
    });
  }

  async getPushRoomInfo() {
    return await this.get({
      url: `${this.baseUrl}/media/live/push_room`,
      loadingTitle: "正在加载",
    });
  }

  async startLive() {
    return await this.post({
      url: `${this.baseUrl}/media/live/start`,
    });
  }

  async stopLive(success) {
    return await this.post({
      url: `${this.baseUrl}/media/live/stop`,
      success,
    });
  }

  async savePraiseCount(id, count) {
    return await this.post({
      url: `${this.baseUrl}/media/live/praise`,
      data: { id, count },
    });
  }

  async getPushRoomGoodsList(status) {
    return await this.get({
      url: `${this.baseUrl}/media/live/push_room_goods_list`,
      data: { status },
      loadingTitle: "正在加载",
    });
  }

  async listingGoods(goodsIds, success) {
    return await this.post({
      url: `${this.baseUrl}/media/live/listing_goods`,
      data: { goodsIds },
      success,
    });
  }

  async delistingGoods(goodsIds, success) {
    return await this.post({
      url: `${this.baseUrl}/media/live/de_listing_goods`,
      data: { goodsIds },
      success,
    });
  }

  async setHotGoods(goodsId, success) {
    return await this.post({
      url: `${this.baseUrl}/media/live/set_hot_goods`,
      data: { goodsId },
      success,
    });
  }

  async cancelHotGoods(goodsId, success) {
    return await this.post({
      url: `${this.baseUrl}/media/live/cancel_hot_goods`,
      data: { goodsId },
      success,
    });
  }

  async getRoomList(id, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/live/list`,
      data: { id, page, limit },
    });
  }

  async joinRoom(id) {
    return await this.post({
      url: `${this.baseUrl}/media/live/join_room`,
      data: { id },
    });
  }

  async getRoomGoodsList(id, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/live/goods_list`,
      data: { id, page, limit },
      loadingTitle: "正在加载",
    });
  }
}

export default LiveService;
