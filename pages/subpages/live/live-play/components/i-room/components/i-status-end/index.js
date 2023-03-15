import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../../../../../../store/index'

const { statusBarHeight } = getApp().globalData.systemInfo;

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['audienceCount', 'praiseCount']
  },

  properties: {
    anchorAvatar: String,
    anchorName: String,
    liveDuration: Number
  },

  data: {
    statusBarHeight
  }
})
