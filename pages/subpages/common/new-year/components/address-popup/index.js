import { checkLogin } from "../../../../../../utils/index";
import NewYearService from "../../utils/newYearService";

const newYearService = new NewYearService();

Component({
  properties: {
    prizeId: Number,
    goodsId: Number,
    luck: Number,
    show: {
      type: Boolean,
      observer(truthy) {
        if (truthy) {
          this.setAddressList();
        }
      }
    }
  },

  pageLifetimes: {
    show() {
      checkLogin(() => {
        this.setAddressList();
      }, false)
    }
  },

  data: {
    addressList: [],
    selectedIndex: 0
  },

  methods: {
    async setAddressList() {
      const addressList = await newYearService.getAddressList();
      this.setData({ addressList });

      const { addressId } = this.properties;
      if (addressId) {
        const selectedIndex = addressList.findIndex(
          item => item.id === addressId
        );
        this.setData({ selectedIndex });
      }
    },

    selectAddress(e) {
      this.setData({
        selectedIndex: Number(e.detail.value)
      });
    },

    confirm() {
      const { prizeId, goodsId, luck, addressList, selectedIndex } = this.data;
      
      if (!addressList.length) return;

      const addressId = addressList[selectedIndex].id;
      if (prizeId) {
        newYearService.receivePrize(prizeId, addressId, () => {
          wx.showToast({ title: '领取成功' });
          this.hide();
        });
      }
      if (goodsId && luck) {
        newYearService.exchangeGoods(goodsId, addressId, () => {
          wx.showToast({ title: '兑换成功' });
          this.hide();
        });
      }
    },

    hide() {
      this.triggerEvent("hide");
    },

    navToAddressListPage() {
      checkLogin(() => {
        wx.navigateTo({
          url: "/pages/subpages/mine/address/index"
        });
      });
    }
  }
});
