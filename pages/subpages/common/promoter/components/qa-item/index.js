Component({
  properties: {
    item: Object,
    isPromoter: Boolean,
    isLast: {
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
