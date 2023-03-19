import BaseService from '../../../../services/baseService'

Component({
  properties: {
    item: Object,
    isChild: Boolean,
    curCommentId: String
  },

  data: {
    content: ''
  },

  observers: {
    'item': function(info) {
      let { at_person: lists, content } = info
      if (lists.length) {
        lists.forEach(_item => {
          content = content.replace(`@${_item.nick_name}`, '')
        })
        this.setData({ content })
      }
    }
  },

  methods: {
    reply() {
      const { id, appraiser } = this.properties.item
      this.triggerEvent('reply', { id, name: appraiser.nick_name })
    },

    togglePraise() {
      let { video_id, id, is_like, like_num } = this.properties.item
      new BaseService().togglePraiseStatus(video_id, id)
        this.setData({
          [`item.is_like`]: !is_like,
          [`item.like_num`]: is_like ? --like_num : ++like_num
        })
    }
  }
})