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

**开始播放**
UnityPreviewStart(param)     参数 param为角色名 "xiaosajie"

**播放完毕（本段content）**
WebPreviewEnd()

**互动模式开启**
UnityInteractionStateChange(param);  参数‘True’开启/ ‘False’关闭
WebInteractionStateChange(param);  参数‘True’开启成功/ ‘False’关闭成功

**互动模式(被动)进入(自动直播标签进入)**
WebInteractionStart()         开始
WebInteractionEnd()           结束

**互动模式(主动)进入(临时会话插入/脚本间插入)**
UnityInteractionStart(param)  参数 param为角色名 "xiaosajie"
UnityInteractionEnd(param)    参数 param为角色名 "xiaosajie"

**继续播放 （临时进入互动模式结束后的继续播放剩余content）**
UnityPreviewContinue(param)   参数 param为角色名 "xiaosajie"

**强制结束播放状态**
UnityPreviewCancel()          跳转页面后强制结束播放状态

WebAckStopPlaySystem()        强制中断接收,定义为unity异常中断恢复时发送给web端

**接受ASR命令**
WebASRIdentifyContent(str)    参数Asr转换的文字，用于语音指定某一剧本播放



######
**NEW1.19**

**路由跳转**
UnityNativeReady()           web端环境准备完毕
UnityRoute(route)            参数'myscript'--我的剧本 'webcast'--开始直播 'step'--创建编辑剧本步骤页 'tools'- 文本域 'direct'--直播页
WebRoute(route)              参数'myscript'--我的剧本 'webcast'--开始直播 'step'--创建编辑剧本步骤页 'tools'- 文本域 'direct'--直播页

**步骤**
UnityStepChange(param)       web点击步骤条 参数 '1'，'2'，'3'，'4'
WebStepChange(param)         unity点击步骤条 参数 '1'，'2'，'3'，'4'

**展示位**
WebInfoModelMsg(param)       web接收展示位信息 参数param -- 展示位['1'，'2'，'3']

**选择 角色模型**
WebEditAvatar(param,chParam) 参数 param为角色名 "xiaosajie" ，chParam为中文名 必要-预览时候需要发送角色名

**保存脚本信息（unity必要信息）**
UnityJsonInfo(param)         web请求必要的JSON信息
WebJsonInfo(param)           param -- '{}' 为pc端自定义属性值对应json内属性unityMessage（背景/角色位置大小角度/等）

**info标签插入 图片/视频/文字**
UnityInsertTag(param)        param -- {id:'',url:'xxx',region:'2'，type:'image'} video--{id:'',url:'xxx',region:'2'，isSupport:'false',type:'video'}  text--{id:'',text:'xxx',region:'2',ellipsize: false,gravity: "center",textColor: "#bb0c0c",textSize: "20",type:'text'}

**info标签修改**
UnityEditTag(param，'True')  param -- {id:'',url:'xxx',region:'2'，type:'image'} video--同image  text--{id:'',text:'xxx',region:'2',ellipsize: false,gravity: "center",textColor: "#bb0c0c",textSize: "20",type:'text'}  'True'为确认时，'False'为点击时

**info标签删除**
UnityDelTag(param)           param -- 标签对应的展示位 '1'  //用于标签清空

**告知Unity直播状态**
UnityDirectState(param)      param -- 'True':开始直播 'False'：结束直播

**获取spine列表信息**
UnityEffectInfo();
**spine列表信息接受**
WebEffectInfo('')

**触发英文名对应得spine特效**
UnityEffectPlay('en_name');
