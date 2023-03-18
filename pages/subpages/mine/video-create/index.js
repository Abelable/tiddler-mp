import { createStoreBindings } from 'mobx-miniprogram-bindings'
import { store } from '../../../../store/index'
import VideoService from './utils/videoService'

const videoService = new VideoService()

Page ({
  data: {
    cover: '',
    title: '',
    isPrivate: 0,
    tagLists: [],
    province: '',
    city: '',
    loctionVisible: true,
    pulishBtnActive: false
  },

  async onLoad(options) {
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ['shortVideoGoodsId'],
      actions: ['setShortVideoGoodsId']
    })

    this.setSrc(options.src)
    this.setLabelLists()
    if (!store.locationInfo) await videoService.setLocationInfo()
    // this.setLoaction()
  },

  setSrc(src) {
    videoService.uploadVideo(src).then(res => {
      if (res && Array.isArray(res)) {
        const [src] = res
        this.src = src
        this.setData({
          cover: `${src}?x-oss-process=video/snapshot,t_7000,f_jpg,m_fast`
        })
      }
    })
  },

  setLoaction() {
    // const { longitude, latitude } = store.locationInfo
    // this.longitude = longitude
    // this.latitude = latitude
    // let Map = require('../../../../utils/libs/qqmap-wx-jssdk.min')
    // let map = new Map({ key: 'BGCBZ-UFHWX-MBQ4O-TANN2-7WTZ3-CLBIP' })
    // map.reverseGeocoder({
    //   location: { longitude, latitude },
    //   success: res => {
    //     const { province, city } = res.result.ad_info
    //     this.setData({ province, city })
    //   }
    // })
  },

  toggleLoctionVisible() {
    this.setData({
      loctionVisible: !this.data.loctionVisible
    })
  },

  setTitle(e) {
    this.title = e.detail.value
    if (this.setTitleTimeout) clearTimeout(this.setTitleTimeout)
    this.setTitleTimeout = setTimeout(() => {
      this.setData({
        title: this.title
      }, () => {
        this.check()
      })
    }, 200)
  },

  async editCover() {
    const { tempFilePaths } = await videoService.chooseImage(1)
    const cover = await videoService.uploadFile(tempFilePaths[0]) || ''
    this.setData({ cover })
  },

  setGoodsDesc(e) {
    this.goodsDesc = e.detail.value
    this.check()
  },

  switchChange(e) {
    this.setData({
      isPrivate: e.detail.value ? 1 : 0
    })
    console.log(this.data.isPrivate)
  },

  check() {
    const { title, shortVideoGoodsId, pulishBtnActive } = this.data
    const truthy = (shortVideoGoodsId && this.goodsDesc && title) || (!shortVideoGoodsId && title)
    if (pulishBtnActive !== truthy) this.setData({ pulishBtnActive: truthy })
  },

  selectTag(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      [`tagLists[${index}].selected`]: !this.data.tagLists[index].selected
    })
  },

  async setLabelLists() {
    const { tag_list: tagLists } = await videoService.getLableLists()
    tagLists.map(item => {
      item.selected = false
    })
    this.setData({ tagLists })
  },

  async publish() {
    if (this.data.pulishBtnActive) {
      const { title, cover, isPrivate, tagLists, loctionVisible, province, city } = this.data
      let tagIdsArr = []
      tagLists.forEach(item => {
        if (item.selected) tagIdsArr.push(item.id)
      })
      await videoService.creatShortVideo(title, cover, this.src, isPrivate, this.goodsDesc, tagIdsArr.join(), 
        loctionVisible ? this.longitude : '', 
        loctionVisible ? this.latitude : '',
        loctionVisible ? province : '',
        loctionVisible ? city : ''
      )
      wx.navigateBack()
    }
  },

  onUnload() {
    this.setShortVideoGoodsId('')
    this.storeBindings.destroyStoreBindings()
  }
})
