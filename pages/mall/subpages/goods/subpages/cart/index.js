import { checkLogin, customBack } from '../../../../../../utils/index'
import GoodsService from '../../utils/goodsService'

const goodsService = new GoodsService()
const { statusBarHeight } = getApp().globalData

Page({
  data: {
    statusBarHeight,
    cartList: [],
    recommendGoodsList: [],
    isSelectAll: false,
    totalPrice: 0,
    selectedCount: 0,
    deleteBtnVisible: false,
    specPopupVisible: false,
    goodsInfo: null,
    selectedSkuIndex: -1 
  },

  onShow() {
    checkLogin(this.setCartList)
  },

  async setCartList() {
    const { cartList: list, recommendGoodsList } = await goodsService.getCartList() || {}
    const cartList = list.map(item => ({
      ...item,
      checked: false,
      goodsList: item.goodsList.map(_item => ({
        ..._item, 
        checked: false
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
    let { cartList, deleteBtnVisible } = this.data
    let checkStatus = cartList[index].checked
    cartList[index].checked = !checkStatus
    cartList[index].goodsList.map(item => {
      if (deleteBtnVisible || (!deleteBtnVisible && item.status === 1)) {
        item.checked = !checkStatus
      }
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
    let { cartList, deleteBtnVisible } = this.data
    let goodsCheckStatus = cartList[cartIndex].goodsList[goodsIndex].checked
    cartList[cartIndex].goodsList[goodsIndex].checked = !goodsCheckStatus
    let unCheckedIndex = cartList[cartIndex].goodsList.findIndex(item => {
      if (deleteBtnVisible || (!deleteBtnVisible && item.status === 1)) return item.checked === false
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
    let { cartList, isSelectAll, deleteBtnVisible } = this.data
    if (deleteBtnVisible) {
      cartList.map(item => {
        item.checked = !isSelectAll
        item.goodsList.map(_item => {
          _item.checked = !isSelectAll
        })
      })
      this.setData({ cartList }, () => {
        this.acount()
      })
    } else {
      cartList.map(item => {
        item.checked = !isSelectAll
        item.goodsList.map(_item => {
          if (_item.status === 1) _item.checked = !isSelectAll
        })
      })
      this.setData({ cartList }, () => {
        this.acount()
      })
    }
  },

  async acount() {
    this.totalCount = 0
    let selectedCount = 0
    let totalPrice = 0
    this.selectedCartIdArr = []

    const { cartList, deleteBtnVisible } = this.data

    if (deleteBtnVisible) {
      cartList.forEach(item => {
        item.goodsList.forEach(_item => {
          if (_item.checked) {
            this.selectedCartIdArr.push(_item.id)
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
          if (_item.status === 1 && _item.checked) {
            this.selectedCartIdArr.push(_item.id)
            selectedCount += _item.number
            totalPrice += _item.number * _item.price
          }
          this.totalCount += _item.number
        })
      })
      this.setData({ 
        selectedCount, 
        totalPrice,
        isSelectAll: selectedCount && selectedCount === this.totalCount
      })
    }
  },

  editCount(e) {
    let { cartIndex, goodsIndex, recId, stock } = e.currentTarget.dataset
    this.countControl(cartIndex, goodsIndex, recId, stock, e.detail)
  },

  async countControl(cartIndex, goodsIndex, recId, stock, mode) {
    let count = this.data.cartList[cartIndex].goodsList[goodsIndex].goods_number
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
            [`cartList[${cartIndex}].goodsList[${goodsIndex}].goods_number`]: count
          })
        }
        
        break
    }
    if (continueFlag) {
      let { goods_amount_formated: totalPrice, cart_number: selectedCount } = await goodsService.updateCartGoods({ recId, count })
      this.setData({ 
        totalPrice: totalPrice.slice(1), 
        selectedCount,
        [`cartList[${cartIndex}].goodsList[${goodsIndex}].goods_number`]: count
      })
    }
  },

  deleteGoodsList() {
    this.data.selectedCount && wx.showModal({
      title: '提示',
      content: '确定删除这些商品吗？',
      showCancel: true,
      success: async res => {
        if (res.confirm) {
          await goodsService.deleteCartList(this.selectedCartIdArr)
          this.setCartList()
        }
      }
    })
  },

  async deleteGoods(e) {
    const { id, cartIndex, goodsIndex } = e.currentTarget.dataset
    const { position, instance } = e.detail
    if (position === 'right') {
      wx.showModal({
        title: '提示',
        content: '确定删除该商品吗？',
        showCancel: true,
        success: async res => {
          if (res.confirm) {
            goodsService.deleteCartList(
              [id], 
              () => {
                const goodsList = this.data.cartList[cartIndex].goodsList
                goodsList.splice(goodsIndex, 1)
                if (goodsList.length) {
                  this.setData({
                    [`cartList[${cartIndex}].goodsList`]: goodsList
                  })
                } else {
                  const cartList = this.data.cartList
                  cartList.splice(cartIndex, 1)
                  this.setData({ cartList })
                }
                instance.close()
              },
              () => {
                wx.showToast({
                  title: '删除失败',
                  icon: 'none',
                })
                instance.close()
              }
            )
          } else {
            instance.close()
          }
        }
      })
    }
  },

  async editSpec(e) {
    const { goods_id: id, id: recId, goods_name: name, goods_thumb: img, product_number: stock, goods_number: count } = e.currentTarget.dataset.info
    const { attr_goods_info: mainInfo, shop_price: basePrice } = await goodsService.getGoodsSpec(id)
    this.setData({
      specInfo: { id, recId, name, img, basePrice, stock, count, mainInfo },
      specPopupVisible: true
    })
  },

  toggleDeleteBtnVisible() {
    this.setData({
      deleteBtnVisible: !this.data.deleteBtnVisible
    }, () => {
      this.acount()
    })
  },

  submit(){
    if (this.data.selectedCount) {
      wx.navigateTo({ 
        url: `/pages/subpages/mall/goods-detail/subpages/order-check/index?cartId=${this.selectedCartIdArr.join()}` 
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
    this.hideSpecModal()
  },

  navBack() {
    customBack()
  },

  hideSpecModal() {
    this.setData({ specPopupVisible: false })
  }
})
