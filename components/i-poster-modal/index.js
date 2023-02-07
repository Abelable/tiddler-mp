import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../store/index'
import BaseService from '../../service/baseService'
let baseService = new BaseService()

Component({
  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['userInfo']
  },

  properties: {
    roomPosterInfo: {
      type: Object,
      observer: "creatRoomPoster"
    },
    goodsPosterInfo: {
      type: Object,
      observer: "creatGoodsPoster"
    },
    shopPosterInfo: {
      type: Object,
      observer: "creatShopPoster"
    },
    videoPosterInfo: {
      type: Object,
      observer: "creatVideoPoster"
    }
  },

  data: {
    show: false
  },

  attached() {
    this.setData({ show: true })
  },
  
  methods: {
    async creatRoomPoster(roomPosterInfo) {
      let { cover, title, avatar, name, status, qrCode } = roomPosterInfo
      const ctx = wx.createCanvasContext("poster", this)

      this.roundRect(ctx, 0, 0, 310, 480, 12, '', null, '#f8f8f8')
      this.roundRect(ctx, 0, 0, 310, 310, [8, 8, 0, 0], cover)

      let statusArr = [{ color: '#D07A00', desc: '预告' }, { color: '#00D011', desc: '直播中' }, { color: '#5562F9', desc: '回放' }]
      this.roundRect(ctx, 10, 25, 75, 28, 14, '', null, 'rgba(0, 0, 0, 0.5)')
      this.roundRect(ctx, 20, 35.5, 7, 7, 3.5, '', null, statusArr[status].color)
      this.setText(ctx, 13, '#fff', 35, 44, statusArr[status].desc)

      this.roundRect(ctx, 0, 310, 310, 118)
      this.roundRect(ctx, 17, 341.5, 44, 44, 22, avatar)
      name = name.length > 8 ? name.slice(0, 8) + '...' : name
      this.setText(ctx, 16, '#333', 68, 360, name)
      title = title.length > 10 ? title.slice(0, 10) + '...' : title
      this.setText(ctx, 12, '#666', 68, 380, title)

      ctx.drawImage(qrCode, 215, 320, 80, 80)
      this.setText(ctx, 11, '#999', 215, 415, '长按进入直播间')

      if (!this.logo) { 
        let { path } = await baseService.getImageInfo('https://img.ubo.vip/mp/i-poster-modal/logo.png')
        this.logo = path
      }
      ctx.drawImage(this.logo, 114, 435, 82, 18)
      this.setText(ctx, 11, '#999', 155, 470, `分享者@${this.data.userInfo.userName}`, 'center')

      ctx.draw(true, setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'poster',
          success: res => {
            this.posterUrl = res.tempFilePath
          }
        }, this)
      }, 200))
    },

    async creatVideoPoster(videoPosterInfo) {
      let { cover, title, avatar, name, qrCode } = videoPosterInfo
      const ctx = wx.createCanvasContext("poster", this)

      this.roundRect(ctx, 0, 0, 310, 480, 12, '', null, '#f8f8f8')
      this.roundRect(ctx, 0, 0, 310, 310, [8, 8, 0, 0], cover)

      this.roundRect(ctx, 0, 310, 310, 118)
      this.roundRect(ctx, 17, 341.5, 44, 44, 22, avatar)
      this.setText(ctx, 16, '#333', 68, 360, name)
      this.setText(ctx, 12, '#666', 68, 380, title)

      ctx.drawImage(qrCode, 215, 320, 80, 80)
      this.setText(ctx, 11, '#999', 215, 415, '长按查看短视频')

      if (!this.logo) { 
        let { path } = await baseService.getImageInfo('https://img.ubo.vip/mp/i-poster-modal/logo.png')
        this.logo = path
      }
      ctx.drawImage(this.logo, 114, 435, 82, 18)
      this.setText(ctx, 11, '#999', 155, 470, `分享者@${this.data.userInfo.userName}`, 'center')

      ctx.draw(true, setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'poster',
          success: res => {
            this.posterUrl = res.tempFilePath
          }
        }, this)
      }, 200))
    },

    async creatGoodsPoster(goodsPosterInfo) {
      let { goodsPic, shopPrice, goodsName, qrCode } = goodsPosterInfo
      const ctx = wx.createCanvasContext("poster", this)

      this.roundRect(ctx, 0, 0, 310, 480, 12, '', null, '#f8f8f8')
      this.roundRect(ctx, 0, 0, 310, 310, [8, 8, 0, 0], goodsPic)
      
      this.roundRect(ctx, 0, 310, 310, 118)
      this.setText(ctx, 20, '#D0132B', 20, 360, shopPrice)
      this.setText(ctx, 12, '#666', 20, 380, goodsName.length > 10 ? goodsName.slice(0, 10) + '...' : goodsName)

      ctx.drawImage(qrCode, 210, 320, 80, 80)
      this.setText(ctx, 11, '#999', 200, 415, '长按识别二维码购买')

      if (!this.logo) { 
        let { path } = await baseService.getImageInfo('https://img.ubo.vip/mp/i-poster-modal/logo.png')
        this.logo = path
      }
      ctx.drawImage(this.logo, 114, 435, 82, 18)
      this.setText(ctx, 11, '#999', 155, 470, `分享者@${this.data.userInfo.userName}`, 'center')

      ctx.draw(true, setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'poster',
          success: res => {
            this.posterUrl = res.tempFilePath
          }
        }, this)
      }, 200))
    },

    async creatShopPoster(shopPosterInfo) {
      let { avatar, name, desc, cover, qrCode } = shopPosterInfo

      const ctx = wx.createCanvasContext("poster", this)

      let { path: posterBg } = await baseService.getImageInfo('https://img.ubo.vip/mp/i-poster-modal/poster-bg.jpg')
      ctx.drawImage(posterBg, 0, 0, 300, 482)

      this.roundRect(ctx, 21.5, 55.5, 256, 366, 8)

      avatar && this.roundRect(ctx, 116, 21.5, 68, 68, 34, avatar, { x: 0, y: 1, blur: 5, color: '#333' })
      name && this.setText(ctx, 14, '#333', 150, 115, name, 'center')
      desc && this.setText(ctx, 10, '#666', 150, 135, desc, 'center')

      cover && ctx.drawImage(cover, 40, 150, 220, 150)

      ctx.drawImage(qrCode, 116, 320, 68, 68)
      this.setText(ctx, 8, '#999', 150, 400, '长按识别二维码', 'center')

      let { path: youboLogo } = await baseService.getImageInfo('https://img.ubo.vip/mp/i-poster-modal/youbo-logo.png')
      ctx.drawImage(youboLogo, 76, 440, 148, 21)

      ctx.draw(true, setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'poster',
          success: res => {
            this.posterUrl = res.tempFilePath
          }
        }, this)
      }, 200))
    },

    /**
     * 绘制圆角矩形
     * @param {Object} ctx - canvas组件的绘图上下文
     * @param {Number} x - 矩形的x坐标
     * @param {Number} y - 矩形的y坐标
     * @param {Number} w - 矩形的宽度
     * @param {Number} h - 矩形的高度
     * @param {Number} r - 矩形的圆角半径
     * @param {Number} cover - 矩形的封面
     * @param {Object} shadow - 矩形的阴影
     * @param {String} [c = 'transparent'] - 矩形的填充色
     */
    roundRect(ctx, x, y, w, h, r = 0, cover = '', shadow = null, c = '#fff') {
      ctx.save()
      ctx.beginPath()

      if (shadow) {
        let { x, y, blur, color } = shadow
        ctx.shadowOffsetX = x
        ctx.shadowOffsetY = y
        ctx.shadowBlur = blur
        ctx.shadowColor = color
      }
      let r1, r2, r3, r4 
      typeof(r) === 'number' ? r1 = r2 = r3 = r4 = r : ([r1, r2, r3, r4] = r)

      ctx.moveTo(x, y);
      r2 ? ctx.arcTo(x + w, y, x + w, y + h, r2) : ctx.lineTo(x + w, y)
      r3 ? ctx.arcTo(x + w, y + h, x , y + h, r3) : ctx.lineTo(x + w, y + h)
      r4 ? ctx.arcTo(x, y + h, x, y, r4) : ctx.lineTo(x, y + h)
      r1 ? ctx.arcTo(x, y, x + w, y , r1) : ctx.lineTo(x, y)
     
      ctx.fillStyle = c
      ctx.fill()
      
      cover && (ctx.clip(), ctx.drawImage(cover, x, y, w, h)) 
      ctx.restore()
    },

    setText(ctx, fs, color, x, y, c, align = 'left') {
      ctx.setFontSize(fs);
      ctx.setFillStyle(color);
      ctx.setTextAlign(align);
      ctx.fillText(c, x, y);
      ctx.restore();
    },

    save() {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.writePhotosAlbum'] !== false) this.saveImageToPhotosAlbum()
          else wx.showModal({
            title: '信息授权提示',
            content: '您当前为未授权状态，请到小程序的设置中打开授权',
            showCancel: true,
            cancelText: '取消',
            confirmText: '去设置',
            success: res => {
              if (res.confirm) wx.openSetting({ success: () => { this.saveImageToPhotosAlbum() }})
            }
          })
        }
      })
    },

    saveImageToPhotosAlbum() {
      wx.saveImageToPhotosAlbum({
        filePath: this.posterUrl,
        success: () => {
          this.triggerEvent('hidePosterModal')
          wx.showToast({ title: '成功保存', icon:"success" })
        }
      })
    },

    hideAuthModal() {
      this.setData({
        authModalVisible: false
      })
    }
  }
})