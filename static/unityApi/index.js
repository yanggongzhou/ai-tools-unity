// 本地注册函数

//请求用户信息
function UnityUserInfo() {
  console.log('\x1b[33m%s\x1b[0m','用户信息')
}


//在线预览--&播放 ---bool 是否是预览来处理是否需要互动，bool2是否需要本地存储
function UnityPreview(avatarName,json,bool,bool2){
  console.log('\x1b[33m%s\x1b[0m',`在线预览- ${avatarName}`,json,bool,bool2)
}
//在线预览--&开始播放
function UnityPreviewStart(avatarName){
  console.log('\x1b[33m%s\x1b[0m',`开始播放- ${avatarName}`)
}

//在线预览--&停止播放
function UnityPreviewCancel(){
  console.log('\x1b[33m%s\x1b[0m',`停止播放`)
}



//触发模型动作
function UnityAvatarAction(avatarName,actionName){
  console.log('\x1b[33m%s\x1b[0m',`触发动作- ${avatarName} : ${actionName}`)
}

//选择角色
function UnityChangeAvatar(val) {
  console.log('\x1b[33m%s\x1b[0m',`请求切换角色- ${val}`)
}

//要动作
function UnityAvatarMotionInfo(val) {
  console.log('\x1b[33m%s\x1b[0m',`请求角色动作- ${val}`)
  WebActionInfo('测试动作,-a,')
}

//播放临时话术
function UnityPreviewTxt(avatarName,json) {
  console.log('\x1b[33m%s\x1b[0m',`播放临时话术- ${avatarName}`,json)
}

//unity继续播放
function UnityPreviewContinue(avatarName) {
  console.log('\x1b[33m%s\x1b[0m',`unity继续播放- ${avatarName}`)
}

//unity互动播放结束
function UnityInteractionEnd(avatarName) {
  console.log('\x1b[33m%s\x1b[0m',`unity互动播放结束- ${avatarName}`)
}

//unity互动播放开始
function UnityInteractionStart(avatarName) {
  console.log('\x1b[33m%s\x1b[0m',`unity互动播放开始- ${avatarName}`)
}

//unity互动状态
function UnityInteractionStateChange(state) {
  console.log('\x1b[33m%s\x1b[0m',`unity互动状态- ${state}`)
}

//unity自动直播中插入互动对话--该功能会直接进入互动模式
function UnityTemporaryInteractionStart() {
  console.log('\x1b[33m%s\x1b[0m',`unity自动直播中插入互动对话`)
}

//web端环境准备完毕
function UnityNativeReady() {
  console.log('\x1b[33m%s\x1b[0m',`**web端环境准备完毕**`)
}

//路由跳转
function UnityRoute(param) {
  console.log('\x1b[44m%s\x1b[0m',`路由跳转-${param}`)
  WebRoute(param)
}

//步骤
function UnityStepChange(param) {
  console.log('\x1b[36m%s\x1b[0m',`步骤-${param}`)
}

//保存脚本信息（unity必要信息)
function UnityJsonInfo(param) {
  console.log('\x1b[33m%s\x1b[0m',`获取unityMessage信息-${param}`)
  WebJsonInfo('{}')
}


// for (let i=0;i<200;i++){
//   console.log(`\x1b[${i}m%s\x1b[0m`,`步骤-${i}`)
// }
