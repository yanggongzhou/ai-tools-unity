const state = {
  pcVisible:false,//预览提示框
  clValue:false,

  resourceReady:true,//资源准备
  isSaveTip:false,//是否显示保存提示
  isFirstAvatarState:true,//在tools中是否是第一次切换角色
}

const getters = {
  PcVisible           :state => state.pcVisible,
  ClValue             :state => state.clValue,
  ResourceReady       :state => state.resourceReady,
  IsSaveTip           :state => state.isSaveTip,
  IsFirstAvatarState  :state => state.isFirstAvatarState,
}

const mutations = {
  //
  set_IsFirstAvatarState(state,data) {
    state.isFirstAvatarState = data
  },
  //保存提示
  set_IsSaveTip(state,data) {
    state.isSaveTip = data
  },
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
