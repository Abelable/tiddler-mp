import { checkLogin } from '../../../../../../utils/index'

Component({
  options: {
    addGlobalClass: true
  },
  
  properties: {
    info: Object
  },

  data: {
    imgs: [
      'http://img.ubo.vip/youlian/temporary/item_cover.jpeg',
      'http://img.ubo.vip/youlian/temporary/item_cover_2.jpg',
      'http://img.ubo.vip/youlian/temporary/item_cover_3.jpg',
      'http://img.ubo.vip/youlian/temporary/item_cover_4.jpg',
      'http://img.ubo.vip/youlian/temporary/item_cover_5.jpg'
    ],
    content: '进入房间很大很暖和进入房间很大很暖和进入房间很大很暖和进入房间很大很暖和进入房间很大很暖和进入房间很大很暖和进入房间很大很暖和进入房间很大很暖和进入房间很大很暖和进入房间很大很暖和进入房间很大很暖和进入房间很大很暖和进入房间很大很暖和进入房间很大很暖和进入房间很大很暖和进入房间很大很暖和进入房间很大很暖和进入房间很大很暖和',
    contentFold: true
  },

  methods: {
    previewImage(e) {
      const { current } = e.currentTarget.dataset
      wx.previewImage({ current, urls: this.data.imgs })
    },

    async toggleFollowStatus() {
      checkLogin(() => {
        const { is_follow, user_id } = this.properties.socialDetailInfo
        if (is_follow) {
          socialService.unFollowAnchor(user_id)
          this.setData({ ['socialDetailInfo.is_follow']: false })
        } else {
          socialService.followAnchor(user_id)
          this.setData({ ['socialDetailInfo.is_follow']: true })
          wx.showToast({ title: '关注成功', icon: 'none' })
        }
      })
    },
  
    togglePraiseStatus() {
      checkLogin(() => {
        let { id, like_num, is_like } = this.properties.socialDetailInfo
        socialService.togglePraiseStatus(id)
        this.setData({
          ['socialDetailInfo.like_num']: is_like ? --like_num : ++like_num,
          ['socialDetailInfo.is_like']: !is_like
        })
      })
    },

    showCommentModal() {
      checkLogin(() => {
        this.triggerEvent('showCommentModal', { id: this.properties.socialDetailInfo.id })
      })
    }
  }
})