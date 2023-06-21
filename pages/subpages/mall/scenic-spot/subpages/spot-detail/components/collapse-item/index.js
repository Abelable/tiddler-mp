Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    item: Object,
    index: Number,
  },

  methods: {
    toggleFold() {
      this.triggerEvent("toggleFold", this.properties.index);
    },

    showNoticePopup(e) {
      this.triggerEvent("showNoticePopup", e.detail);
    },
  },
});
