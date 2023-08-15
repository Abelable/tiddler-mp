Page({
  data: {
    menuList: [],
    imagesList: [],
  },

  onLoad({ menuList, imagesList }) {
    menuList = JSON.parse(menuList);
    imagesList = JSON.parse(imagesList);
    this.setData({ menuList, imagesList });
  },
});
