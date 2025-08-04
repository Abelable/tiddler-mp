import { cleanObject } from "../../../../utils/index";
import BaseService from "../../../../services/baseService";

class MediaService extends BaseService {
  async saveLiveChatMsg(id, content, identity) {
    return await this.post({
      url: `${this.baseUrl}/media/live/comment`,
      data: { id, content, identity }
    });
  }

  async getVideoList({ id, authorId, page, limit = 10, loadingTitle }) {
    return await this.get({
      url: `${this.baseUrl}/media/short_video/list`,
      data: cleanObject({ id, authorId, page, limit }),
      loadingTitle
    });
  }

  async getVideoCommentList(mediaId, page, limit = 10) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/media/short_video/comment_list`,
        data: { mediaId, page, limit },
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }

  async getVideoReplies(mediaId, commentId, page, limit = 10) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/media/short_video/reply_comment_list`,
        data: { mediaId, commentId, page, limit },
        loadingTitle: "加载中..."
      })) || {};
    return list;
  }

  async addVideoComment(mediaId, content, commentId, success) {
    return await this.post({
      url: `${this.baseUrl}/media/short_video/comment`,
      data: cleanObject({ mediaId, commentId, content }),
      success
    });
  }

  async deleteVideoComment(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/short_video/delete_comment`,
      data: { id },
      success
    });
  }

  async getNoteList({
    id,
    authorId,
    withComments = 0,
    page,
    limit = 10,
    loadingTitle
  }) {
    return await this.get({
      url: `${this.baseUrl}/media/tourism_note/list`,
      data: cleanObject({ id, authorId, withComments, page, limit }),
      loadingTitle
    });
  }

  async getNoteCommentList(mediaId, page, limit = 10) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/media/tourism_note/comment_list`,
        data: { mediaId, page, limit }
      })) || {};
    return list;
  }

  async getNoteReplies(mediaId, commentId, page, limit = 10) {
    const { list = [] } =
      (await this.get({
        url: `${this.baseUrl}/media/tourism_note/reply_comment_list`,
        data: { mediaId, commentId, page, limit }
      })) || {};
    return list;
  }

  async addNoteComment(mediaId, content, commentId, success) {
    return await this.post({
      url: `${this.baseUrl}/media/tourism_note/comment`,
      data: cleanObject({ mediaId, commentId, content }),
      success
    });
  }

  async deleteNoteComment(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/tourism_note/delete_comment`,
      data: { id },
      success
    });
  }

  async toggleVideoPrivateStatus(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/short_video/toggle_private`,
      data: { id },
      success
    });
  }

  async toggleNotePrivateStatus(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/tourism_note/toggle_private`,
      data: { id },
      success
    });
  }

  async deleteVideo(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/short_video/delete`,
      data: { id },
      success
    });
  }

  async deleteNote(id, success) {
    return await this.post({
      url: `${this.baseUrl}/media/tourism_note/delete`,
      data: { id },
      success
    });
  }

  async getHotScenicList() {
    return (
      (await this.get({
        url: `${this.baseUrl}/trip_type/hot_scenic_list`,
        loadingTitle: "加载中..."
      })) || []
    );
  }

  async getLakeTripList(lakeId) {
    return (
      (await this.get({
        url: `${this.baseUrl}/trip_type/lake_trip_list`,
        data: { lakeId },
        loadingTitle: "加载中..."
      })) || []
    );
  }

  async getLakeCycleList(routeId) {
    return (
      (await this.get({
        url: `${this.baseUrl}/trip_type/lake_cycle_list`,
        data: { routeId },
        loadingTitle: "加载中..."
      })) || []
    );
  }

  async getLakeCycleMediaList(page, limit = 10) {
    return await this.get({
      url: `${this.baseUrl}/trip_type/lake_cycle_media_list`,
      data: { page, limit }
    });
  }
}

export default MediaService;
