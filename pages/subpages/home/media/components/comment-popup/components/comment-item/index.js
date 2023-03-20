Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object,
    isReply: Boolean
  },

  methods: {
    reply() {
      const { id } = this.properties.item
      this.triggerEvent('reply', { id })
    },
  }
})
