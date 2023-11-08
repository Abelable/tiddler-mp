import MediaService from "../../../utils/mediaService";

class VideoService extends MediaService {
  async toggleLikeStatus(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/short_video/toggle_like`,
      data: { id },
      success
    })
  }

  async toggleCollectStatus(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/short_video/toggle_collect`,
      data: { id },
      success
    })
  }
}

export default VideoService
