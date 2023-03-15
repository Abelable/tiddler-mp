import { customBack, debounce } from '../../../../../../utils/index'
import GoodsService from '../../utils/goodsService'

const goodsService = new GoodsService()
const { statusBarHeight } = getApp().globalData.systemInfo

Page({
  data: {
    statusBarHeight,
    historyKeywordsList: [],
    curSortIndex: 0,
    sortOptions: [
      { icon: '', text: '综合排序', value: 0 },
      { icon: '', text: '销量排序', value: 1 },
      { icon: '', text: '价格降序', value: 2 },
      { icon: '', text: '价格升序', value: 3 },
    ],
    curCategoryId: 0,
    categoryOptions: [],
    keywords: '',
    isSearching: false,
    goodsList: [],
    finished: false
  },

  onLoad() {
    this.setCategoryOptions()
    if (wx.getStorageSync('historyKeywordsList')) {
      this.setData({
        historyKeywordsList: JSON.parse(wx.getStorageSync('historyKeywordsList'))
      })
    }
  },

  async setCategoryOptions() {
    const options = await goodsService.getGoodsCategoryOptions()
    const categoryOptions = [
      { icon: '', text: '全部分类', value: 0 }, 
      ...options.map(item => ({ icon: '', text: item.name, value: item.id }))
    ]
    this.setData({ categoryOptions })
  },

  setKeywords: debounce(function(e) {
    this.setData({
      keywords: e.detail.value,
    })
  }, 500),

  cancelSearch() {
    this.setData({ 
      keywords: '',
      curSortIndex: 0,
      curCategoryId: 0,
    })
    if (this.data.isSearching) {
      this.setData({ isSearching: false })
    }
  },

  selectKeywords(e) {
    const { keywords } = e.currentTarget.dataset
    this.setData({ 
      keywords,
      isSearching: true
    })
    this.setGoodsList(true)
  },

  setSortIndex(e) {
    this.setData({
      curSortIndex: e.detail
    })
    this.search()
  },

  setCategoryId(e) {
    this.setData({
      curCategoryId: e.detail
    })
    this.search()
  },

  search() {
    const { keywords, isSearching, historyKeywordsList } = this.data
    if (!keywords) {
      return
    }
    this.setData({
      historyKeywordsList: Array.from(new Set([...historyKeywordsList, keywords]))
    })
    if (!isSearching) {
      this.setData({ isSearching: true })
    }
    this.setGoodsList(true)
  },

  async setGoodsList(init = false) {
    const limit = 10
    if (init) {
      this.page = 0
      this.setData({
        finished: false
      })
    }
    const { keywords, curSortIndex, curCategoryId, goodsList } = this.data
    let sort = ''
    let order = 'desc'
    switch (curSortIndex) {
      case 1:
        sort = 'sales_volume'
        break
      case 2:
        sort = 'price'
        break
      case 3:
        sort = 'price'
        order = 'asc'
        break
    }
    const list = await goodsService.getGoodsList({
      name: keywords,
      categoryId: curCategoryId,
      sort,
      order,
      page: ++this.page,
      limit,
    }) || []
    this.setData({
      goodsList: init ? list : [...goodsList, ...list]
    })
    if (list.length < limit) {
      this.setData({
        finished: true
      })
    }
  },

  onReachBottom() {
    this.setGoodsList()
  },
  
  onPullDownRefresh() {
    this.setGoodsList(true)
    wx.stopPullDownRefresh() 
  },

  clearHistoryKeywords() {
    wx.showModal({
      content: '确定清空历史搜索记录吗？',
      showCancel: true,
      success: (result) => {
        if (result.confirm) {
          this.setData({
            historyKeywordsList: []
          })
          wx.removeStorage({ key: 'historyKeywordsList' })
        }
      }
    })
  },

  navBack() {
    customBack()
  },

  onUnload() {
    wx.setStorage({
      key: 'historyKeywordsList',
      data: JSON.stringify(this.data.historyKeywordsList)
    })
  }
})
