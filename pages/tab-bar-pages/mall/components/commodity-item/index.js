Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object
  },

  data: {
    visible: false,
  },

  methods: {
    onCoverLoaded() {
      this.setData({ visible: true });
    },
  }
})
