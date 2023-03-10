import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../store/index'
      
Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['tabType']
  },

  methods: {
    switchTab(e) {
      wx.switchTab({ url: e.currentTarget.dataset.path })
    }
  }
})