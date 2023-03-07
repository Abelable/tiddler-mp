import { configure, observable, action } from 'mobx-miniprogram'

configure({ enforceActions: 'observed' }) // 不允许在动作外部修改状态

export const store = observable({
  userInfo: null,
  cartCount: 0,
  
  setUserInfo: action(function (info) {
    this.userInfo = info
  }),
  updateCartCount: action(function (count) {
    this.cartCount = count
  }),
})
