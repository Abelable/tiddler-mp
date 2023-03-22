import BaseService from '../../../../../../services/baseService'
import { cleanObject } from '../../../../../../utils/index'

class NoteService extends BaseService {
  async getNoteList(page, id = 0, authorId = 0, limit = 10) {
    return await this.get({ 
      url: `${this.baseUrl}/media/tourism_note/list` , 
      data: cleanObject({ page, limit, id, authorId }),
      loadingTitle: '加载中...'
    })
  }

  async toggleLikeStatus(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/tourism_note/toggle_like`,
      data: { id },
      success
    })
  }

  async toggleCollectStatus(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/tourism_note/toggle_collect`,
      data: { id },
      success
    })
  }
}

export default NoteService
