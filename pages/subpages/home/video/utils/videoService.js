import BaseService from '../../../../../services/baseService'
import { cleanObject } from '../../../../../utils/index'

class VideoService extends BaseService {
  async getVideoList(page, id = 0, authorId = 0, limit = 10) {
    return await this.get({ 
      url: `${this.baseUrl}/media/short_video/list` , 
      data: cleanObject({ page, limit, id, authorId }) 
    })
  }
}

export default VideoService
