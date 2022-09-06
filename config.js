const VERSION = 'v1'

// 环境配置：'pro' - 正式环境, 'dev' - 开发环境
const ENV = 'pro' 
const API_BASE_URL = ENV === 'pro' ? 'http://localhost' : 'http://localhost'
const WEBVIEW_BASE_URL = ENV === 'pro' ? 'http://localhost' : 'http://localhost'

export {
  VERSION,
  ENV,
  API_BASE_URL,
  WEBVIEW_BASE_URL,
}
