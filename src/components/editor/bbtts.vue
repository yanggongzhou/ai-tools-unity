<script>
  import axios from 'axios'
export default {
  methods: {
    getLongTxt(_txt,bb_access_token) {
      let _this = this;

      axios({
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'post',
        url: 'https://openapi.data-baker.com/asynctts/synthesis/work',
        data: {
          'access_token': bb_access_token,
          'audiotype': '3',
          'notifyUrl': 'https://adtest.magics-ad.com/date_baker/client/putAudioUrl',
          'speed': '5',
          'text': _txt,
          'voiceName': '标准合成_甜美女声_楠楠',
          'volume': '5',
          'interval': 1
        }
      }).then(res => {
        console.log(`请求标贝长文本接口：`, res)

        if(res.status == 200 && res.data.code == 0) {
          _this.addMagicsAudios(_txt, res.data.data.workId);
        }

      })
    },
    addMagicsAudios(_txt, _workid) {
      axios({
        method: 'post',
        url: 'https://adtest.magics-ad.com/date_baker/client/add_audio',
        data: {
          user_id: 300,
          access_token: this.access_token,
          content: _txt,
          workId: _workid
        }
      }).then(res => {
        console.log(`请求迈吉客添加音频接口：`, res)
        if(res.data.return_code == 1000) {
          this.getMagicsAudios(_workid)
        }
      })

    },
    getMagicsAudios(_workid) {
      axios({
        method: 'post',
        url: 'https://adtest.magics-ad.com/date_baker/client/get_audio',
        data: {
          user_id: 300,
          access_token: this.access_token,
          workId: _workid
        }
      }).then(res => {
        console.log(`请求迈吉客获取音频接口：`, res, res.data.result.audio.audio_url)
        if(res.data.result.audio.status==null || res.data.result.audio.status==0) {
          let _this = this;
          let timeout = setTimeout(function() {
            _this.getMagicsAudios(_workid)
            clearTimeout(timeout)
          }, 2000)
        }
      })
    }
  }
}
</script>
