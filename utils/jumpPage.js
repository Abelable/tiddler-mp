/**
 * 页面跳转
 * @param {*} type 0首页，1商品详情，2品牌详情，3h5网页，5专题，6优惠券列表，7分类类目， 8分类详情， 9钻石专享， 10高佣专区， 11低价专区， 12每周必buy
 * @param {*} param 
 * @param {*} title 
 */
const linkTo = (type, param, title) => {
  switch (Number(type)) {
    case 0:
      wx.switchTab({ url: '/pages/tab-bar-pages/index/index' })
      break
    case 1:
      param && wx.navigateTo({ url: `/pages/subpages/index/goods/subpages/goods-detail/index?id=${param.replace('?', '&')}` })
      break
    case 3:
      wx.navigateTo({ url: `/pages/subpages/common/webview/index?url=${param.replace('http:', 'https:').replace('?', '&')}` })
      break
    case 6:
      wx.navigateTo({ url: '/pages/subpages/mine/coupon/index' })
      break
    case 7:
      wx.navigateTo({ url: '/pages/subpages/index/goods/subpages/category/index' })
      break
    case 8:
      wx.navigateTo({ url: `/pages/subpages/index/goods/subpages/category/category-detail/index?id=${param}&title=${title}` })
      break
    case 10:
      wx.navigateTo({ url: `/pages/subpages/index/room/index?id=${param.replace('?', '&')}` })
      break
    case 11:
      wx.navigateTo({ url: '/pages/subpages/index/goods/index' })
      break
  }
}


/**
 * 自定义返回
 * @param {boolean} needInitPrePageData 返回前一个页面之前是否需要初始化前一个页面的数据（约定方法名为initData）
 */
const customBack = (needInitPrePageData = false) => {
  const registerPageRoute = 'pages/common/register/index'
  const minePageRoute = 'pages/mine/index'

  const pagesLength = getCurrentPages().length
  const curPage = getCurrentPages()[pagesLength - 1]
  const curPageRoute = curPage.route
  const prePage = getCurrentPages()[pagesLength - 2]
  const prePageRoute = prePage ? prePage.route : ''

  if (needInitPrePageData && typeof(prePage.initData) === 'function') prePage.initData()

  if (pagesLength === 1 || (curPageRoute === registerPageRoute && prePageRoute === minePageRoute)) {
    wx.switchTab({ url: '/pages/index/index' })
  } else wx.navigateBack()
}

export {
  linkTo,
  customBack
}
