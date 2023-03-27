import MediaService from "../../utils/mediaService";

class NoteService extends MediaService {
  async toggleLikeStatus(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/tourism_note/toggle_like`,
      data: { id },
      success,
    });
  }

  async toggleCollectStatus(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/tourism_note/toggle_collect`,
      data: { id },
      success,
    });
  }
}

export default NoteService;
