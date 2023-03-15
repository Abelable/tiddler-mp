import LiveService from '../../../../../utils/liveService'

Component({ 
  options: {
    addGlobalClass: true
  },

  properties: {
    groupId: String,
  },

  methods: {
    pushRemind() {
      
    },

    hide() {
      this.triggerEvent('hide')
    }
  }
})
