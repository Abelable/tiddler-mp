import { store } from '../../../../../store/index'
import { debounce } from '../../../../../utils/index'
import LiveService from '../utils/liveService'

const liveService = new LiveService()

Page({
  data: {
    uploadCoverLoading: false,
    uploadShareCoverLoading: false,
    cover: '',
    shareCover: '',
    direction: 1,
    isMerchant: false,
    pickedGoodsIds: [],
    noticeTimeString: '',
    isNotice: false,
  },

  onLoad({ id }) {
    
  },
})
