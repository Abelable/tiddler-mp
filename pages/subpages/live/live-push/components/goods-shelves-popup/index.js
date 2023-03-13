import LiveService from '../../../utils/liveService'

const liveService = new LiveService()

Component({ 
  options: {
    addGlobalClass: true
  },

  data: {
    curMenuIdx: 0,
    goodsList: [],
    multiple: false,
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

    switchMultiple(e) {
      this.setData({
        multiple: e.detail.value
      })
    },

    toggleAllSelected() {
      const { allSelected, goodsList } = this.data
      this.setData({
        allSelected: !allSelected,
        goodsList: goodsList.map(item => ({ ...item, checked: !allSelected }))
      })
    },

    select(e) {
      const { index } = e.currentTarget.dataset
      this.setData({
        [`goodsList[${index}].checked`]: !this.data.goodsList[index].checked
      })
      this.setData({
        allSelected: this.data.goodsList.findIndex(item => !item.checked) === -1
      })
    },
    
    hide() {
      this.triggerEvent('hide')
    }
  }
})
