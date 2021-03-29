const state = {
  pcVisible:false,
  clValue:false,
}

const getters = {
  PcVisible           :state => state.pcVisible,
  ClValue             :state => state.clValue
}

const mutations = {
  //取消预览
  set_pcVisible(state,data) {
    if(!data){
      state.clValue = true
      UnityPreviewCancel()
      setTimeout( ()=>{
        state.pcVisible = data
      },1000)
    }else {
      state.clValue = false
      state.pcVisible = data
    }
  },
}

const actions = {

}

export default {
  state,
  actions,
  getters,
  mutations
}
