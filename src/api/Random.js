let total;//权重总和
let resList;//数组
let _count;//脚本id或者标记 例如[1,2,3,4,5,6]

let recordSameCountArr=[];//记录连续重复数据
let recordCount;//上一个数

let List = [
  {count:1, weight:10,},
  {count:2, weight:7,},
  {count:3, weight:5,},
  {count:4, weight:5,},
  {count:5, weight:2,},
  {count:6, weight:2,},
]
/**
 * Fisher–Yates shuffle
 */
Array.prototype.shuffle = function() {
  var input = this;

  for (var i = input.length - 1; i >= 0; i--) {

    var randomIndex = Math.floor(Math.random() * (i + 1));
    var itemAtIndex = input[randomIndex];

    input[randomIndex] = input[i];
    input[i] = itemAtIndex;
  }
  return input;
}
//从头开始算出第一个重复数据
function cut(resListIndex,resList) {
  if(resList.filter(val => {return val===resList[resListIndex]}).length>1){
    return  resListIndex;
  }else{
    resListIndex+=1;
    return cut(resListIndex,resList)
  }
}
//取出的连续数据插入
function sameValInsert(index,sameVal,resList) {
  if(index<resList.length){
    if(sameVal!==resList[index]&&sameVal!==resList[index+1]){
      resList.splice(index,1,resList[index],sameVal)
      return
    }else{
      index+=1
      return sameValInsert(index,sameVal,resList);
    }
  }else{
    resList.push(sameVal)
    return
  }
}

function delSameVal(recordCount,index,resList) {
  if(index<resList.length){
    if(recordCount !== resList[index]){
      recordCount = resList[index];
      return delSameVal(recordCount,index+1,resList)
    }else{
      recordSameCountArr.push(resList.splice(index,1)[0]);
      return delSameVal(recordCount,index,resList)
    }
  }else{
    return resList;
  }
}


function sum(List) {
  _count = [];
  resList=[];
  total = 0;
  List.forEach(val=>{
    total += val.weight
    for (let i=0;i<val.weight;i++){
      resList.push(val.count)
    }
    _count.push(val.count)
  })
  // total 31
  resList.shuffle();
  resList.length = List.length*2;

  let resListIndex = 0;//计数器下标
  _count.forEach(con=>{
    if(resList.indexOf(con)===-1){
      resListIndex = cut(0,resList);
      resList.splice(resListIndex,1,con)
    }
  })
  resList.shuffle();
  //分割连续相同数
  recordSameCountArr=[];//记录连续重复数据
  recordCount=undefined;//上一个数
  delSameVal(recordCount,0,resList)//删除连续相同数
  recordSameCountArr.forEach(sameVal=>{//塞入
    sameValInsert(0,sameVal,resList)
  })
  return resList;
}


export const getWeightList = sum;
