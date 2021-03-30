<template>
  <div id="alitts_data">
    <div class="alitts_data" v-if="ttsValue"></div>
  </div>
</template>

<script>
  import { AMSound } from "../sound/sound";
  import {mapActions, mapGetters} from "vuex";

  export default {
    computed: {
      ...mapGetters([
        "ali_tts_token",
        "ali_token_expires",
      ])
    },
    data(){
      return{

        ttsValue:false

      }
    },
    mounted() {
      if(this.$route.query.tts_txt){
        this.getAudio(this.$route.query.tts_txt)
      }

    },
    methods:{
      ...mapActions(["fetchSoundToken"]),
      initSound() {
        this.AMSound = new AMSound();
        let _option = {
            user_id: '726',
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
        this.ttsValue = true;
        window.ttsInfo = this.AMSound.TTS.audioInfo
        window.audio_buffer = new Uint8Array().buffer;
        window.audio_buffer = this.appendBuffer(window.audio_buffer,window.ttsInfo[0].audio_buffer)
        console.log(window.audio_buffer)
      },

      appendBuffer(buffer1, buffer2) {
        var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
        tmp.set(new Uint8Array(buffer1), 0);
        tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
        return tmp.buffer;
      }
    }
  }
</script>
