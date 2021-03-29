const common = {
  top_title:'剧本列表',
  top_title_edit:'剧本编辑',
  top_title_play:'直播剧本',
  back:'返回',
  search:'查询',
  check: '查看',
  edit:'编辑',
  delete:'删除',
  preview:'预览',
  handle:'操作',
  cancel:'取 消',
  confirm:'确 定',
  tableListFail:'获取列表失败！',
  dataFail:'剧本数据获取异常，请重试',
  save:'保存',
  saveAs:'另存',
  saveSuccess:'保存成功',
  add:'添加',
  addSuccess:'添加成功',
  addFail:'添加失败',
  editSuccess:'修改成功',
  editFail:'修改失败',



  changeAvatarFailMsg:'切换角色失败，请重试',
  resourceLoadingMsg:'资源加载中，请稍后...',
  resourceLoadingFailMsg:'加载资源失败，请重试',
  resourceLoadingFailMsg2:'加载资源失败',
}
const app = {
  previewTip:'单击屏幕取消播放',
  myscript:'我的剧本',
  goLive: '开始直播',
  devTip:'这是测试版本！'
}
const myscript = {
  createScript:'创建剧本',
  goLive:"去直播",
  updateTime:'更新时间',
  title:'剧本名称',
  paragraph:'剧本段数',
  ip:'IP形象',
  tableNull:'暂无剧本',

  popconfirm_title:'确认删除本条数据',
  script:'剧本',

}
const step = {
  title:'创建和编辑剧本',
  step1:'选择脚本使用的直播间背景',
  step2:'选择脚本使用的角色模型',
  step3:'选择脚本使用的展示位的数量、大小和位置',
  step4:'在右侧剧本编辑窗口编辑剧本',
}
const tools = {
  titleErrTip:'请输入有效剧本名称',
  isValidTextMsg:'请确认各段落是否含有有效文本',
  isValidTextMsg2:'请确认当前段落含有有效文字！',

  action_title:'动作标签',
  action_title_tip_t:'插入动作',
  action_title_tip_c:`注意文本中紧邻的 <br/> 动作标签只会执行最后一个哦!`,

  delete_paragraph_tip:'是否删除段落：',
  alreadyTop:'已至最高层',
  alreadyBottom:'已至最底层',

  img:'图片',
  video:'视频',
  text:'文字',
  interval:'间隔',
  interaction:'互动',

  infoModel_tip:'请先添加展示位',
  textForm_tip:'请输入文字',
  upload_tip1:'请先上传文件',
  upload_tip2:'请确认呈现时间',

  upload_img:'上传图片',
  upload_video:'上传视频',
  upload_img_tip:'*支持jpg、png、gif格式，最大不超过5M',
  upload_video_tip:'*支持MP4格式，最大不超过200M',

  upload_img_msg1:'上传图片只能是 JPG/PNG/GIF 格式!',
  upload_img_msg2:'上传图片大小不能超过 5MB!',
  upload_video_msg1:'上传视频只能是 mp4 格式!',
  upload_video_msg2: '上传视频大小不能超过 200MB!',

  img_tag:'插入图片',
  video_tag:'插入视频',
  text_tag:'插入文字',
  interval_tag:'添加间隔',
  interaction_tag:'插入互动',
  interaction_tag_tip_t:'互动标签',
  interaction_tag_tip_c:'注意文本中不要离得太近哦!',
  clean_tag:'清空标签',
  clean_tag_tip:'确认清空所有标签？',

}

const webcast = {
  scriptSetting:'剧本设置',
  sceneWords:'场景话术',
  add:'添加剧本',
  playSetting:'播放设置',

  goodsId:'商品号',
  widget:'播放权重',
  remove:'移除',
  selectAll:'全选',

  goodsIdMsg1:'商品号不能为空',
  goodsIdMsg2:'已添加过该商品号噢',
  widgetMsg:'权重越高，随机播放时，被重复播放几率越大！',

  addPlayScriptTip:'请添加播放剧本~',
  cleanList:'清空列表',

  interactionRoundsSetting_t:'互动模式轮数设置',
  interactionRoundsSetting_c:'互动模式轮数:每次进入互动模式后与观众互',
  defaultAllDay:'默认全天',
  rounds:'轮',
  timeSetting:'分时段设置(未设置的时段，默认2轮)',

  emergencyContact:'紧急联系人',
  phone:'手机号',
  phone_tip:"紧急联系人手机号，用于接收直播中断等异常情况的短信通知！默认注册手机号，可修改。",
  timeSelect:'时间选择',

  wordList_tip:'最多创建10条，开启多个话术时，随机播放一个',

  textArea_placeholder:'最多可输入40个字',
  deleteWords_tip:'是否删除话术？',

  selectState:'状态切换',
  textArea_placeholder2:'输入话术文字',

  tabs1: [
    {
      label: '互动模式'
    },
    {
      label: '紧急联系人'
    },
  ],

  tips2: {
    welcome: '设置直播开播的开场语话术',
    endwords: '设置不同剧本间切换时的衔接话术'
  },
}

const direct = {
  progress_tip1:"总剧本",
  progress_tip2:"缓存进度",
  progress_tip3:"取消缓存",

  randomPlay:'随机播放',
  randomPlay_tip1:'1、开启后，自动直播中剧本随机播放',
  randomPlay_tip2:'2、依据剧本权重，权重越高，重复播放概率越大。',
  randomPlay_tip3:'3、建议多个剧本（>4）时再开启随机播放',

  interactionModel:'互动模式',
  interactionModel_tip1:'1、开启后，虚拟主播可以与消费者互动，在互动时间时回答用户提问、欢迎用户进入直播间',
  interactionModel_tip2:'2、目前虚拟主播互动时间在每个剧本结束后及剧本中有互动标签的位置进入互动模式时间，当互动模式结束后，继续脚本直播。',
  interactionModel_tip3:'3、开启互动模式必须结合用户弹幕问题监测软件共同使用，且提前设定好问题和答案，否则互动模式无效。',
  interactionModel_tip4:'弹幕问题监控软件及问答配置需联系商务处理',

  temporaryWords:'临时话术',
  stopPlay:'停止播放',
  playNext:'播放下一段',
  playNext_ctrl:'播放下一段：【Ctrl】+【n】',
  autoPlay:'自动播放',

  online_t:'网络已重新连接',
  online_c:'网络连接已恢复，祝您使用愉快!',

  offline_t:'网络连接已断开',
  offline_c:'网络连接出现异常，请确认您的联网状态!',
  placeStopPlaying:"请先停止直播！",

  closeInteraction_tip:'关闭互动模式可能会增加被平台判定为录播的风险，请谨慎操作！',

  interactionModel_open:'互动模式已开启',
  interactionModel_close:'互动模式已关闭',

  queue_tip:'检测到当前还有排队数据，请等待排队播放完毕',
  queue_tip2:'剧本段落已排队，稍后播放!',
  queue_tip3:'最多支持1个剧本段落排队，请稍后!',
  queue_tip4:'最多支持3个播放排队,请稍后!',



  taskRunning:'当前任务正在执行中，请稍后...',
  isValidTextMsg: '请输入有效字符',


}
export default {
  common,
  app,
  myscript,
  step,
  tools,
  webcast,
  direct
}
