import checkLogin from '../../../../../../utils/checkLogin'
import { customBack } from '../../../../../../utils/jumpPage'
import GoodsService from '../../utils/goodsService'

const goodsService = new GoodsService()
const { statusBarHeight } = getApp().globalData

Page({
  data: {
    statusBarHeight,
    cartList: [],
    recommendGoodsList: [],
    isSelectAll: false,
    totalPrice: "0.00",
    selectedCount: 0,
    deleteBtnVision: false,
    specModalVisible: false,
    specInfo: null
  },

  onShow() {
    checkLogin(this.setCartList)
  },

  async setCartList() {
    const { cartList: list, recommendGoodsList } = await goodsService.getCartList() || {}
    const cartList = list.map(item => ({
      ...item,
      selected: false,
      goodsList: item.goodsList.map(_item => ({
        ..._item, 
        selected: false
      }))
    }))
    this.setData({ cartList, recommendGoodsList }, () => {
      this.acount()
    })
  },

  /**
   * 切换购物车列表选中状态
   */
  async toggleCartChecked(e) {
    const { index } = e.currentTarget.dataset
    let { cartList, deleteBtnVision } = this.data
    let checkStatus = cartList[index].checked
    cartList[index].checked = !checkStatus
    cartList[index].goods.map(item => {
      if (deleteBtnVision || (!deleteBtnVision && item.product_number)) item.is_checked_goods = !checkStatus
    })
    this.setData({ cartList }, () => {
      this.acount()
    })
  },

  /**
   * 切换商品列表选中状态
   */
  async toggleGoodsChecked(e) {
    const { cartIndex, goodsIndex } = e.currentTarget.dataset
    let { cartList, deleteBtnVision } = this.data
    let goodsCheckStatus = cartList[cartIndex].goods[goodsIndex].is_checked_goods
    cartList[cartIndex].goods[goodsIndex].is_checked_goods = !goodsCheckStatus
    let unCheckedIndex = cartList[cartIndex].goods.findIndex(item => {
      if (deleteBtnVision || (!deleteBtnVision && item.product_number)) return item.is_checked_goods === false
    })
    cartList[cartIndex].checked = unCheckedIndex === -1
    this.setData({ cartList }, () => {
      this.acount()
    })
  },

  /**
   * 切换全选状态
   */
  toggleAllChecked(){
    let { cartList, invalidGoodsList, isSelectAll, deleteBtnVision } = this.data
    if (deleteBtnVision) {
      cartList.map(item => {
        item.checked = !isSelectAll
        item.goods.map(_item => {
          _item.is_checked_goods = !isSelectAll
        })
      })
      invalidGoodsList.map(item => {
        item.is_checked = !isSelectAll
      })
      this.setData({ cartList, invalidGoodsList }, () => {
        this.acount()
      })
    } else {
      cartList.map(item => {
        item.checked = !isSelectAll
        item.goods.map(_item => {
          if (_item.product_number) _item.is_checked_goods = !isSelectAll
        })
      })
      this.setData({ cartList }, () => {
        this.acount()
      })
    }
  },

  toggleInvalidGoodsChecked(e) {
    const { index } = e.currentTarget.dataset
    const status = this.data.invalidGoodsList[index].is_checked
    this.setData({
      [`invalidGoodsList[${index}].is_checked`]: !status
    }, () => {
      this.acount()
    })
  },

  async acount() {
    this.totalCount = 0
    let selectedCount = 0
    this.selectedRecIdArr = []

    const { cartList, deleteBtnVision } = this.data

    if (deleteBtnVision) {
      cartList.forEach(item => {
        item.goodsList.forEach(_item => {
          if (_item.is_checked_goods) {
            this.selectedRecIdArr.push(_item.rec_id)
            selectedCount += _item.number
          }
          this.totalCount += _item.number
        })
      })
      this.setData({ 
        selectedCount,
        isSelectAll: selectedCount && selectedCount === this.totalCount
      })
    } else {
      cartList.forEach(item => {
        item.goodsList.forEach(_item => {
          if (_item.status === 1 && _item.is_checked_goods) {
            this.selectedRecIdArr.push(_item.rec_id)
            selectedCount += _item.number
          }
          this.totalCount += _item.number
        })
      })
  
      // const { goods_amount_formated: totalPrice } = await goodsService.getCartAmount(this.selectedRecIdArr.join()) || {}
  
      this.setData({ 
        selectedCount, 
        totalPrice: 100,
        isSelectAll: selectedCount && selectedCount === this.totalCount
      })
    }
  },

  editCount(e) {
    let { cartIndex, goodsIndex, recId, stock } = e.currentTarget.dataset
    this.countControl(cartIndex, goodsIndex, recId, stock, e.detail)
  },

  async countControl(cartIndex, goodsIndex, recId, stock, mode) {
    let count = this.data.cartList[cartIndex].goods[goodsIndex].goods_number
    let continueFlag = true
    switch (mode) {
      case 'add':
        if (count < stock) {
          ++count
          ++this.totalCount
        } else {
          wx.showToast({ title: '数量大于库存', icon: 'none' })
          continueFlag = false
        }
        break;
      case 'reduce':
        if (count > 1 && this.totalCount > 1) {
          --count
          --this.totalCount
        } else continueFlag = false
        break
      default:
        if (+mode > 0 && +mode < stock) {
          count = +mode
          this.totalCount = this.totalCount - count + mode
        } else {
          continueFlag = false
          wx.showToast({ title: '数量大于库存，请重新输入', icon: 'none' })
          this.setData({
            [`cartList[${cartIndex}].goods[${goodsIndex}].goods_number`]: count
          })
        }
        
        break
    }
    if (continueFlag) {
      let { goods_amount_formated: totalPrice, cart_number: selectedCount } = await goodsService.updateCartGoods({ recId, count })
      this.setData({ 
        totalPrice: totalPrice.slice(1), 
        selectedCount,
        [`cartList[${cartIndex}].goods[${goodsIndex}].goods_number`]: count
      })
    }
  },

  deleteGoodsList() {
    this.data.selectedCount && wx.showModal({
      title: '提示',
      content: '确定删除商品吗？',
      showCancel: true,
      success: async res => {
        if (res.confirm) {
          await goodsService.deleteCartList(this.selectedRecIdArr.join())
          this.setCartList()
        }
      }
    })
  },

  async deleteGoods(e) {
    await goodsService.deleteCartList(e.detail.listId)
    this.setCartList()
    e.detail.close() 
  },

  async emptyInvalidGoods() {
    const recIdArr = this.data.invalidGoodsList.map(item => item.rec_id)
    await goodsService.deleteCartList(recIdArr.join())
    this.setData({
      invalidGoodsList: []
    })
  },

  async deleteInvalidGoods(e) {
    const { idx, listId } = e.detail
    await goodsService.deleteCartList(listId)
    let { invalidGoodsList } = this.data
    invalidGoodsList.splice(idx, 1)
    this.setData({ invalidGoodsList })
    e.detail.close() 
  },

  async editSpec(e) {
    const { goods_id: id, rec_id: recId, goods_name: name, goods_thumb: img, product_number: stock, goods_number: count } = e.currentTarget.dataset.info
    const { attr_goods_info: mainInfo, shop_price: basePrice } = await goodsService.getGoodsSpec(id)
    this.setData({
      specInfo: { id, recId, name, img, basePrice, stock, count, mainInfo },
      specModalVisible: true
    })
  },

  toggleDeleteBtnVision() {
    this.setData({
      deleteBtnVision: !this.data.deleteBtnVision
    }, () => {
      this.acount()
    })
  },

  submit(){
    if (this.data.selectedCount) {
      wx.navigateTo({ 
        url: `/pages/subpages/mall/goods-detail/subpages/order-check/index?cartId=${this.selectedRecIdArr.join()}` 
      })
    }
  },

  navToShop(e) {
    wx.navigateTo({ 
      url: `/pages/mall/subpages/goods/subpages/shop/index?id=${e.currentTarget.dataset.id}`
    })
  },

  showGoodsDetail(e){
    wx.navigateTo({ 
      url: `/pages/mall/subpages/goods/subpages/goods-detail/index?id=${e.currentTarget.dataset.id}`
    })
  },

  finishEdit() {
    this.setCartList()
    this.hideSpecModal()
  },

  navBack() {
    customBack()
  },

  hideSpecModal() {
    this.setData({ specModalVisible: false })
  }
})
