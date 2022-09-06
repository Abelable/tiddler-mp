const checkLogin = (success, domore = true) => {
  if (wx.getStorageSync('token')) {
    success && success()
  } else {
    if (typeof(domore) === 'boolean') {
      domore && wx.navigateTo({ url: '/pages/common/register/index' })
    } else domore()
  }
}

export default checkLogin