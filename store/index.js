import { configure, observable, action } from 'mobx-miniprogram'

configure({ enforceActions: 'observed' }) // 不允许在动作外部修改状态

export const store = observable({
  cartCount: 0,
  
  updateCartCount: action(function (count) {
    this.cartCount = count
  }),
})
