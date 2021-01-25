**OLD Web & Unity API**

**1.用户信息**
WebUserMessage(id,token,phone)

**2.网络连接断开/链接**
WebErrorMessage(param)       参数‘True’（断开）/ ‘False’（链接）

**3.切换角色**
WebSelectAvatarState(param)  参数‘True’（切换角色成功）/ ‘False’（切换角色失败）
UnityChangeAvatar(AvatarName)

**4.加载资源**
WebPreviewReady(param)       参数‘True’（加载资源成功）/ ‘False’（加载资源失败）

**强制结束播放状态**
UnityPreviewCancel()跳转页面后强制结束播放状态




######
**NEW1.19**

**路由跳转**
UnityNativeReady()           web端环境准备完毕
WebRoute(route)              参数'myscript'--我的剧本  'tools'--创建剧本  'webcast'--开始直播

**展示位**
WebInfoModelMsg(param)       web接收展示位信息 参数param -- 展示位['1'，'2'，'3']

**选择 角色模型**
WebEditAvatar(param,chParam) 参数 param为角色名 "xiaosajie" ，chParam为中文名 必要-预览时候需要发送角色名

**保存脚本信息（unity必要信息）**
UnityJsonInfo(param)         web请求必要的JSON信息
WebJsonInfo(param)           param -- '{}' 为pc端自定义属性值对应json内属性unityMessage（背景/角色位置大小角度/等）

**info标签插入 图片/视频/文字**
UnityInsertTag(param)        param -- {id:'',url:'xxx',region:'2'，type:'image'} video--{id:'',url:'xxx',region:'2'，isSupport:'false',type:'video'}  text--{id:'',text:'xxx',region:'2',ellipsize: false,gravity: "center",textColor: "#bb0c0c",textSize: "20",type:'text'}
WebInsertTag(param)          param -- 返回插入图片成功与否信息 'True' 'False'

**info标签修改**
UnityEditTag(param)          param -- {id:'',url:'xxx',region:'2'，type:'image'} video--同image  text--{id:'',text:'xxx',region:'2',ellipsize: false,gravity: "center",textColor: "#bb0c0c",textSize: "20",type:'text'}
WebEditTag(param)            param -- 返回插入图片成功与否信息 'True' 'False'

**info标签删除**
UnityDelTag(param)           param -- 标签对应的展示位 '1'  //用于标签清空
WebDelTag(param)             param -- 返回插入图片成功与否信息 'True' 'False'

