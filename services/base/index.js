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

  async handleResult(client, success, fail, relogin = false) {
    const [res, err] = await client() || []

    // 设备异常：没有网络或其他情况
    if (err) {
      wx.showToast({ title: JSON.stringify(err), icon: 'none' })
      return
    }

    // 未授权，需要重新登录：没有携带token，或者token无效
    if (res.statusCode === 401) {
      if (relogin) {
        wx.showToast({ title: '登录异常，请联系客服，或尝试重新安装小程序', icon: 'none' })
        return
      }
      await this.login()
      return await this.handleResult(client, success, fail, true)
    }

    // 禁止访问：token过期，可通过刷新token继续访问
    if (res.statusCode === 403) {
      await this.refreshToken()
      return await this.handleResult(client, success, fail)
    }

    // 服务器异常
    if (![200, 201, 204].includes(res.statusCode)) {
      wx.showToast({ title: res.data.message, icon: 'none' })
      return
    }
    
    // 其他异常
    if (res.data.code !== 0) {
      if (fail) fail(res)
      else wx.showToast({ title: res.data.message, icon: 'none' })
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
