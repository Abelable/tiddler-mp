import SpotService from "../../../../utils/spotService";

const spotService = new SpotService();

Component({
  options: {
    addGlobalClass: true,
  },

  properties: {
    show: {
      type: Boolean,
      observer(truthy) {
        if (truthy) {
        }
      },
    },
  },

  data: {
  },

  methods: {
    confirm() {
      const { goodsList, selectedIndex } = this.data;
      const { id, name } = goodsList[selectedIndex];
      this.triggerEvent("confirm", { id, name });
    },

    hide() {
      this.triggerEvent("hide");
    },
  },
});
