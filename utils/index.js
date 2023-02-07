export const debounce = (fn, delay = 200) => {
  let timeout = null
  return function() {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, arguments), delay)
  }
}

export const checkLogin = (success, domore) => {
  if (wx.getStorageSync('token')) {
    success && success()
  } else {
    if (typeof(domore) === 'boolean') {
      domore && goLogin()
    } else domore()
  }
}

export const formatDate = (date, format) => {
  const week =  ['日', '一', '二', '三', '四', '五', '六']
  const formatObj = {
    'YYYY': date.getFullYear(),
    'MM':  `${date.getMonth() + 1}`.padStart(2, '0'),
    'DD': `${date.getDate()}`.padStart(2, '0'),
    'hh': `${date.getHours()}`.padStart(2, '0'),
    'mm': `${date.getMinutes()}`.padStart(2, '0'),
    'ss': `${date.getSeconds()}`.padStart(2, '0'),
    'week': `星期${week[date.getDay()]}`
  } 

  for (const key in formatObj) {
    format = format.replace(key, formatObj[key])
  }

  return format
}

export const getQueryString = (url, name) => {
  const paramsArr = url.substring(url.indexOf('?') + 1).split('&')
  let r = ''
  paramsArr.forEach(item => {
    const valueArr = item.split('=')
    if (valueArr[0] === name) r = valueArr[1]
  })
  return r
}

export const customBack = (studioId) => {
  const pagesLength = getCurrentPages().length
  const prePage = getCurrentPages()[pagesLength - 2]
  const prePageRoute = prePage ? prePage.route : ''
  if (pagesLength === 1 || prePageRoute === 'pages/subpages/home/create-live/index' || prePageRoute === 'pages/tab-bar-pages/mine/index') {
    studioId && wx.setStorageSync('shareStudioId', studioId)
    wx.switchTab({ url: '/pages/tab-bar-pages/home/index' })
  } else wx.navigateBack()
}

let isLogin = false
export const goLogin = () => {
  if (isLogin) return
  isLogin = true
  setTimeout(() => {
    isLogin = false
  }, 2000)
  const pages = getCurrentPages()
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].__route__ === 'pages/subpages/common/login/index') {
      return
    }
  }
  wx.navigateTo({
    url: '/pages/subpages/common/login/index'
  })
}
