const APP_ID = "wx42c839b60c28bb1b";
const VERSION = "v1";

// 环境配置：'pro' - 正式环境, 'dev' - 开发环境
const ENV = "pro";
const API_BASE_URL =
  ENV === "pro" ? "https://api.tiddler.cn" : "https://dev.api.tiddler.cn";
const WEBVIEW_BASE_URL =
  ENV === "pro" ? "https://h5.tiddler.cn/#" : "https://h5.tiddler.cn/#";
const QQ_MAP_KEY = "BGCBZ-UFHWX-MBQ4O-TANN2-7WTZ3-CLBIP";

export {
  APP_ID,
  VERSION,
  ENV,
  API_BASE_URL,
  WEBVIEW_BASE_URL,
  QQ_MAP_KEY
};
