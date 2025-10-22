Page({
  data: {
    licenseList: [
      "https://static.tiddler.cn/mp/license/business_license.webp?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,size_80,text_5LuF5L6b5bCP6bG85ri45bmz5Y-w5bGV56S65L2_55SoLCDku5bnlKjml6DmlYg=,color_999999,rotate_315,t_100,g_se,x_10,y_10,fill_1",
      "https://static.tiddler.cn/mp/license/ICP_license.webp?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,size_50,text_5LuF5L6b5bCP6bG85ri45bmz5Y-w5bGV56S65L2_55SoLCDku5bnlKjml6DmlYg=,color_999999,rotate_315,t_100,g_se,x_10,y_10,fill_1",
      "https://static.tiddler.cn/mp/license/TV_production_license.webp?x-oss-process=image/watermark,type_d3F5LXplbmhlaQ,size_80,text_5LuF5L6b5bCP6bG85ri45bmz5Y-w5bGV56S65L2_55SoLCDku5bnlKjml6DmlYg=,color_999999,rotate_315,t_100,g_se,x_10,y_10,fill_1"
    ]
  },

  previewImage(e) {
    const { current, urls } = e.currentTarget.dataset;
    wx.previewImage({ current, urls });
  }
});
