Component({
  properties: {
    item: Object
  },
  
  methods: {
    onCommentInput(e) {
      if (this.inputTimeout) clearTimeout(this.inputTimeout)
      this.inputTimeout = setTimeout(() => {
        this.triggerEvent('comment', { goods_id: this.properties.item.goods_id, content: e.detail.value })
      }, 300)
    }
  }
})