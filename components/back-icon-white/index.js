import { customBack } from '../../utils/index'

Component({ 
  properties: {
    custom: Boolean,
    noBorder: Boolean
  },

  data: {
    icon: "back"
  },

  lifetimes: {
    attached() {
      if (getCurrentPages().length === 1) {
        this.setData({ icon: "home" })
      }
    }
  },

  methods: { 
    navigateBack() {
      this.properties.custom ? this.triggerEvent('navigateBack') : customBack()
    }
  }
})
