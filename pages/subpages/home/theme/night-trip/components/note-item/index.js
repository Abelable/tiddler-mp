Component({
  options: {
    addGlobalClass: true
  },

  properties: {
    item: Object
  },

  methods: {
    navToNoteDetail() {
      const { id } = this.properties.item;
      const url = `/pages/subpages/home/media/note/index?id=${id}`;
      wx.navigateTo({ url });
    }
  }
});
