Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    show: Boolean,
    details: Array,
  },

  methods: {
    hide() {
      this.triggerEvent("hide");
    },
  },
});
