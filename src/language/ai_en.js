const common = {
  top_title:'ScriptList',
  top_title_edit:'ScriptEdit',
  top_title_play:'ScriptPlay',
  back:'Back',
  search:'Search',
  check: 'Check',
  edit:'Edit',
  delete:'Delete',
  preview:'Preview',
  handle:'Handle',
  cancel:'Cancel',
  confirm:'Confirm',
  tableListFail:'Data acquisition failed!',
  dataFail:'Data acquisition failed!',
  save:'Save',
  saveAs:'Save as',
  saveSuccess:'Saved successfully!',
  add:'Add',
  addSuccess:'Added successfully',
  addFail:'Add failed',
  editSuccess:'Edited successfully',
  editFail:'Edit failed',
  open:'Open',
  close:'Close',

  changeAvatarFailMsg:'Failed to change avatars. Please try again',
  resourceLoadingMsg:'Resource loading, please wait...',
  resourceLoadingFailMsg:'Failed to load resource. Please try again!',
  resourceLoadingFailMsg2:'Failed to load resource!',
  tip:"Tip",
  userInsertMsg:'User information injection...',
  userReqFailMsg:"Failed to request user information, please restart the window!",
  userInsertSuccessMsg:"User information has been injected!",


}
const app = {
  previewTip:'Click on the screen to cancel the playback',
  myscript:'My Script',
  goLive: 'Go Live',
  devTip:'This is the beta version!'
}
const myscript = {
  createScript:'New Script',
  goLive:"Go Live",
  updateTime:'update time',
  title:'title',
  paragraph:'paragraph',
  ip:'IP',
  tableNull:'Null',

  popconfirm_title:'Confirm to delete this data!',
  script:'Script',

}
const step = {
  title:'Create and edit scripts',
  step1:'Select the background of the studio to be used by the script',
  step2:'Select the role model used by the script',
  step3:'Select the number, size, and location of display slots used by the script',
  step4:'Edit the script in the right script editing window',
}
const tools = {
  titleErrTip:'Please enter a valid script name',
  isValidTextMsg:'Please confirm that each paragraph contains valid text',
  isValidTextMsg2:'Please confirm that the current paragraph contains valid text！',

  action_title:'Action tag',
  action_title_tip_t:'Actions',
  action_title_tip_c:`Note that the action tag next to <br> the text will only execute the last one!`,

  delete_paragraph_tip:'Delete paragraph?',
  alreadyTop:"It's at the top!",
  alreadyBottom:"It's at the bottom",

  img:'Image',
  video:'Video',
  text:'Text',
  interval:'Interval',
  interaction:'Interaction',

  infoModel_tip:'Please add exhibition space first',
  textForm_tip:'Please enter the text',
  upload_tip1:'Please upload the file first',
  upload_tip2:'Please confirm the presentation time',

  upload_img:'Upload pictures',
  upload_video:'Upload video',
  upload_img_tip:'*Support JPG, PNG, GIF format, up to 5M',
  upload_video_tip:'*Support MP4 format, up to 200m',

  upload_img_msg1:'The uploaded image can only be in JPG / PNG / GIF format!',
  upload_img_msg2:'Upload image size cannot exceed 5MB!',
  upload_video_msg1:'Upload video can only be MP4 format!',
  upload_video_msg2: 'Upload video size cannot exceed 200MB!',

  img_tag:'Image',
  video_tag:'Video',
  text_tag:'Text',
  interval_tag:'Interval',
  interaction_tag:'Interaction',
  interaction_tag_tip_t:'Interaction Tag',
  interaction_tag_tip_c:'Pay attention not to be too close to the text!',
  clean_tag:'Clean',
  clean_tag_tip:'Confirm to clear all labels？',

  booths:'booths',
  uploadFile:'Upload file',
  timeSetting:'Duration',
  animation:"Animation",
  animation_enter:'enter',
  animation_leave:'leave',
  voiceSetting:'Voice',
  dismissTimeTypeData:[
    // {label:'至视频播放结束',value:0},
    {label:'To the end of the play',value:1},
    {label:'Custom duration',value:2},
  ],
  uploadVideoErrMsg:'Video duration acquisition failed. Please wait for the video upload to complete and try again！',
  textColor:'Color',
  textAlign:'Align',
  textSize:'Size',
  fontFamily:"Font",
  textContent:'Content',


}

