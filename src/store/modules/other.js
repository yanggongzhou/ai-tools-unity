const state = {
  pcVisible:false,//预览提示框
  clValue:false,

  resourceReady:true,//资源准备
}

const getters = {
  PcVisible           :state => state.pcVisible,
  ClValue             :state => state.clValue,
  ResourceReady       :state => state.resourceReady,
}

const mutations = {
  //资源准备
  set_resourceReady(state,data) {
    state.resourceReady = data
  },
  //取消预览
  set_pcVisible(state,data) {
    if(!data){
      state.resourceReady=true
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
