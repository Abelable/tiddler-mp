import { store } from '../../../../store/index'
import { customBack } from '../../../../utils/index'
import ScenicService from './utils/scenicService'

const scenicService = new ScenicService()
const { statusBarHeight } = getApp().globalData.systemInfo

Page({
  data: {
    statusBarHeight,
    categoryOptions: [],
    activeTabIdx: 0,
    tabScroll: 0,
    scenicList: [],
    finished: false
  },

  async onLoad() {
    await this.setLocationInfo()
    await this.setCategoryOptions()
    this.setScenicList(true)
  },

  async setLocationInfo() {
    const { authSetting } = await scenicService.getSetting();
    if (authSetting["scope.userLocation"] !== false) {
      const { longitude, latitude } = await scenicService.getLocation();
      store.setLocationInfo({ longitude, latitude });
    }
  },

  async setCategoryOptions() {
    const options = await scenicService.getScenicCategoryOptions()
    this.setData({ 
      categoryOptions: [
        { id: 0, name: '推荐'},
        ...options
      ]
    })
  },

  selectCate(e) {
    const { idx } = e.currentTarget.dataset
    this.setData({ 
      activeTabIdx: idx, 
      tabScroll: (idx - 2) * 80
    })
    this.setScenicList(true)
  },

  async setScenicList(init = false) {
    const limit = 10
    if (init) {
      this.page = 0
      this.setData({
        finished: false
      })
    }
    const { categoryOptions, activeTabIdx, scenicList } = this.data
    const list = await scenicService.getScenicList({
      categoryId: categoryOptions[activeTabIdx].id,
      page: ++this.page,
      limit
    }) || []
    this.setData({
      scenicList: init ? list : [...scenicList, ...list]
    })
    if (list.length < limit) {
      this.setData({
        finished: true
      })
    }
  },

  onReachBottom() {
    this.setScenicList()
  },
  
  onPullDownRefresh() {
    this.setScenicList(true)
    wx.stopPullDownRefresh() 
  },

  navBack() {
    customBack()
  },
})