const webcast = {
  scriptSetting:'ScriptSetting',
  sceneWords:'Sence Words',
  add:'add',
  playSetting:'playSetting',

  goodsId:'goodsId',
  widget:'widget',
  remove:'remove',
  selectAll:'selectAll',

  goodsIdMsg1:'Commodity number cannot be empty',
  goodsIdMsg2:'The item number has been added',
  widgetMsg:'The higher the weight, the greater the probability of being repeated when playing randomly!',

  addPlayScriptTip:'Please add play script~',
  cleanList:'Clear list',

  interactionRoundsSetting_t:'Interactive mode rounds setting',
  interactionRoundsSetting_c:'Rounds of interactive mode: interact with the audience after entering the interactive mode each time',
  defaultAllDay:'default all day',
  rounds:'rounds',
  timeSetting:'Time period setting (unset time period, default to 2 rounds)',

  emergencyContact:'emergency contact',
  phone:'phone',
  phone_tip:"The mobile phone number of the emergency contact is used to receive SMS notification of abnormal situations such as live broadcast interruption! The default registered mobile phone number can be modified.",
  timeSelect:'Time selection',

  wordList_tip:'Create up to 10. When multiple scripts are opened, one will be randomly played',

  textArea_placeholder:'Up to 40 words can be entered',
  deleteWords_tip:'Delete script？',

  selectState:'State switch',
  textArea_placeholder2:'Input Words',

  tabs1: [
    {
      label: 'Interactive mode'
    },
    {
      label: 'emergency contact'
    },
  ],

  tips2: {
    welcome: 'Set up the opening language of live broadcast',
    endwords: 'Set up the cohesive script when switching between different scripts'
  },

  tabs3: [
    // {
    //   label: 'Opening remarks',
    //   name: 'welcome'
    // },
    // {
    //   label: 'Cohesion',
    //   name: 'endwords'
    // }
    {
      label: 'Opening remarks',
      name: 'welcome'
    },
    {
      label: 'Cohesion',
      name: 'endwords'
    }
  ],
}

const direct = {
  progress_tip1:"General script",
  progress_tip2:"Cache progress",
  progress_tip3:"Cache cancellation",

  randomPlay:'Random play',
  randomPlay_tip1:'1. After it is turned on, the script will be played randomly in the automatic live broadcast.',
  randomPlay_tip2:'2. According to the script weight, the higher the weight, the greater the probability of repeat play.',
  randomPlay_tip3:'3. It is recommended to turn on random play when multiple scripts (> 4)',

  interactionModel:'Interactive mode',
  interactionModel_tip1:"1. After opening, the virtual anchor can interact with consumers, answer users' questions during the interaction time, and welcome users to the live room",
  interactionModel_tip2:"2. At present, the virtual anchor interaction time enters the interaction mode after the end of each script and the position with interaction label in the script. When the interaction mode is over, the script will continue to be broadcast live.",
  interactionModel_tip3:"3. Opening the interactive mode must be combined with the user screen question monitoring software, and set the questions and answers in advance, otherwise the interactive mode is invalid.",
  interactionModel_tip4:"The monitoring software and Q & a configuration of barrage problems need to contact the business department for handling",

  temporaryWords:'Temporary script',
  stopPlay:'StopPlaying',
  playNext:'Play the next',
  playNext_ctrl:'Shortcut key：【Ctrl】+【n】',
  autoPlay:'Autoplay',

  online_t:'The network has been reconnected',
  online_c:'The network connection has been restored. Have a good time!',

  offline_t:'The network connection has been disconnected',
  offline_c:'Network connection is abnormal, please confirm your network status!',
  placeStopPlaying:"Please stop the live broadcast first!",

  closeInteraction_tip:'Closing the interactive mode may increase the risk of being judged as recording and broadcasting by the platform, please operate with caution!',

  interactionModel_open:'Interactive mode is on',
  interactionModel_close:'Interactive mode is off',

  queue_tip:'It has been detected that there is still queue data. Please wait for the queue to finish playing',
  queue_tip2:'The script paragraphs are in line, and will be played later!',
  queue_tip3:'Support up to 1 script paragraph queue, please wait!',
  queue_tip4:'Up to 3 playback queues are supported, please wait a moment!',



  taskRunning:'The current task is in progress, please wait...',
  isValidTextMsg: 'Please enter a valid character',


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
