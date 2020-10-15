<script>
import axios from 'axios'
import { chatInterface } from "@/api/api";
import md5 from 'js-md5';
let Base64 = require('js-base64').Base64

export default {
    data() {
        return {
            MSBotAgentID: '941aa0cb-b84b-4a20-964a-da0ebf7146fa',
            MSBotSessionId: '',
            MSActionAreaId: '我是不白吃', // 默认值为 default ，可选： "我是不白吃"
            tb_roomid: '123456789',
            ws_data: [],
            ws_idx: 0,
            getChatTimeout: 3000,
            defaultQASystem: 'MS', // MS - 微软  ntalker - 小能

          ChatTimeout:'',//避免一直无弹幕时一直循环叠加
        }
    },
    methods: {
        cleanChat(){
          clearTimeout(this.ChatTimeout)
        },
        getChat() {
            let _time = this.getTime();
            let _md5 = md5('AIAssistant' + _time + 'QSS');
            let _data = new FormData();
            _data.append('Time', _time);
            _data.append('MD5', _md5);
            _data.append('channel_id', this.tb_roomid);

            chatInterface.getChat(_data).then(res => {
                // console.log('getChat: ', res)
                // res.return_code          1：成功，0：没有数据，<0：出现错误
                // res.numer                返回信息条数
                // res[0].publish_time      时间
                // res[0].msg_sender        发送者用户名 base64编码
                // res[0].msg_text          聊天信息 base64编码
                // res[0].vip_level         vip等级
                // res[0].type              EnterRoom 进入房间  Chat 聊天信息
                if(res.return_code==1 && res.number>0) {
                    // for(let i=0; i<res.number; i++) {
                        let _rms = Base64.decode(res[0].msg_sender),
                            _rmt = Base64.decode(res[0].msg_text),
                            ms, mt;
                        switch(res[0].type) {
                            case 'EnterRoom':
                                let response = `欢迎${_rms}来到直播间。`;
                                this.handleInteractionTxt('EnterRoom', response)
                                break;
                            case 'Chat':
                                if(_rms=='[userlevel]') {
                                    ms = _rmt.substr(0, _rmt.indexOf(' '));
                                    mt = _rmt.substr( _rmt.indexOf(' ')+1);
                                }else {
                                    ms = _rms;
                                    mt = _rmt;
                                }
                                this.handleChatMsg(ms, mt);
                                break;
                        }
                        console.log('用户名称',_rms)
                        console.log('接收消息',_rmt)
                    // }
                }else {
                    let _this = this;
                    this.ChatTimeout = setTimeout(function() {
                        _this.getChat();
                        clearTimeout(_this.ChatTimeout)
                    }, this.getChatTimeout)
                }
            })
        },
        handleChatMsg(_name, _txt) {
            switch(this.defaultQASystem) {
                case 'MS':
                    this.getMSBot(_txt);
                    break;
                case 'ntalker':
                    this.getQARes(_name, _txt);
                    break;
            }
        },

        getQARes(_name, _txt) {
            let _data = {
                event: 'chatmessage',
                who: _name,
                message: _txt
            }
            chatInterface.getQARes(_data).then(res => {
                if(res.code == 200) {
                    this.handleInteractionTxt('Chat', res.data)
                }
            })
        },

        getMSBot(_text) {
            // console.log('getMSBot')
            let _data = {
                "sessionId": this.MSBotSessionId,
                "actionAreaId": this.MSActionAreaId,
                "channelId": "default",
                "input": {
                    "query": {
                        "queryText": _text
                    }
                }
            };
            axios({
                data: _data,
                method:"post",
                url: 'https://deportal.mmais.com.cn/api/'+this.MSBotAgentID+'/Dialog',
            }).then(res => {
                if(res.status == 200) {
                    this.MSBotSessionId = res.data.sessionId;
                    let resText = JSON.parse(res.data.queryResult.responseText[0].content);
                    // if(resText.Text != '') {
                    if(resText.Text) {
                        // _msg.msg  // 接收到
                        // console.log('🌈🌈🌈 知识库返回：', resText.Text)
                        this.handleInteractionTxt('Chat', resText.Text)
                    }else{
                      this.handleInteractionTxt('Chat', '您的问题我在学习中～')
                    }
                }

            })
        },

        getTime() {
            let t = new Date();
            let y = t.getFullYear(),
                m = t.getMonth()+1,
                d = t.getDate(),
                h = t.getHours(),
                min = t.getMinutes(),
                s = t.getSeconds(),
                _t = `${y}-${m}-${d} ${h}:${min}:${s}`;
            return _t;
        }
    }
}
</script>
