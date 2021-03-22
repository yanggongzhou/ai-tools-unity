const animateData = {
  bounce: '弹跳',
  flash: '闪烁',
  pulse: '脉冲',
  rubberBand: '橡皮筋',
  shakeX: '左右弱晃动',
  shakeY: '上下弱晃动',
  swing: '上下摆动',
  tada: '缩放摆动',
  wobble: '左右强晃动',
  jello: '拉伸抖动',
  heartBeat:"心跳抖动",

  hinge:'悬挂脱落',
  jackInTheBox:'放大进入左右晃动',
  rollIn:'向右翻转进入',
  rollOut:'向右翻转退出',


  backInDown:"后方向下进入",
  backInUp:'后方向上进入',
  backInLeft:'后方左边进入',
  backInRight:'后方右边进入',
  backOutDown:'后方向下退出',
  backOutUp:"后方向上退出",
  backOutLeft:'后方向左退出',
  backOutRight:"后方向右退出",


  fadeIn: '淡入',
  fadeInDown: '向下淡入',
  fadeInDownBig: '向下快速淡入',
  fadeInLeft: '向右淡入',
  fadeInLeftBig: '向右快速淡入',
  fadeInRight: '向左淡入',
  fadeInRightBig: '向左快速淡入',
  fadeInUp: '向上淡入',
  fadeInUpBig: '向上快速淡入',
  fadeInTopLeft:'左上方淡入',
  fadeInTopRight:'右上方淡入',
  fadeInBottomLeft:'左下方淡入',
  fadeInBottomRight:'右下方淡入',

  fadeOut: '淡出',
  fadeOutDown: '向下淡出',
  fadeOutDownBig: '向下快速淡出',
  fadeOutLeft: '向左淡出',
  fadeOutLeftBig: '向左快速淡出',
  fadeOutRight: '向右淡出',
  fadeOutRightBig: '向右快速淡出',
  fadeOutUp: '向上淡出',
  fadeOutUpBig: '向上快速淡出',
  fadeOutTopLeft:'向左上方淡出',
  fadeOutTopRight:'向右上方淡出',
  fadeOutBottomRight:'向右下方淡出',
  fadeOutBottomLeft:'向左下方淡出',

  bounceIn: '弹跳进入',
  bounceInDown: '向下弹跳进入',
  bounceInLeft: '向右弹跳进入',
  bounceInRight: '向左弹跳进入',
  bounceInUp: '向上弹跳进入',
  bounceOut: '弹跳退出',
  bounceOutDown: '向下弹跳退出',
  bounceOutLeft: '向左弹跳退出',
  bounceOutRight: '向右弹跳退出',
  bounceOutUp: '向上弹跳退出',

  zoomIn: '放大进入',
  zoomInDown: '向下放大进入',
  zoomInLeft: '向右放大进入',
  zoomInRight: '向左放大进入',
  zoomInUp: '向上放大进入',
  zoomOut: '缩小退出',
  zoomOutDown: '向下缩小退出',
  zoomOutLeft: '向左缩小退出',
  zoomOutRight: '向右缩小退出',
  zoomOutUp: '向上缩小退出',

  rotateIn: '顺时针旋转进入',
  rotateInDownLeft: '从左往下旋入',
  rotateInDownRight: '从右往下旋入',
  rotateInUpLeft: '从左往上旋入',
  rotateInUpRight: '从右往上旋入',
  rotateOut: '顺时针旋转退出',
  rotateOutDownLeft: '向左下旋出',
  rotateOutDownRight: '向右下旋出',
  rotateOutUpLeft: '向左上旋出',
  rotateOutUpRight: '向右上旋出',

  flip:'翻转一周',
  flipInX: '水平翻转进入',
  flipInY: '垂直翻转进入',
  flipOutX: '水平翻转退出',
  flipOutY: '垂直翻转退出',

  // lightSpeedInRight:'向左惯性进入',
  // lightSpeedInLeft:'向右惯性进入',
  // lightSpeedOutRight:'向右惯性退出',
  // lightSpeedOutLeft:'向左惯性退出',

  slideInDown:'向下滑动进入',
  slideInLeft:'向右滑动进入',
  slideInRight:'向左滑动进入',
  slideInUp:'向上滑动进入',
  slideOutDown:'向下滑动退出',
  slideOutLeft:'向左滑动退出',
  slideOutRight:'向右滑动退出',
  slideOutUp:'向上滑动退出'
}
const animateList = []
for(let ani in animateData){
  animateList.push({
    value:ani,
    label:animateData[ani]
  })
}

export const AnimateList = animateList;
