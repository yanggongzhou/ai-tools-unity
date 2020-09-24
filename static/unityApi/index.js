// 本地注册函数

//请求用户信息
function UnityUserInfo() {
  console.log('用户信息')
}


//在线预览--单个预览
function UnityPreview(avatarName,json){
  console.log(avatarName,json)
}

//触发模型动作
function UnityAvatarAction(avatarName,actionName){
  console.log('动作',avatarName,actionName)
}

//选择角色
function UnityChangeAvatar(val) {
  console.log('角色',val)
}

