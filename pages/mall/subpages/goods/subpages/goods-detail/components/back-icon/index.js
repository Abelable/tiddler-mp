import { customBack } from '../../../../../../../../utils/jumpPage'

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
