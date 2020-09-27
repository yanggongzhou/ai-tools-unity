// 本地注册函数

//请求用户信息
function UnityUserInfo() {
  console.log('用户信息')
}


//在线预览--&播放
function UnityPreview(avatarName,json){
  console.log(avatarName,json)
}
//在线预览--&开始播放
function UnityPreviewStart(avatarName){
  console.log(avatarName)
}

//在线预览--&停止播放
function UnityPreviewCancel(avatarName){
  console.log(avatarName)
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
  console.log(avatarName,json)
}
