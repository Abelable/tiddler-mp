export const debounce = (fn, delay = 200) => {
  let timeout = null
  return function() {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => fn.apply(this, arguments), delay)
  }
}

export const checkLogin = (success, domore = true) => {
  if (wx.getStorageSync('token')) {
    success && success()
  } else {
    if (typeof(domore) === 'boolean') {
      domore && wx.navigateTo({ url: '/pages/common/register/index' })
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

/**
 * 自定义返回
 * @param {boolean} needInitPrePageData 返回前一个页面之前是否需要初始化前一个页面的数据（约定方法名为initData）
 */
export const customBack = (needInitPrePageData = false) => {
  const registerPageRoute = 'pages/common/register/index'
  const minePageRoute = 'pages/mine/index'

  const pagesLength = getCurrentPages().length
  const curPage = getCurrentPages()[pagesLength - 1]
  const curPageRoute = curPage.route
  const prePage = getCurrentPages()[pagesLength - 2]
  const prePageRoute = prePage ? prePage.route : ''

  if (needInitPrePageData && typeof(prePage.initData) === 'function') prePage.initData()

  if (pagesLength === 1 || (curPageRoute === registerPageRoute && prePageRoute === minePageRoute)) {
    wx.switchTab({ url: '/pages/tab-bar-pages/home/index' })
  } else wx.navigateBack()
}


export const isVoid = (value) => (value === undefined || value === null || value === "")

export const cleanObject = (object) => {
  const result = { ...object }
  Object.keys(result).forEach((key) => {
    if (isVoid(result[key])) delete result[key]
  })
  return result
};