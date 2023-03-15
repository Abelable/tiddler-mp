import { storeBindingsBehavior } from 'mobx-miniprogram-bindings'
import { store } from '../../../../../store/index'

Component({
  options: {
    addGlobalClass: true,
  },

  behaviors: [storeBindingsBehavior],

  storeBindings: {
    store,
    fields: ['userInfo', 'audienceCount'],
  },
})
