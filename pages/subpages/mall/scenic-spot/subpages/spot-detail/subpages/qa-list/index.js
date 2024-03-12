import ScenicService from "../../../../utils/scenicService";

const scenicService = new ScenicService();

Page({
  data: {
    qaList: [],
  },

  onLoad({ scenicId }) {
    this.scenicId = scenicId;
  },

  async setQaList() {
    
  },
});
