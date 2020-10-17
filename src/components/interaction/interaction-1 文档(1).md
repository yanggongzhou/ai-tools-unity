## interaction-1

⚠️ 只有 `isInnerJsonInteraction` 属性在 preview-multiple.vue 文件里声明，其他属性均在 interaction-1.vue 组件里定义。

### 请求话术接口

```
// src/api/api.js
export const requestServices = {
	// 获取话术列表
  	getWords: (params)=>apiInstance.post(`/guide_shopping/client/get_words`,params),
}
```

### 互动组件引入

```
  import interaction from '../interaction/interaction-1';
  export default{
  	mixins: [interaction],
  }
```

### 处理脚本组件
- 获取脚本内容时，同时请求 话术
	-  `await this.getAllWords();`

- 播放开场语
	- `this.playWelcomeWords();`

- 触发脚本内互动，需要处理（Unity-WEB 在接收到脚本内互动回调时进行该处理）：

		```
		this.isInnerJsonInteraction = true; // 将是否为脚本内互动设为 true
		this.openInnerJsonInac(); // 开启脚本内互动模式
		```

- 在Unity 语音结束回调里，判断当前的状态：播放脚本、脚本内互动、脚本外互动、当前脚本结束播放下一个脚本。

	- 在组件data里声明是否是脚本内互动： `isInnerJsonInteraction: false,`
	- 触发脚本内互动，在语音播放结束回调里，需要处理

		```
		// isOpenInteractiveMode - 是否打开了互动模式
		// isEnterInteraction - 是否进入了互动模式
		// interactionModeIsEnd - 互动模式是否结束
		// isInnerJsonInteraction - 是否是脚本内互动
		if((this.isOpenInteractiveMode || this.isEnterInteraction) && !this.interactionModeIsEnd && this.isInnerJsonInteraction) {
          	    // 互动模式处理
          	    this.magics.stopAction();
		     this.handleInacLogic(); // 已经开启脚本内互动模式，正常处理互动流程

		 }else {
		     // 继续播放脚本
		 }
		```
	- 触发脚本外互动，在语音播放结束回调里，需要处理：

		```
		// isOpenInteractiveMode - 是否打开了互动模式
		// isEnterInteraction - 是否进入了互动模式
		// interactionModeIsEnd - 互动模式是否结束
		// isPlayingEndWords - 是否正在播放衔接语
		if((this.isOpenInteractiveMode || this.isEnterInteraction) && !this.interactionModeIsEnd) {
              // 打开互动模式，互动模式处理
              this.magics.stopAction();
              this.handleInacLogic(); // 如果未开启脚本外互动则开启，如果已开启则进行互动流程
            }else if(!this.isOpenInteractiveMode && this.isOpenSceneEnd && !this.isPlayingEndWords) {
              // 关闭互动模式，场景话术的衔接语为开启状态
              this.playSceneEndWords();
            }else {
            		// 先去播放下一个
            		this.interactionModeIsEnd = false;
            }
		```


- 处理互动、场景话术的文本播放

	```
	// _type - 当前文本来源：脚本 / 互动
	// _txt - 当前文本内容
	// _isHandleTimeline - 是否需要时间戳 （Unity-WEB 可以忽略该字段）
	async getAudio(_type, _txt, _isHandleTimeline) {
        switch(_type) {
          case 'json': // 脚本   （Unity-WEB 可以忽略）
             break;
          case 'interaction': // 互动
            	// 进行文字转语音及播放处理
            break;
        }
      },
	```
