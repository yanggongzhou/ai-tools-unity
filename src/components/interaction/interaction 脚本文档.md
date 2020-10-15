# 使用说明

### 参数说明

|字段|说明|可选值
|:---:|:---:|:---:|
| `defaultQASystem` | 对话系统 | `MS` - 微软多轮对话 <br> `ntalker` - 小能
| `MSActionAreaId` | 微软多轮对话 - 当前消息所属作用域 | 默认值 `default` <br> 可选值：`我是不白吃`

### 接口配置

- src/api/api.js

	```
	const createAxios = (_url) => {
	  const _instance = axios.create({
	    baseURL: _url,
	    timeout: 10000,
	    headers: {
		    'Content-Type': "application/json;charset=utf-8"
		  }
	  });
	  _instance.interceptors.response.use(prevHandler,prevErrHandler);
	  _instance.interceptors.request.use(
	    config => {
	      return config;
	    },
	    err => {
	      return Promise.reject(err);
	    }
	  ); 
	  return _instance;
	}
	
	const adtestInstance = createAxios('https://adtest.magics-ad.com');
	
	const QA_xiaoneng = createAxios('https://live.ntalker.com');
	
	export const chatInterface={
	  getChat(data) {
	    return adtestInstance.post('/autoSay/client/DKAutoSay_GetTask', data)
	  },
	  getQARes(data) {
	    return QA_xiaoneng.post('/live/qa', data)
	  }
	}
	```
	
### 调用
	```
	import interaction from './mixins/interaction'
	export default {
		mixins: [ interaction ],
		mounted() {
			// 请求获取弹幕消息接口
			this.getChat()
		},
		methods: {
			// 接收弹幕消息
			handleInteractionTxt(_type, _txt) {
				// _type  类型：EnterRoom 进入直播间，Chat 聊天信息
				// _txt   接收到对应的消息内容
		            console.log('接收的内容：', _type, _txt) 
		      },
		}
	}
	```


