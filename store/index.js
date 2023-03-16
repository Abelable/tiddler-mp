import { configure, observable, action } from 'mobx-miniprogram'
import tim from './modules/tim'
import live from './modules/live/index'

configure({ enforceActions: 'observed' }) // 不允许在动作外部修改状态

export const store = observable({
  tabType: 'home',
  userInfo: null,
  activeMediaItem: null,
  
  setTabType: action(function (type) {
    this.tabType = type
  }),
  setUserInfo: action(function (info) {
    this.userInfo = info
  }),
  setActiveMediaItem: action(function (info) {
    this.activeMediaItem = info
  }),

  ...tim,
  ...live
})
