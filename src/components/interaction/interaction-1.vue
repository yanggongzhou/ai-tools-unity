<template></template>
<script>
// import axios from 'axios'
import md5 from 'js-md5';
import timer from "../../api/timer";
import { requestServices } from '../../api/api';

export default {
    data() {
        return {
            // 互动模式所在位置 1 - 脚本内 2 - 脚本间，结束时，采用 场景话术模式的衔接语话术
            type: 1,
            // 场景话术模式 - 开场语话术
            sceneWelcomeWords: [
                '大家好，欢迎大家来到我的直播间！',
                '宝宝们，我来了，很高兴又和大家见面了'
            ],
            // 互动模式 - 引导语话术
            inacGuideWords:[
                '有什么想了解的，现在可以直接提问噢。',
                '现在是提问时间，欢迎大家不懂就问噢。',
                '在介绍下一款产品前，大家有什么问题可以现在问我噢。',
                '下面咱们休息一下,可以向我提问哦。',
                '大家有问题可以向我提问哦。',
                '大家有什么不懂的，现在可以问我噢。',
                '现在是提问时间，请大家踊跃发言。',
                '对于刚才介绍的商品，大家有什么问题现在可以提问噢。',
                '有没有问题需要我解答的，现在就可以提问噢。',
            ],
            // 互动模式 - 通用话术
            inacCommonWords: [
                '宝宝们没事多点点关注，支持一下主播，这样以后直播就会有提示噢。',
                '非常感谢大家的支持噢，我也会经常直播，给大家带来更多的好商品，更实惠的价格。',
                '谢谢大家的支持噢，我一定会好好加油，服务好直播间的宝宝们。',
                '我是不是很可爱很讨人喜欢啊，我就是这么强大，赶紧关注我吧。',
                '大家可以看看左下角购物车里的宝贝噢，都是主播精心挑选的，点看讲解可以看到视频讲解噢。',
                '大家可多看我的直播，最新商品，最新优惠的最新消息，直播里都会有啊。',
                '对我刚才介绍的宝贝有兴趣的宝宝，可以进入左下角的购物车挑选心仪的宝贝啊，喜欢就加入购物车。',
                '亲们不用刷礼物，多给主播点赞，点亮小红心，点赞数上去了平台会有奖励给主播噢。',
                '刚来的小伙伴关注一下主播噢，关注主播好处多多，以后发红包抢到的几率都会变大。',
                '点击左下方红色购物车，就可以看到想买的宝贝，点击即可购买，很多优惠只有直播时候有啊。',
                '名字上方有一个红色关注噢，点击关注主播，以后开直播就容易看到了，以免找不到。',
                '喜欢主播的给我点一下关注，主播这么辛苦，大家一定要多多支持噢，',
                '请直播间的好朋友们双击屏幕，给主播点亮小红心噢，如果你喜欢主播，就多帮我点赞，不要吝惜噢。',
                '点击主播名字后面的加号关注主播噢，这样以后就能时常看我直播啦，我开直播您也会收到提示。',
                '谢谢关注主播，请大家帮我多点点小红心噢，小红心越多我越开心，哈哈哈。',
                '大家多帮我点点赞啊，发挥大家的热情，努力帮我双击屏幕，多点赞。',
                '不要吝惜你们的赞，多给主播点点小红心啊，在这里谢谢大家了，一定要给我多点点赞。',
            ],
            // 互动模式 - 进入直播间话术
            inacEnterWords: [
                '欢迎刚进入直播间的小伙伴',
                '欢迎刚进入直播间的好朋友',
                '欢迎宝宝进入直播间',
                '欢迎小哥哥进入直播间',
                '欢迎小姐姐进入直播间',
                '欢迎女神进入直播间',
            ],
            // 互动模式 - 回答问题话术
            inacQaWords: [
                '刚有宝宝问道',
                '刚有人问道',
                '刚有朋友问道',
                '刚才有个问题问道',
                '之前有人问',
                '有个问题说',
            ],
            // 互动模式 - 结束衔接语话术
            inacEndWords: [
                '那我们继续介绍产品咯。',
                '问题先回答到这里，咱们接着往下说。',
                '我们先接着介绍，一会再继续回答大家的问题。',
                '我先接着往下说了，要不然说不完喽。',
                '咱们先往下说，介绍完再统一回答大家的问题。',
                '问题回答的差不多了，继续往下讲喽。',
                '那我赶紧往下讲了，要不然没法下班了，',
                '问题回答完毕，我接着往下介绍了。',
                '有小伙伴已经着急了，我们接着往下介绍了。',
            ],
            // 场景话术模式 - 衔接语话术
            sceneEndWords: [
                '需要的宝宝们赶紧下单哦，下面为大家介绍下一个商品了！',
                '宝宝们注意喽，接下来要为大家介绍的这款商品，也是非常不错的！'
            ],
            // 弹幕消息 - 问答 & 进入直播间
            chatMsgs: [],
            chatMsgsIdx: 0, // 当前播放弹幕下标

            isEnterInteraction: false, // 当前是否正在互动模式中，防止关闭互动按钮导致当前互动结束
            interactionModeIsEnd: false, // 标记本轮互动模式是否结束
            isGetChatsLoop: false, // 是否循环抓取弹幕
            isOpenSceneWelcome: false, // 是否开启了开场语
            isOpenSceneEnd: false, // 是否开启了场景话术的衔接语
            // 互动模式 最大循环次数
            // 互动循环 - 引导语 (弹幕) - 通用话术 (弹幕)
            //            /\                \/
            //             | _______________ |
            inacLoop: 2,
            currentStep: 1, // 当前循环的步骤，1、引导语，2、通用话术
            isPlayingWords: false, // 是否正在播放引导语、衔接语
            isPlayingEndWords: false, // 是否正在播放互动模式结束后的衔接语
            isPlayingChats: false, // 是否正在播放弹幕
            maxChatCount: 5, // 最大弹幕消息数
        }
    },
    methods: {
        // 获取场景话术
        async getAllWords() {
            await requestServices.getWords({
                user_id:this.$Session.get('ai_user_id'),
                role_id: 21,
                access_token:this.$Session.get('ai_user_token'),
                type: '1,2,4,5,6,7,8'
            }).then(res => {
                console.log('getWords: ', res);
                if(res.return_code==1000) {
                    // 需要进行 场景话术的 欢迎语、衔接语的 开关处理，通过对应数组长度判断是否需要播放场景话术
                    // 场景话术 - 开场语
                    if(res.result.words[1].length>0) {
                        this.addWords(res.result.words[1], this.sceneWelcomeWords);
                    }
                    // 场景话术 - 衔接语话术
                    if(res.result.words[2].length>0) {
                        this.addWords(res.result.words[2], this.sceneEndWords);
                    }
                    // 互动模式 - 引导语话术
                    if(res.result.words[4].length>0) {
                        this.addWords(res.result.words[4], this.inacGuideWords);
                    }
                    // 互动模式 - 通用话术
                    if(res.result.words[5].length>0) {
                        this.addWords(res.result.words[5], this.inacCommonWords);
                    }
                    // 互动模式 - 进入直播间话术
                    if(res.result.words[6].length>0) {
                        this.addWords(res.result.words[6], this.inacEnterWords);
                    }
                    // 互动模式 - 回答问题话术
                    if(res.result.words[7].length>0) {
                        this.addWords(res.result.words[7], this.inacQaWords);
                    }
                    // 互动模式 - 结束衔接语话术
                    if(res.result.words[8].length>0) {
                        this.addWords(res.result.words[8], this.inacEndWords);
                    }
                    if(this.sceneWelcomeWords.length>0) {
                        this.isOpenSceneWelcome = true;
                    }
                    if(this.sceneEndWords.length>0) {
                        this.isOpenSceneEnd = true;
                    }
                }
            })
        },
        addWords(_arr, _target) {
            _target = [];
            _arr.forEach(item => {
                _target.push(item.content);
            })
        },
        openInnerJsonInac() {
            this.playWords(1);
        },
        handleInacLogic() {
            if(this.isPlayingEndWords) {
                this.exitInacMode();
                return;
            }
            if(!this.isPlayingWords && !this.isPlayingChats) {
                this.playWords(2);
            }else {
                this.isPlayingWords = false;
                this.enterChat();
            }
        },
        playWelcomeWords() {
            this.getAudio('interaction', this.getRandomWords(this.sceneWelcomeWords), false);
        },
        playSceneEndWords() {
            this.isPlayingEndWords = true;
            this.getAudio('interaction', this.getRandomWords(this.sceneEndWords), false);
        },
        playInacEndWords() {
            this.isPlayingEndWords = true;
            this.isGetChatsLoop = false;
            if(this.type == 1) { // 脚本内
                this.getAudio('interaction', this.getRandomWords(this.inacEndWords), false);
            }else if(this.type == 2 && this.isOpenSceneEnd) { // 脚本外
                this.getAudio('interaction', this.getRandomWords(this.sceneEndWords), false);
            }else { // 脚本外，无衔接语
                this.exitInacMode();
            }
        },
        playWords(_type) {
            this.type = _type ? _type : this.type;
            if(this.inacLoop == 2) {
                this.isEnterInteraction = true;
                console.log('❗️❗️❗️ 进入互动模式')
            }
            else if(this.inacLoop==0 && this.currentStep==1) {
                console.log('❗️❗️❗️ 互动模式结束')
                this.playInacEndWords();
                return;
            }
            console.log('🌟循环：', this.inacLoop)
            let _txt;
            this.isPlayingWords = true;
            switch(this.currentStep) {
                case 1: // guide
                    console.log('🌟引导语')
                    this.inacLoop--;
                    this.currentStep = 2;
                    _txt = this.getRandomWords(this.inacGuideWords);
                    break;
                case 2: // common
                    console.log('🌟通用话术')
                    this.currentStep = 1;
                    _txt = this.getRandomWords(this.inacCommonWords);
                    break;
            }
            this.getAudio('interaction', _txt, false);
            this.getChat();
        },
        exitInacMode() {
            this.inacLoop = 2;
            this.currentStep = 1;
            this.isEnterInteraction = false;
            this.interactionModeIsEnd = true;
            this.isPlayingEndWords = false;
            this.handleInacEnd();
        },
        enterChat() { // 文本1播放结束，进入 欢迎语&问答环节
            console.log('是否有弹幕消息: ', this.chatMsgs.length)
            if(this.chatMsgs.length>0) {
                if(this.chatMsgsIdx == this.chatMsgs.length) {
                    this.chatMsgs = [];
                    this.chatMsgsIdx = 0;
                    this.isPlayingChats = false;
                    this.playWords();
                    return;
                }
                this.isPlayingChats = true;
                this.getAudio('interaction',this.chatMsgs[this.chatMsgsIdx].response, false);
                this.chatMsgsIdx++;
            }else {
                this.playWords();
            }
        },
        getChatsLoop(_time, _log) {
            console.log('getChatsLoop:', _log, this.isGetChatsLoop && this.isEnterInteraction && !this.isPlayingEndWords)
            if(this.isGetChatsLoop && this.isEnterInteraction && !this.isPlayingEndWords) {
                timer.setTimeout(() => {
                    this.getChat();
                    timer.delete(['1sloop']);
                }, _time, '1sloop')
            }
        },
        getChat() {
            let _time = this.getTime();
            let _md5 = md5('AIAssistant' + _time + 'QSS');
            let _data = new FormData();
            _data.append('Time', _time);
            _data.append('MD5', _md5);
            _data.append('channel_id', this.$Session.get('ai_user_phone')); // '13520933637'
            requestServices.getChat(_data).then(res => {
                console.log('获取弹幕：', res)
                if(res.return_code==1000) { // 返回 欢迎语&问答
                    let _isEnterRoom = false;
                    if(this.chatMsgs.length>0 && this.chatMsgs[this.chatMsgs.length-1].type==2) {
                        _isEnterRoom = true;
                    }
                    res.result.gs_message.forEach((item, idx) => {
                        switch(item.type) {
                            case 1:     // 问答
                                item.response = this.getRandomWords(this.inacQaWords) + item.message + item.response;
                                this.chatMsgs.push(item);
                                _isEnterRoom = false;
                                break;
                            case 2:     // 欢迎语
                                if(!_isEnterRoom) {
                                    item.response = this.getRandomWords(this.inacEnterWords);
                                    this.chatMsgs.push(item);
                                    _isEnterRoom = true;
                                }
                                break;
                        }
                    })
                    console.log('弹幕整理：', this.chatMsgs)

                    this.goonGetChat();
                }else if(res.return_code==0) { // 当前没有任务
                    this.goonGetChat();
                }
            })
        },
        goonGetChat() {
            if(this.chatMsgs.length < this.maxChatCount) {
                this.isGetChatsLoop = true;
                this.getChatsLoop(1000, '继续1');
            }else {
                this.isGetChatsLoop = false;
            }
        },

        getRandomWords(_arr) {
            let _random = Math.floor(Math.random()*_arr.length);
            return _arr[_random];
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
        },

        resetIacParams() {
            this.chatMsgs = []
            this.chatMsgsIdx = 0

            this.isEnterInteraction = false
            this.interactionModeIsEnd = false
            this.isGetChatsLoop = false
            this.inacLoop = 2
            this.currentStep = 1
            this.isPlayingWords = false
            this.isPlayingEndWords = false
            this.isPlayingChats = false
        }
    }
}




</script>
