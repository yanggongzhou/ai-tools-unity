const common = {
  top_title:'剧本列表',
  top_title_edit:'剧本编辑',
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


  changeAvatarFailMsg:'切换角色失败，请重试',
  resourceLoadingMsg:'资源加载中，请稍后...',
  resourceLoadingFailMsg:'加载资源失败，请重试',
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

export default {
  common,
  app,
  myscript,
  step,
  tools



}
