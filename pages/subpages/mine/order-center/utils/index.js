export const navigateBack = () => {
  const orderCenterPageRoute = "pages/subpages/mine/order-center/index";
  const curPages = getCurrentPages();
  const prePage = curPages[curPages.length - 2];
  const prePageRoute = prePage ? prePage.route : "";
  if (prePageRoute === orderCenterPageRoute) {
    wx.navigateBack();
  } else {
    wx.switchTab({
      url: "/pages/tab-bar-pages/mine/index",
    });
  }
};
