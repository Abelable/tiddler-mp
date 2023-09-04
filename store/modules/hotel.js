import { action } from 'mobx-miniprogram'

export default {
  checkInDate: "",
  checkOutDate: "",
  adultNum: 2,
  childNum: 0,

  setCheckInDate: action(function (date) {
    this.checkInDate = date
  }),
  setCheckOutDate: action(function (date) {
    this.checkOutDate = date
  }),
  setAdultNum: action(function (num) {
    this.adultNum = num
  }),
  setChildNum: action(function (num) {
    this.childNum = num
  }),
}
