const state = {
  resultJson: {
    "version": '1.1',
    "url": "",
    "name": "",
    "totalSize":"16:9",
    "background": {
      "url": "",
      "widget": [
        // {
        //   "id":"",
        //   "zindex": 1,
        //   "isBack": true,
        //   "url": "xxx",
        //   "margins": {
        //     "left": 0.2764084507042254,
        //     "top": 0.228125,
        //     "right": 0,
        //     "bottom": 0
        //   },
        //   "width": 0.3107394366197183,
        //   "height": 0.526056338028169
        // }
      ]
    },
    "auto": true,//加载完脚本是否立即播放
    "avatar": {
      "h5": "",
      "app": "",
      "unity": "",
      "def": {
        "zindex": 1,
        "x": 0,
        "y": 0,
        "scale": 1,
        "rotation": {
          "x": 0,
          "y": 0,
          "z": 0
        }
      },
      "id": 0
    },
    "tts": {},
    'unityMessage': {},//开放给unity客户端编辑信息
    "param": []
  },

  infoModelData:['1'],//展示位信息
  avatarChName:'',//avatar中文名
}

const getters = {
  ResultJson         :state => state.resultJson,
  InfoModelData      :state => state.infoModelData,
  AvatarChName       :state => state.avatarChName,
}

const mutations = {
  //编辑展示位信息
  set_InfoModelData(state,data) {
    state.infoModelData = data;
  },
  set_avatarName(state,data) {
    state.resultJson.avatar.unity = data.name;
    state.avatarChName = data.chName
  },
}

const actions = {

}

export default {
  state,
  actions,
  getters,
  mutations
}
