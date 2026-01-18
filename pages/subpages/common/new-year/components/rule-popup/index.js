Component({
  properties: {
    show: Boolean
  },

  methods: {
    hide() {
      this.triggerEvent("hide");
    },
  }
});
