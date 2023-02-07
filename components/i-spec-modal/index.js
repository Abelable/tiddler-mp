import checkLogin from '../../utils/checkLogin'
import BaseService from '../../services/baseService'
let baseService = new BaseService()

Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    },
    goodsId: {
      type: String,
      observer: 'resetData'
    },
    actionType: {
      type: Number,
      value: 0
    },
    isOnSale: {
      type: Number,
      value: 1
    },
    limitTips: {
      type: String,
      value: ''
    },
    limitBuyNum: {
      type: Number,
      value: 0
    },
    limitStartBuyNum: {
      type: Number,
      value: 0
    },
    count: {
      type: Number,
      value: 1
    },
    recId: String,
    goodsName: String,
    goodsPic: String,
    basePrice: String,
    totalStock: String,
    mainInfo: Object,
    roomId: String,
    groupId: String,
    inviteCode: String,
    freeSampleId: String
  },

  data: {
    // 商品规格相关
    specIdArr: [],
    specPic: '',
    specPrice: '',
    specStock: '',
    count: 1
  },
  
  methods: {
    // 重置数据
    resetData(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.setData({
          specIdArr: [],
          specPic: '',
          specPrice: '',
          specStock: ''
        })
        this.specNameArr = []
        this.unitSpecPriceArr = []
        this.specPrice = 0
      }
    },

    // 选择规格
    selectSpec(e) {
      let { specIdArr, basePrice, mainInfo, count, actionType } = this.data
      let { specListIndex, specId, specName, specPic, specPrice: unitSpecPrice } = e.currentTarget.dataset

      // 拼接已选规格
      this.specNameArr[specListIndex] = specName
      this.triggerEvent('setSpecTips', this.specNameArr.join(''))

      // 计算价格
      if (this.unitSpecPriceArr.length) {
        if (this.unitSpecPriceArr[specListIndex]) {
          this.specPrice = this.specPrice - this.unitSpecPriceArr[specListIndex] + Number(unitSpecPrice)
        } else {
          this.specPrice = this.specPrice + Number(unitSpecPrice)
        }
      } else {
        this.specPrice = Number(basePrice) + Number(unitSpecPrice)
      }
      this.unitSpecPriceArr[specListIndex] = Number(unitSpecPrice)

      specIdArr[specListIndex] = specId

      // 取库存
      if (actionType === 3) {
        const selectedSpec = specIdArr.join('|')
        const { product_number: specStock = '' } = mainInfo.attr_num.find(item => item.goods_attr === selectedSpec) || {}
        specStock && count > specStock && this.setData({ count: specStock })
        this.setData({ specStock })
      } else {
        const selectedSpec = this.specNameArr.join('')
        const specStock = mainInfo.attr_num[selectedSpec] ? Number(mainInfo.attr_num[selectedSpec]) : ''
        specStock && count > specStock && this.setData({ count: specStock })
        this.setData({ specStock })
      }      

      this.setData({
        specIdArr,
        specPic,
        specPrice: parseFloat(this.specPrice).toFixed(2)
      })
    },

    // 减少商品数量
    reduce() {
      this.data.count > 1 && this.setData({
        count: --this.data.count
      })
    },

    // 增加商品数量
    add() {
      let { count, totalStock, specStock } = this.data
      count < (specStock || totalStock) && this.setData({
        count: ++count
      })
    },

    editCount(e) {
      let { totalStock, specStock } = this.data
      let count = +e.detail

      if (count > (specStock || totalStock)) {
        wx.showToast({
          title: '设置的数量大于库存，请重新设置',
          icon: 'none',
        })
        this.setData({
          count: this.data.count
        })
      } else {
        this.setData({
          count: count
        })
      }
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
      let { mainInfo, specIdArr, specStock, isOnSale, limitTips, limitBuyNum, limitStartBuyNum, count } = this.data
      let showToastTitle = ''
      if (isOnSale == 0) { // 判断商品是否下架
        showToastTitle = '该商品已下架'
      } 
      if (!showToastTitle && mainInfo.specification.length) { // 判断规格选择是否有遗漏
        let unselectedIndex = specIdArr.findIndex(item => item === undefined)
        if (unselectedIndex !== -1) {
          showToastTitle = `请选择${mainInfo.specification[unselectedIndex].name}`
        } else if (specIdArr.length < mainInfo.specification.length) {
          showToastTitle = `请选择${mainInfo.specification[specIdArr.length].name}`
        }
      }
      if (!showToastTitle && specStock === 0) { // 判断是否有库存
        showToastTitle = '该商品暂时没有存货'
      } 
      if (!showToastTitle && limitTips && (limitBuyNum && count > limitBuyNum) || (limitStartBuyNum && count < limitStartBuyNum)) { // 判断是否符合限购条件
        showToastTitle = limitTips
      } 
      showToastTitle && wx.showToast({
        title: showToastTitle,
        icon: "none",
        duration: 1500
      })
      return !showToastTitle
    },

    // 关闭弹窗
    hideModal() {
      this.triggerEvent('hideSpecModal')
    }
  }
})