Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    imageList: Array,
  },

  lifetimes: {
    attached() {
      console.log(this.properties.imageList)
    }
  },

  methods: {
  },
});
