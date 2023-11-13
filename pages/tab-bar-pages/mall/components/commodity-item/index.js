Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object
  },

  data: {
    typeList: [
      { ch: '景点', en: 'scenic' },
      { ch: '酒店', en: 'hotel' },
      { ch: '美食', en: 'restaurant' },
    ],
    visible: false,
  },

  methods: {
    onCoverLoaded() {
      this.setData({ visible: true });
    },
  }
})
