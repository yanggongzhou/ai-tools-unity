//添加
function set(name, value){
  sessionStorage.setItem(name,value)
}
// 获取
function get(name) {
  return sessionStorage.getItem(name)
}
// 删除
function del(name){
  sessionStorage.removeItem(name)
}
//清空
function clean(){
  sessionStorage.clear();
}
// 封装至auth
export const Session={
  clean,
  del,
  get,
  set
};
