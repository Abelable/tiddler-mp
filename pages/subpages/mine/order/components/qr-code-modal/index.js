import { API_BASE_URL, VERSION } from "../../../../../../config";

Component({
  properties: {
    code: String
  },

  data: {
    qrcode: ""
  },

  lifetimes: {
    attached() {
      const qrcode = `${API_BASE_URL}/api/${VERSION}/qr_code?code=${this.properties.code}`;
      this.setData({ qrcode });
    }
  },

  methods: {
    hide() {
      this.triggerEvent("hide");
    },

    catchtap() {}
  }
});
