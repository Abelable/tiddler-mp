import { API_BASE_URL, VERSION } from '../../config'
import api from './api'

class Base {
  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/${VERSION}`
  }

  async get({ url, data, success, fail, loadingTitle }) {
    loadingTitle && wx.showLoading({ title: loadingTitle })
    const [res, err] = await this.request({ url, data }) || []
    loadingTitle && wx.hideLoading()
    return this.processRes({ res, err, success, fail })
  }

  async post({ url, data, success, fail, loadingTitle }) {
    loadingTitle && wx.showLoading({ title: loadingTitle })
    const [res, err] = await this.request({ url, data, method: 'POST' }) || []
    loadingTitle && wx.hideLoading()
    return this.processRes({ res, err, success, fail })
  }

  async request({ url, data, method = 'GET' }) {
    const token = wx.getStorageSync('token')
    return api.request({ url, method, data,
      header: { 
        "content-type": method === 'GET' ? "application/json" : 'application/x-www-form-urlencoded',
        "Authorization": token ? `Bearer ${token}` : ''
      }
    }).then(res => [res, null]).catch(err => [null, err])
  }

  processRes({ res, err, success, fail }) {
    if (err) {
      wx.showToast({ title: err, icon: 'none' })
      return
    }
    if ([200, 201, 204].includes(res.statusCode)) {
      if (res.data.errno === 0) {
        if (success) success(res)
        else return res.data.data
      } else {
        fail ? fail(res) : wx.showToast({ title: res.data.errmsg, icon: 'none' })
      }
    } else wx.showToast({ title: res.data.errmsg, icon: 'none' })
  }

  getSetting() {
    return api.getSetting()
  }

  chooseImage(count) {
    return api.chooseImage({count})
  }

  async getLocation() {
    return api.getLocation()
  }  
  
  getUserInfo() {
    return api.getUserInfo()
  }

  getUserProfile() {
    return api.getUserProfile({ desc: '用于完善会员资料' })
  }

  getImageInfo(src) {
    src = src ? src.replace('http:', 'https:') : ''
    return api.getImageInfo({ src })
  }

  wxLogin() {
    return api.login()
  }
  
  requestSubscribeMessage(tmplId) {
    return api.requestSubscribeMessage({ tmplIds: [tmplId]})
  }
}

export default Base
