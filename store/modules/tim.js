import { action } from 'mobx-miniprogram'

export default {
  tim: null,

  setTim: action(function (tim) {
    this.tim = tim
  }),
}
