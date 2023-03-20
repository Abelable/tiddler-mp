import BaseService from "../../../../../services/baseService";

class LiveService extends BaseService {
  async saveLiveChatMsg(id, content, identity) {
    return await this.post({
      url: `${this.baseUrl}/media/live/comment`,
      data: { id, content, identity },
    });
  }

  async addVideoComment(mediaId, content, commentId) {
    return await this.post({
      url: `${this.baseUrl}/media/short_video/comment`,
      data: cleanObject({ mediaId, commentId, content }),
    });
  }

  async getVideoCommentList(mediaId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/short_video/comment_list`,
      data: { mediaId, page, limit },
      loadingTitle: "加载中...",
    });
  }

  async getVideoReplyCommentList(mediaId, commentId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/short_video/reply_comment_list`,
      data: { mediaId, commentId, page, limit },
      loadingTitle: "加载中...",
    });
  }

  async addNoteComment(mediaId, content, commentId) {
    return await this.post({
      url: `${this.baseUrl}/media/tourism_note/comment`,
      data: cleanObject({ mediaId, commentId, content }),
    });
  }

  async getNoteCommentList(mediaId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/tourism_note/comment_list`,
      data: { mediaId, page, limit },
      loadingTitle: "加载中...",
    });
  }

  async getNoteReplyCommentList(mediaId, commentId, page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/media/tourism_note/reply_comment_list`,
      data: { mediaId, commentId, page, limit },
      loadingTitle: "加载中...",
    });
  }
}

export default LiveService;
