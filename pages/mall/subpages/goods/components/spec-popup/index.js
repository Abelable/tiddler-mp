import { checkLogin } from '../../../../../../utils/index'
import GoodsService from '../../utils/goodsService'

const goodsService = new GoodsService()

Component({
  options: {
    addGlobalClass: true
  },
  
  properties: {
    show: Boolean,
    mode: {
      type: Number,
      value: 0
    },
    goodsInfo: {
      type: Object,
      observer(info) {
        if (info && info.specList.length) {
          const specList = info.specList.map((item) => ({
            ...item, 
            options: item.options.map((_item, _index) => ({
              name: _item,
              selected: _index === 0
            }))
          }))
          this.setData({ specList })
        }
      }
    },
    cartId: {
      type: Number,
      value: 0
    },
    selectedSkuName: {
      type: String,
      value: ''
    },
    selectedSkuIndex: {
      type: Number,
      value: -1
    }
  },

  data: {
    specList: [],
    count: 1
  },

  observers: {
    'specList': function (list) {
      if (list.length) {
        const selectedSkuName = list.map(item => item.options.find(_item => _item.selected).name).join()
        const selectedSkuIndex = this.data.goodsInfo.skuList.findIndex(item => item.name === selectedSkuName)
        this.setData({ selectedSkuName, selectedSkuIndex })
      } 
    }
  },
  
  methods: {
    // 选择规格
    selectSpec(e) {
      const { index, optionIndex } = e.currentTarget.dataset
      const specList = this.data.specList.map((item, specIndex) => index === specIndex ? ({
        ...item, 
        options: item.options.map((_item, _index) => ({
          ..._item,
          selected: _index === optionIndex
        }))
      }) : item)
      this.setData({ specList })
    },

    countChange({ detail: count }) {
      this.setData({ count })
    },

    // 加入购物车
    addCart() {
      checkLogin(async () => {
        const { goodsInfo, selectedSkuIndex, count } = this.data
        const cartGoodsNumber = await goodsService.addCart(goodsInfo.id, selectedSkuIndex, count)
        this.triggerEvent('hide', { cartGoodsNumber })
      })
    },

    // 立即购买
    buyNow() {
      checkLogin(() => {
        if (this.check()) {
          let { roomId, goodsId, count, specIdArr, inviteCode } = this.data
          wx.navigateTo({ url: `/pages/subpages/mall/goods-detail/subpages/order-check/index?goods_id=${goodsId}&count=${count}&sku=${specIdArr}&roomId=${roomId}&invite_code=${inviteCode}` })
          this.triggerEvent('hideSpecModal')
        }
      })
    },

    editCartSpec() {
      checkLogin(async () => {
        if (this.check()) {
          const { recId, specIdArr, count } = this.data
          await goodsService.updateCartGoods({ recId, spec: specIdArr.join(), count })
          this.triggerEvent('hideSpecModal')
        }
      })
    },

    // 购买前核对
    check() {
      let { mainInfo, specIdArr } = this.data
      let showToastTitle = ''
      if (!showToastTitle && mainInfo.specification.length) { // 判断规格选择是否有遗漏
        let unselectedIndex = specIdArr.findIndex(item => item === undefined)
        if (unselectedIndex !== -1) {
          showToastTitle = `请选择${mainInfo.specification[unselectedIndex].name}`
        } else if (specIdArr.length < mainInfo.specification.length) {
          showToastTitle = `请选择${mainInfo.specification[specIdArr.length].name}`
        }
      }
      
      showToastTitle && wx.showToast({
        title: showToastTitle,
        icon: "none",
        duration: 1500
      })
      return !showToastTitle
    },

    hide() {
      const { selectedSkuName } = this.data
      this.triggerEvent('hide', { selectedSkuName })
    }
  }
})