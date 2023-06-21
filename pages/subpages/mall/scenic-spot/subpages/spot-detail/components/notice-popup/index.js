Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    show: Boolean,
    info: Object,
  },

  methods: {
    contact() {
      console.log("contact");
    },

    confirm() {
      console.log("confirm");
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
