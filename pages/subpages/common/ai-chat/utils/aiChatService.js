import BaseService from "../../../../../services/baseService";

class AiChatService extends BaseService {
  aiChat(query) {
    return this.post({
      url: `${this.baseUrl}/ai/mp_stream`,
      data: { query },
      enableChunked: true
    });
  }
}

export default AiChatService;
