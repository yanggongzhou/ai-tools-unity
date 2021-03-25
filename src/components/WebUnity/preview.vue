<template></template>
<script>
  import {mapActions, mapGetters} from "vuex";
  import {AMSound} from "../../sound/sound";
  import jsmd5 from 'js-md5';

  export default {
    computed: {
      ...mapGetters([
        "ali_tts_token",
        "ali_token_expires",
      ])
    },
    data(){
      return{
        AMSound:'',
      }
    },
    created() {
      window.WebTTSInfo = this.WebTTSInfo; //获取JSON字符串
    },
    methods:{
      ...mapActions(["fetchSoundToken"]),
      initSound() {
        this.AMSound = new AMSound();
        let _option = {
            user_id: this.$Session.get('ai_user_id'),
            access_token : this.ali_tts_token
          },
          _isInitInacTTS = false;

        this.AMSound.init('ali', _option, _isInitInacTTS);
      },
      async getAudio(_txt) {
        console.log('getAudio: ', _txt, !this.AMSound)
        if (!this.AMSound) {
          this.initSound();
        }
        let time = new Date().getTime()
        if (!this.ali_tts_token || time > this.ali_token_expires) {
          console.log('获取阿里TTS token')
          await this.fetchSoundToken({ type: 'ali' })
          await this.AMSound.refreshToken(this.ali_tts_token);
        }

        await this.AMSound.txtToAudio({
          text: _txt,

          tts: {
            speechRate: -140, // 语速，取值范围 -500 ~ 500
            volume:50, // 音量，取值范围 0 ~ 100
            voiceName: "Aixia",
            pitchRate:0, // 语调，取值范围 -500 ~ 500
          },

          isHandleTimeline: true
        })
      },

      async WebTTSInfo(data){
        await this.getAudio(data)
        let Info = this.AMSound.TTS.audioInfo.shift();
        console.log( 'tts信息', Info)

        let _data = JSON.stringify({
          audioBuffer:new Uint8Array(Info.audio_buffer),
          timeLine:Info.currentWordsTimeArr
        })
        UnityTTSInfo(jsmd5(_data), _data)

      },
    }
  }
</script>
