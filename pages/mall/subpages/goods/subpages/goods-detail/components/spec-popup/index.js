import { checkLogin } from '../../../../../../../../utils/index'
import BaseService from '../../../../../../../../services/baseService'

const baseService = new BaseService()

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
  },

  data: {
    specList: [],
    selecteSkuName: '',
    selectedSkuIndex: -1,
    count: 1
  },

  observers: {
    'specList': function (list) {
      if (list.length) {
        const selecteSkuName = list.map(item => item.options.find(_item => _item.selected).name).join()
        const selectedSkuIndex = this.data.goodsInfo.skuList.findIndex(item => item.name === selecteSkuName)
        this.setData({ selecteSkuName, selectedSkuIndex })
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
    addToShopcart() {
      checkLogin(async () => {
        if (this.check()) {
          let { roomId, groupId, goodsId, count, specIdArr } = this.data
          await baseService.addCart(goodsId, specIdArr, count, 0)
          roomId && baseService.recordUserAddCart(roomId, groupId)
          this.triggerEvent('hideSpecModal')
          wx.showToast({ title: '添加成功', icon: "success" })
        }
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
          await baseService.updateCartGoods({ recId, spec: specIdArr.join(), count })
          this.triggerEvent('hideSpecModal')
        }
      })
    },

    payforFreeSample() {
      checkLogin(() => {
        if (this.check()) {
          let { roomId, goodsId, count, specIdArr, inviteCode, freeSampleId } = this.data
          wx.navigateTo({ url: `/pages/subpages/mall/goods-detail/subpages/order-check/index?goods_id=${goodsId}&count=${count}&sku=${specIdArr}&roomId=${roomId}&invite_code=${inviteCode}&freeSampleId=${freeSampleId}` })
          this.triggerEvent('hideSpecModal')
        }
      })
    },

    finish() {
      switch (this.properties.actionType) {
        case 1:
          this.addToShopcart()
          break
        case 2:
          this.buyNow()
          break
        case 3:
          this.editCartSpec()
          break
        case 4:
          this.payforFreeSample()
          break
      }
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
      this.triggerEvent('hide', this.data.selecteSkuName)
    }
  }
})