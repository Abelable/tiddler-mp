import BaseService from '../../../../../services/baseService'
import { cleanObject } from '../../../../../utils/index'

class VideoService extends BaseService {
  // title, cover, videoUrl, goodsId, lng, lat, addressDetail, isSercet,

  async createVideo(videoInfo, success) {
    return await this.post({ 
      url: `${this.baseUrl}/media/short_video/create`, 
      data: cleanObject(videoInfo),
      success
    })
  }
}

export default VideoService
