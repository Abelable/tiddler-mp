import BaseService from '../../../../../services/baseService'
import { cleanObject } from '../../../../../utils/index'

class NoteService extends BaseService {
  async createNote(noteInfo, success) {
    return await this.post({ 
      url: `${this.baseUrl}/media/tourism_note/create`, 
      data: cleanObject(noteInfo),
      success
    })
  }
}

export default NoteService
