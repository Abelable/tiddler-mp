import { API_BASE_URL, VERSION } from '../../config'
import api from './api'

class Base {
  constructor() {
    this.baseUrl = `${API_BASE_URL}/api/${VERSION}`
  }

  async get({ url, data, success, fail, loadingTitle }) {
    const client = () => this.request({ url, data, loadingTitle })
    return await this.handleResult(client, success, fail)
  }

  async post({ url, data, success, fail, loadingTitle }) {
    const client = () => this.request({ url, data, method: 'POST', loadingTitle })
    return await this.handleResult(client, success, fail)
  }

  async request({ url, data, method = 'GET', loadingTitle }) {
    loadingTitle && wx.showLoading({ title: loadingTitle })
    const token = wx.getStorageSync('token')
    return api.request({ url, method, data,
      header: { 
        "content-type": method === 'GET' ? 'application/json' : 'application/x-www-form-urlencoded',
        "Authorization": token ? `Bearer ${token}` : ''
      }
    }).then(res => [res, null]).catch(err => [null, err]).finally(() => { loadingTitle && wx.hideLoading() })
  }

  async handleResult(client, success, fail) {
    const [res, err] = await client() || []
    // 网络异常
    if (err) {
      wx.showToast({ title: '断网啦～', icon: 'none' })
      return
    }
    // 服务器异常
    if (![200, 201, 204].includes(res.statusCode)) {
      wx.showToast({ title: '服务器开小差啦～', icon: 'none' })
      return
    }
    // token失效
    if (res.data.errno === 401) {
      await this.login()
      return await this.handleResult(client, success, fail)
    }
    // 其他异常
    if (res.data.errno !== 0) {
      if (fail) fail(res)
      else wx.showToast({ title: res.data.errmsg, icon: 'none' })
      return
    }
    if (success) success(res)
    else return res.data.data
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
