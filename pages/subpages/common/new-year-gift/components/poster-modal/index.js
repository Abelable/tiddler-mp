let canvas = null;
let ctx = null;

Component({
  properties: {
    qrCode: String
  },

  lifetimes: {
    async attached() {
      wx.showLoading({ title: "海报生成中" });
      await this.init();
      await this.createPoster();
      wx.hideLoading();
    }
  },

  methods: {
    init() {
      return new Promise(resolve => {
        this.createSelectorQuery()
          .select("#poster")
          .fields({ node: true, size: true })
          .exec(res => {
            if (res && res.length) {
              canvas = res[0].node;
              const renderWidth = res[0].width;
              const renderHeight = res[0].height;
              ctx = canvas.getContext("2d");

              const dpr = getApp().globalData.systemInfo.pixelRatio;
              canvas.width = renderWidth * dpr;
              canvas.height = renderHeight * dpr;
              ctx.scale(dpr, dpr);
              resolve();
            }
          });
      });
    },

    async createPoster() {
      await this.drawImage(
        "https://static.tiddler.cn/mp/new_year_gift/poster_bg.png",
        0,
        0,
        320,
        510
      );
      await this.roundRect(130, 440, 60, 60, 30, this.properties.qrCode);
      wx.canvasToTempFilePath(
        {
          canvas,
          success: res => {
            this.posterUrl = res.tempFilePath;
          }
        },
        this
      );
    },

    /**
     * 绘制圆角矩形
     * @param {Number} x - 矩形的x坐标
     * @param {Number} y - 矩形的y坐标
     * @param {Number} w - 矩形的宽度
     * @param {Number} h - 矩形的高度
     * @param {Number} r - 矩形的圆角半径
     * @param {String} cover - 矩形的封面
     * @param {Object} shadow - 矩形的阴影
     * @param {String} [c = 'transparent'] - 矩形的填充色
     */
    async roundRect(
      x,
      y,
      w,
      h,
      r = 0,
      cover = "",
      shadow = null,
      c = "transparent"
    ) {
      ctx.save();
      ctx.beginPath();

      if (shadow) {
        let { x, y, blur, color } = shadow;
        ctx.shadowOffsetX = x;
        ctx.shadowOffsetY = y;
        ctx.shadowBlur = blur;
        ctx.shadowColor = color;
      }
      let r1, r2, r3, r4;
      typeof r === "number" ? (r1 = r2 = r3 = r4 = r) : ([r1, r2, r3, r4] = r);

      ctx.moveTo(x, y);
      r2 ? ctx.arcTo(x + w, y, x + w, y + h, r2) : ctx.lineTo(x + w, y);
      r3 ? ctx.arcTo(x + w, y + h, x, y + h, r3) : ctx.lineTo(x + w, y + h);
      r4 ? ctx.arcTo(x, y + h, x, y, r4) : ctx.lineTo(x, y + h);
      r1 ? ctx.arcTo(x, y, x + w, y, r1) : ctx.lineTo(x, y);

      ctx.fillStyle = c;
      ctx.fill();

      if (cover) {
        ctx.clip();
        await this.drawImage(cover, x, y, w, h);
      }
      ctx.restore();
    },

    createLinearGradient(startX, startY, stopX, stopY, startColor, stopColor) {
      const grad = ctx.createLinearGradient(startX, startY, stopX, stopY);
      grad.addColorStop(0, startColor);
      grad.addColorStop(1, stopColor);
      return grad;
    },

    setText(
      fs,
      color,
      x,
      y,
      c,
      align = "left",
      bold = false,
      fontFamily = "sans-serif"
    ) {
      ctx.font = bold ? `bold ${fs}px ${fontFamily}` : `${fs}px ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.textAlign = align;
      ctx.fillText(c, x, y);
      ctx.restore();
    },

    setWrapText(
      fs,
      color,
      x,
      y,
      c,
      lineHeight,
      maxWidth,
      bold = false,
      maxRow = 2,
      fontFamily = "sans-serif"
    ) {
      ctx.font = bold ? `bold ${fs}px ${fontFamily}` : `${fs}px ${fontFamily}`;
      ctx.fillStyle = color;
      let line = "";
      let row = 0;
      for (let i = 0; i < c.length; i++) {
        const tempLine = line + c[i];
        const tempLineWidth = ctx.measureText(tempLine).width;
        if (tempLineWidth > maxWidth && i > 0) {
          row++;
          if (row === maxRow) {
            line = tempLine.slice(0, -2) + "...";
            break;
          } else {
            ctx.fillText(line, x, y);
            line = c[i];
            y += lineHeight;
          }
        } else {
          line = tempLine;
        }
      }
      ctx.fillText(line, x, y);
      ctx.restore();
    },

    drawImage(src, x, y, w, h, mode = "cover") {
      return new Promise(resolve => {
        const image = canvas.createImage();
        image.src = src;
        image.onload = () => {
          switch (mode) {
            case "cover":
              this.drawCoverImage(image, x, y, w, h);
              break;

            case "contain":
              this.drawContainImage(image, x, y, w, h);
              break;

            case "fill":
              ctx.drawImage(image, x, y, w, h);
              break;

            case "none":
              ctx.drawImage(image, x, y, image.width, image.height);
              break;
          }
          resolve();
        };
      });
    },

    drawCoverImage(image, x, y, w, h) {
      const scale = this.calcCoverScale(image.width, image.height, w, h);
      const _w = image.width * scale;
      const _h = image.height * scale;
      const { _x, _y } = this.calcPos(_w, _h, w, h);
      ctx.drawImage(image, x + _x, y + _y, _w, _h);
    },

    drawContainImage() {
      const scale = this.calcContainScale(image.width, image.height, w, h);
      const _w = image.width * scale;
      const _h = image.height * scale;
      const { _x, _y } = this.calcPos(_w, _h, w, h);
      ctx.drawImage(image, x + _x, y + _y, _w, _h);
    },

    /**
     * 绘制正方形 6 宫格（2 行 3 列），每个宫格保持正方形
     * @param {number} x 起始 x 坐标（整个区域的左上角）
     * @param {number} y 起始 y 坐标（整个区域的左上角）
     * @param {number} size 区域总宽高（正方形）
     * @param {Array<string>} images 最多 6 张图片
     */
    async drawSixGrid(x, y, size, images = []) {
      const cols = 3;
      const rows = 2;
      const spacing = 2;
      const cornerRadius = 12;
      const bgColor = "#f1f1f1";

      // 计算每个正方形宫格的边长
      const totalSpacingX = spacing * (cols - 1);
      const totalSpacingY = spacing * (rows - 1);

      const itemSize = Math.floor(
        Math.min((size - totalSpacingX) / cols, (size - totalSpacingY) / rows)
      );

      const contentWidth = itemSize * cols + totalSpacingX;
      const contentHeight = itemSize * rows + totalSpacingY;

      // 居中起始点
      const offsetX = x + (size - contentWidth) / 2;
      const offsetY = y + (size - contentHeight) / 2;

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const idx = row * cols + col;
          const px = offsetX + col * (itemSize + spacing);
          const py = offsetY + row * (itemSize + spacing);

          // 圆角设置
          const radius = [0, 0, 0, 0];
          if (row === 0 && col === 0) radius[0] = cornerRadius; // 左上
          if (row === 0 && col === cols - 1) radius[1] = cornerRadius; // 右上
          if (row === rows - 1 && col === cols - 1) radius[2] = cornerRadius; // 右下
          if (row === rows - 1 && col === 0) radius[3] = cornerRadius; // 左下

          // 背景
          await this.roundRect(
            px,
            py,
            itemSize,
            itemSize,
            radius,
            "",
            null,
            bgColor
          );

          // 图片
          const imgUrl = images[idx];
          if (imgUrl) {
            ctx.save();
            this.createRoundRectPath(ctx, px, py, itemSize, itemSize, radius);
            ctx.clip();
            await this.drawImage(imgUrl, px, py, itemSize, itemSize);
            ctx.restore();
          }
        }
      }
    },

    createRoundRectPath(ctx, x, y, w, h, r) {
      // r: [top-left, top-right, bottom-right, bottom-left]
      const [tl, tr, br, bl] = r;

      ctx.beginPath();
      ctx.moveTo(x + tl, y);
      ctx.lineTo(x + w - tr, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
      ctx.lineTo(x + w, y + h - br);
      ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
      ctx.lineTo(x + bl, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
      ctx.lineTo(x, y + tl);
      ctx.quadraticCurveTo(x, y, x + tl, y);
      ctx.closePath();
    },

    /**
     * cover 模式
     * @param {number} w 图片宽度
     * @param {number} h 图片高度
     * @param {number} cw 容器宽度
     * @param {number} ch 容器高度
     * @returns {number} 缩放比
     */
    calcCoverScale(w, h, cw, ch) {
      const scaleW = cw / w;
      const scaleH = ch / h;
      const scale = Math.max(scaleW, scaleH); // 取大值
      return scale;
    },

    /**
     * contain 模式
     * @param {number} w 图片宽度
     * @param {number} h 图片高度
     * @param {number} cw 容器宽度
     * @param {number} ch 容器高度
     * @returns {number} 缩放比
     */
    calcContainScale(w, h, cw, ch) {
      const scaleW = cw / w;
      const scaleH = ch / h;
      const scale = Math.min(scaleW, scaleH); // 取小值
      return scale;
    },

    // 计算让图片居中需要设置的 x，y
    calcPos(w, h, cw, ch) {
      return {
        _x: (cw - w) / 2,
        _y: (ch - h) / 2
      };
    },

    save() {
      wx.getSetting({
        success: res => {
          if (res.authSetting["scope.writePhotosAlbum"] !== false)
            this.saveImageToPhotosAlbum();
          else
            wx.showModal({
              title: "信息授权提示",
              content: "您当前为未授权状态，请到小程序的设置中打开授权",
              showCancel: true,
              cancelText: "取消",
              confirmText: "去设置",
              success: res => {
                if (res.confirm)
                  wx.openSetting({
                    success: () => {
                      this.saveImageToPhotosAlbum();
                    }
                  });
              }
            });
        }
      });
    },

    saveImageToPhotosAlbum() {
      wx.saveImageToPhotosAlbum({
        filePath: this.posterUrl,
        success: () => {
          this.triggerEvent("hide");
          wx.showToast({ title: "成功保存", icon: "none" });
        }
      });
    },

    hide() {
      this.triggerEvent("hide");
    },

    catch() {}
  }
});
