import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../store/index'
import BaseService from '../../services/baseService'

const baseService = new BaseService()

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    actions: []
  },

  properties: {
    show: {
      type: Boolean,
      observer(val) {
        val ? this.setCommentsList(true) : this.initData()
      }
    },
    videoId: String,
    noteId: String,
  },

  data: {
    totalCount: 0,
    commentsList: [],
    replyCommentId: 0,
    replyUserName: '',
    showNomore: false,
    inputModalVisible: false
  },
  
  methods: {
    initData() {
      this.setData({
        commentsList: [],
        replyCommentId: 0,
        replyUserName: '',
        showNomore: false,
        inputModalVisible: false
      })
    },

    async setCommentsList(init = false) {
      // const initTruthy = (typeof(init) === 'boolean' && init)
      // if (initTruthy) {
      //   this.page = 0
      //   this.replyPageArr = []
      //   this.setData({ commentsList: [] })
      // }
      // const { videoId, curCommentId, curSecCommentId } = this.properties
      // const { comment_count: totalCount, list: commentsList = [] } = await baseService.getCommentsLists({ videoId, commentId: initTruthy ? curCommentId : '', secCommentId: initTruthy ? curSecCommentId : '', page: ++this.page }) || {}
      // if (initTruthy) this.setData({ totalCount })
      // if (commentsList.length) {
      //   commentsList.map(item => { 
      //     item.replyFold = true 
      //     item.replyLists = []
      //   })
      //   this.setData({ 
      //     commentsList: initTruthy ? commentsList : [...this.data.commentsList, ...commentsList]
      //   })
      //   if (initTruthy && curSecCommentId) this.toggleSpread(0)
      // } else {
      //   !initTruthy && this.setData({ showNomore: true })
      // }
    },

    spreadReply(e) {
      const { index } = e.currentTarget.dataset
      this.toggleSpread(index)
    },

    async toggleSpread(index) {
      if (!this.replyPageArr[index]) this.replyPageArr[index] = 0

      const { id: parentId, replyLists, comment_num: replayCount, replyFold } = this.data.commentsList[index]
      if (replayCount > replyLists.length) {
        const { list } = await baseService.getSecondCommentsLists({ parentId, page: ++this.replyPageArr[index] })
        if (replyFold) this.setData({ [`commentsList[${index}].replyFold`]: false })
        this.setData({
          [`commentsList[${index}].replyLists`]: [...replyLists, ...list]
        })
      }
      if (replayCount == replyLists.length) {
        this.setData({ [`commentsList[${index}].replyFold`]: !replyFold })
      }
    },

    atUser() {
      this.setData({ inputModalVisible: true })
      this.selectComponent("#inputModal").atUser()
    },

    showInputModal(e) {
      if (this.data.inputModalVisible) {
        this.setData({ 
          inputModalVisible: false,
          replyCommentId: '',
          replyUserName: ''
        })
      } else {
        const { id, name } = e.detail
        this.setData({ inputModalVisible: true })
        if (id) {
          this.setData({ 
            replyCommentId: id,
            replyUserName: name
          })
        }
      }
    },

    async sendedMsg() {
      this.hideInputModal()
      await this.setCommentsList(true)
      this.setCurShortVideoCommentInfo({ id: this.properties.videoId, count: this.data.totalCount })
    },

    hideInputModal() {
      this.data.inputModalVisible && this.setData({ 
        inputModalVisible: false,
        replyCommentId: 0,
        replyUserName: ''
      })
    },

    hide() {
      this.triggerEvent('hide')
    }
  }
})
