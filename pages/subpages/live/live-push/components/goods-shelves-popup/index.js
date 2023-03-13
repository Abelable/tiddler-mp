import LiveService from '../../../utils/liveService'

const liveService = new LiveService()

Component({ 
  data: {
    curMenuIdx: 0,
    goodsList: [],
    allSelected: false
  },

  lifetimes: {
    attached() {
      this.setGoodsList()
    }
  },
  
  methods: {
    selectMenu(e) {
      const curMenuIdx = Number(e.currentTarget.dataset.index)
      this.setData({ curMenuIdx })
      this.setGoodsList()
    },

    async setGoodsList() {
      const { curMenuIdx } = this.data
      const goodsList = await liveService.getPushRoomGoodsList(curMenuIdx === 0 ? 1 : 0)
      this.setData({ 
        goodsList: goodsList.map(item => ({ ...item, checked: false }))
      })
    },
    
    hide() {
      this.triggerEvent('hide')
    }
  }
})
