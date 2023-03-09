import LiveService from '../../../utils/liveService'

const liveService = new LiveService()

Component({ 
  properties: {
    roomInfo: Object,
  },

  data: {
    curMenuIdx: 0,
    dataList0:[],
    dataList1:[],
    dataSelectAll0: false,
    dataSelectAllArray0: [],
    dataSelectAll1: false,
    dataSelectAllArray1: [],
    recommend_id: ''
  },

  lifetimes: {
    attached() {
      this._getYouboRoomGoodsList(true)
      this._getRecommendId()
    }
  },
  
  methods: {
    async recommendFn(e){
      let { type, id } = e.currentTarget.dataset
      liveService.showGood({
        room_id: this.properties.roomInfo.id,
        good_id: id,
        type
      }, () => {
        if(type == '1'){
          this.setData({
            recommend_id: id
          })
        }else{
          this.setData({
            recommend_id: ''
          })
        }
        this.triggerEvent('getRecommendGood')
        this._getYouboRoomGoodsList(true)
      })
    },

    async statusChange(e){
      let { type, id } = e.currentTarget.dataset
      let good_id = id || ''
      let post_type = '1'
      if(type == 'downAll' || type == 'downOne') post_type = '2'
      let dataList = []
      if(type == 'downAll'){
        dataList = this.data.dataSelectAllArray0
      }
      if(type == 'upAll'){
        dataList = this.data.dataSelectAllArray1
      }
      if(type == 'downAll' || type == 'upAll'){
        if(dataList.length == 0){
          wx.showToast({
            title: `您先勾选按钮`,
            icon: 'none',
          });
          return false
        }
        good_id = dataList.join(',')
      }
      liveService.youboGoodsStatus({
        room_id: this.properties.roomInfo.id,
        good_id,
        type: post_type
      }, () => {
        this._getYouboRoomGoodsList(true)
        if(type == 'downAll' || type == 'downOne'){
          this.setData({
            dataSelectAll0: false,
            dataSelectAllArray0: []
          })
        }
        if(type == 'upAll' || type == 'upOne'){
          this.setData({
            dataSelectAll1: false,
            dataSelectAllArray1: []
          })
        }
        if((type == 'downOne' || type == 'downAll') && this.data.recommend_id && good_id.toString().includes(this.data.recommend_id.toString())){
          this.triggerEvent('getRecommendGood')
          this.setData({
            recommend_id: ''
          })
        }
      })
    },

    selectOne0(e){
      let { id } = e.currentTarget.dataset
      let { dataSelectAllArray0 } = this.data
      let index = dataSelectAllArray0.indexOf(id.toString())
      if(index == -1){
        dataSelectAllArray0.push(id.toString())
      }else{
        dataSelectAllArray0.splice(index, 1)
      }
      this.setData({ dataSelectAllArray0 })
      this.check('0', this.data.dataList0)
    },

    selectOne1(e){
      let { id } = e.currentTarget.dataset
      let { dataSelectAllArray1 } = this.data
      let index = dataSelectAllArray1.indexOf(id.toString())
      if(index == -1){
        dataSelectAllArray1.push(id.toString())
      }else{
        dataSelectAllArray1.splice(index, 1)
      }
      this.setData({ dataSelectAllArray1 })
      this.check('1', this.data.dataList1)
    },

    dataSelectAll0Fn(){
      if(this.data.dataSelectAll0){
        this.setData({
          dataSelectAll0: false,
          dataSelectAllArray0: []
        })
      }else{
        let dataSelectAll0 = []
        for(var i=0;i<this.data.dataList0.length;i++){
          dataSelectAll0.push(this.data.dataList0[i].goods_id.toString())
        }
        this.setData({
          dataSelectAll0: true,
          dataSelectAllArray0: dataSelectAll0
        })
      }
      this.check('0', this.data.dataList0)
    },

    dataSelectAll1Fn(){
      if(this.data.dataSelectAll1){
        this.setData({
          dataSelectAll1: false,
          dataSelectAllArray1: []
        })
      }else{
        let dataSelectAll1 = []
        for(var i=0;i<this.data.dataList1.length;i++){
          dataSelectAll1.push(this.data.dataList1[i].goods_id.toString())
        }
        this.setData({
          dataSelectAll1: true,
          dataSelectAllArray1: dataSelectAll1
        })
      }
      this.check('1', this.data.dataList1)
    },

    scrolltolowerFn(){
      this._getYouboRoomGoodsList(false)
    },

    selectMenu(e) {
      this.setData({
        curMenuIdx: Number(e.currentTarget.dataset.index)
      })
      this._getYouboRoomGoodsList(true)
    },

    async _getYouboRoomGoodsList(init = false) {
      const { curMenuIdx, dataList0, dataList1 } = this.data
      if (init) {
        curMenuIdx === 0 ? this.dataPage0 = 0 : this.dataPage1 = 0
      }
      const { list = [] } = await liveService.getYouboRoomGoodsList(this.properties.roomInfo.id, curMenuIdx === 0 ? '1' : '2', curMenuIdx === 0 ? ++this.dataPage0 : ++this.dataPage1) || {}
      if (curMenuIdx === 0) {
        this.check('0', init ? list : [...dataList0, ...list])
      } else {
        this.check('1', init ? list : [...dataList1, ...list])
      }
    },

    check(type, dataList){
      if(type == 0){
        console.log(this.data.dataSelectAllArray0)
        for(var i=0;i<dataList.length;i++){
          dataList[i].check = this.data.dataSelectAllArray0.includes(dataList[i].goods_id.toString())
        }
        this.setData({
          dataList0: dataList
        })
      }else{
        for(var i=0;i<dataList.length;i++){
          dataList[i].check = this.data.dataSelectAllArray1.includes(dataList[i].goods_id.toString())
        }
        this.setData({
          dataList1: dataList
        })
      }
    },

    async _getRecommendId() {
      const { list = [] } = await liveService.getYouboRoomGoodsList(this.properties.roomInfo.id, '3', 1) || {}
      if(list.length > 0){
        this.setData({
          recommend_id: list[0].goods_id
        })
      }
    },
    
    hide() {
      this.triggerEvent('hide')
    }
  }
})
