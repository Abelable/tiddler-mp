import MediaService from "../../../utils/mediaService";

class VideoService extends MediaService {
  async createViewHistory(id) {
    return await this.post({
      url: `${this.baseUrl}/media/short_video/create_history`,
      data: { id }
    });
  }
}

export default VideoService
