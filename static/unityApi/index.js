// 本地注册函数

//请求用户信息
function UnityUserInfo() {
  console.log('用户信息')
}


//在线预览--&播放 ---bool 是否是预览来处理是否需要互动，bool2是否需要本地存储
function UnityPreview(avatarName,json,bool,bool2){
  console.log(avatarName,json,bool,bool2)
}
//在线预览--&开始播放
function UnityPreviewStart(avatarName){
  console.log('开始播放',avatarName)
}

//在线预览--&停止播放
function UnityPreviewCancel(avatarName){
  console.log('停止播放',avatarName)
}



//触发模型动作
function UnityAvatarAction(avatarName,actionName){
  console.log('触发动作',avatarName,actionName)
}

//选择角色
function UnityChangeAvatar(val) {
  console.log('请求切换角色',val)
}

//要动作
function UnityAvatarMotionInfo(val) {
  console.log('请求角色动作',val)
}

//播放临时话术
function UnityPreviewTxt(avatarName,json) {
  console.log('播放临时话术',avatarName,json)
}

//unity继续播放
function UnityPreviewContinue(avatarName) {
  console.log('unity继续播放',avatarName)
}

//unity互动播放结束
function UnityInteractionEnd(avatarName) {
  console.log('unity互动播放结束',avatarName)
}

//unity互动播放开始
function UnityInteractionStart(avatarName) {
  console.log('unity互动播放开始',avatarName)
}

//unity互动状态
function UnityInteractionStateChange(state) {
  console.log('unity互动状态',state)
}

//unity自动直播中插入互动对话--该功能会直接进入互动模式
function UnityTemporaryInteractionStart() {
  console.log('unity自动直播中插入互动对话')
}
