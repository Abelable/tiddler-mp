import { configure, observable, action } from 'mobx-miniprogram'
import tim from './modules/tim'

configure({ enforceActions: 'observed' }) // 不允许在动作外部修改状态

export const store = observable({
  userInfo: null,
  
  setUserInfo: action(function (info) {
    this.userInfo = info
  }),

  ...tim,
})
