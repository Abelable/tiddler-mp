Component({
  properties: {
    item: Object,
    isPromoter: Boolean,
    showBorder: {
      type: Boolean,
      value: true
    }
  },

  methods: {
    answer() {
      const { id } = this.properties.item;
      this.triggerEvent("answer", { id });
    }
  }
});
