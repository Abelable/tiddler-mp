import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../../../../store/index'

Component({
  options: {
    addGlobalClass: true
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['definitionIndex'],
  },

  properties: {
    roomInfo: Object,
    trafficPanelVisible: Boolean
  },
  
  methods: { 
    selectResolution(e) {
      const { index } = e.currentTarget.dataset
      store.setDefinitionIndex(Number(index))
    },

    hide() {
      this.triggerEvent('hide')
    }
  }
})
