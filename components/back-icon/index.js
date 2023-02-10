import { customBack } from '../../utils/index'

Component({ 
  properties: {
    custom: Boolean
  },
  methods: { 
    navigateBack() {
      this.properties.custom ? this.triggerEvent('navigateBack') : customBack()
    }
  }
})
