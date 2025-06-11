import MediaService from "../../../utils/mediaService";

class NoteService extends MediaService {
  async getNoteInfo(id) {
    return await this.get({
      url: `${this.baseUrl}/media/tourism_note/detail`,
      data: {id}
    });
  }
}

export default NoteService;
