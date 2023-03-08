import promisify from './promisify'

export default {
  getSetting: promisify(wx.getSetting),
  getLocation: promisify(wx.getLocation),
  request: promisify(wx.request),
  uploadFile: promisify(wx.uploadFile),
  chooseImage: promisify(wx.chooseImage),
  getUserProfile: promisify(wx.getUserProfile),
  getImageInfo: promisify(wx.getImageInfo),
  requestSubscribeMessage: promisify(wx.requestSubscribeMessage),
  login: promisify(wx.login)
}