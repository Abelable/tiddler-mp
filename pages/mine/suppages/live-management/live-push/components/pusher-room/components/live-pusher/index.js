import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../../../../../store/index'

Component({
  options: {
    multipleSlots: true 
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['fullScreen', 'devicePosition', 'remoteMirror', 'localMirror', 'beautyValue', 'whitenessValue', 'visualFilterValue', 'soundFilterValue', 'muted', 'definitionIndex', 'studioInfo', 'lampVisible']
  },

  properties: {
    mode: Number,
    direction: Number,
    src: String,
    start: Boolean,
    stop: Boolean
  },

  data: {
    statusBarHeight: getApp().globalData.statusBarHeight,
    definitionList: ['SD', 'HD', 'FHD'],
    visualFilterList: ['standard', 'pink', 'nostalgia', 'blues', 'romantic', 'cool', 'fresher', 'solor', 'aestheticism', 'whitening', 'cerisered'],
    smallScreenMode: ['push']
  },

  observers: {
    'mode': function(val) {
      if (val) {
        this.ctx = (val == 1 && store.studioInfo.type_name === '创建者') ? wx.createLivePusherContext('live-pusher', this) : wx.createLivePlayerContext('live-player', this)
      }
    },
    'start': function(truthy) {
      if (truthy) {
        this.properties.mode == 1 ? this.ctx.start() : this.ctx.play()
      }
    },
    'stop': function(truthy) {
      if (truthy) {
        this.properties.mode == 1 && this.ctx.stop()
      }
    },
    'fullScreen': function(truthy) {
      if (this.properties.mode != 1 && this.ctx) {
        truthy ? this.ctx.requestFullScreen({ direction: 90 }) : this.ctx.exitFullScreen()
      }
    },
    'devicePosition': function() {
      this.ctx && this.ctx.switchCamera()
    },
    'lampVisible': function() {
      this.ctx && this.ctx.toggleTorch()
    }
  },

  pageLifetimes: {
    show() {
      if (store.muted) {
        this.ctx && this.ctx.mute()
      }
    }
  }
})
