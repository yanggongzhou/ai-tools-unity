<template>
  <div class="w-textarea" ref="wTextarea">
    <div
      class="w-textarea_input"
      ref="wTextareaContent"
      :id="contentId"
      @click="inputClick($event)"
      @focus="isLocked = true"
      @blur="isLocked = false"
      @keydown.delete="handleDelete($event)"
      @input="handleInput($event.target)"
    ></div>

    <div class="w-textarea_tools clearfix" v-if="tools.length > 0 || maxlength">
      <el-popconfirm
        confirmButtonText='是的'
        cancelButtonText='不用了'
        icon="el-icon-info"
        iconColor="red"
        @onConfirm="openTagDialog('clean')"
        title="确认清空所有标签？">
        <button slot="reference" class="w-textarea_tools__item item1 float_left">清空标签</button>
      </el-popconfirm>

      <button class="w-textarea_tools__item item2 float_right"
              @click="openTagDialog('img')">插入图片</button>
      <button class="w-textarea_tools__item item3 float_right"
              @click="openTagDialog('video')">插入视频</button>
      <button class="w-textarea_tools__item item4 float_right"
              @click="openTagDialog('interaction')">插入互动</button>

<!--      <button class="w-textarea_tools__item float_right"-->
<!--        v-for="item in tools"-->
<!--        :key="item.type"-->
<!--        @click="openTagDialog(item.type)">{{item.text}}</button>-->

<!--      <span :class="['w-textarea_tools__text',-->
<!--        count.num < 0 ? '__danger' : '']"-->
<!--        v-if="maxlength">{{count.text}}</span>-->
    </div>
    <div class="w-textarea_dialog">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import SSTTS from '@/api/sstts.js'
  import Bus from "@/api/bus";
export default {
  name: 'wTextarea',
  data() {
    return {
      // 记录currentText以计算长度
      currentText: this.value,
      // 为input区域生成随机id，当在页面上有多个组件时，用于监听光标的变化
      contentId: `content${this.getGuid()}`,
      // 输入的时候锁定，禁止更新innerHTML
      isLocked: false,
      // 记录当前选中tag的ID
      currentTagId: null,
      // 当前光标位置
      savedRange: {},
      //操作按钮
      tools: [
        // { type: 'action', text: '模型动作' },
        // { type: 'clean', text: '清空标签' },
        // { type: 'video', text: '添加视频' },
        // { type: 'img', text: '添加图片' },
      ],
      isFirst:true,
      recentlyAddedTagsID: '',
      initCurrentTxtData: {},
      currentTxtData: {},
      isKeyDown: false,
      isTextureClicked: false,
      inHandledSituation1: false
    };
  },
  props: {
    testData:String,
    value: {
      type: String,
      default: ''
    },
    tag: { // 自定义模版标签的标签名
      type: String,
      // 默认使用wise作为标签名，并添加了默认样式
      // 当使用其他标签名的时候，需要另写标签样式
      default: 'wise'
    },
    // tools: { // 自定义扩展功能：超链接'link'，模版标签'tag'
    //   type: Array,
    //   default () {
    //     return [
    //       { type: 'link', text: '添加超链接' },
    //     ]
    //   }
    // },
    maxlength: { // 最大输入长度
      type: [String, Number],
      default: ''
    }
  },
  computed: {
    count () { // 字符长度记数
      let num = this.maxlength - this.currentText.length
      let text = num < 0 ? `已超出${Math.abs(num)}个字符` : `还可以输入${num}个字符`
      return { num, text }
    }
  },
  mounted() {
    // window.openTagWindow = this.openTagDialog
    let self = this;
    //删除标签
    window.delTag = function(id){
      let child = document.getElementById(id)
      // console.log(JSON.parse(child.dataset.obj).type)
      let _type = JSON.parse(child.dataset.obj).type;
      if(_type==="image"||_type==="video"){
        Bus.$emit('delTag',id)
      }
      let parent = self.$refs.wTextareaContent
      // let parent=document.getElementById(self.contentId);
      let _childTxt = self.nodeToString(child).replace( "<" , "<" ).replace( ">" , ">")
      // self.testData=self.testData.replace(_childTxt,'');
      self.$emit('delTagMain',_childTxt)
      parent.removeChild(child);
    }
    // 初始化数据
    this.currentText && (this.$refs.wTextareaContent.innerHTML = this.currentText);
    // 创建模版标签的style
    this.createStyle();
    // 每次光标变化的时候，保存 range
    document.addEventListener('selectionchange', this.selectHandler);
    // this.$refs.wTextareaContent.addEventListener('selectionchange', this.selectHandler);
    document.addEventListener('keydown', this.handleKeyDown)

    this.$refs.wTextareaContent.focus()
  },
  beforeDestroy() {
    // 卸载事件
    document.removeEventListener('selectionchange', this.selectHandler);
    // this.$refs.wTextareaContent.removeEventListener('selectionchange', this.selectHandler);
    document.removeEventListener('keydown', this.handleKeyDown)
  },
  methods: {
    handleKeyDown(e) {
      if(e.keyCode==39 || e.keyCode==37) {
        this.isKeyDown = true;
      }
    },
    //去除标签的纯文本
    exportMessage(){
      let self = this;
      let wiseDomList = document.getElementsByClassName('w-textarea_input')[0].querySelectorAll('wise')
      let allText = document.getElementsByClassName('w-textarea_input')[0].innerText
      // document.getElementsByClassName('w-textarea_input')[0].querySelectorAll('wise')[0].innerText
      let resText=allText;
      //IndexTextArr——全部带html文本标签分段数组；IndexNumArr为全部纯文本标签分段数组；resArr为data-obj和下标集合
      let IndexTextArr = [],IndexNumArr=[],messageArr =[];
      //筛选待处理
      wiseDomList.forEach(wise=>{
        resText = resText.replace(wise.innerText,'')
        var escapedStr = this.nodeToString( wise ).replace( "<" , "<" ).replace( ">" , ">");
        IndexTextArr.push(self.testData.split(escapedStr)[0]);
        messageArr.push({
          datasetObj:JSON.parse(wise.dataset.obj),
          index:''
        })
      })

      IndexTextArr.forEach((val,ind)=>{
        let _text=val;
        wiseDomList.forEach(wise=>{
          var escapedStr = self.nodeToString( wise ).replace( "<" , "<" ).replace( ">" , ">");
          _text = _text.replace(escapedStr,'')
        })
        IndexNumArr.push(_text);
      })
      console.log('纯文本缺最后一项文本，标签分段数组',IndexNumArr)

      IndexNumArr.forEach((val,ind)=>{//整合标签下标
        messageArr[ind].index = val.length;
      })

      return new Promise(resolve => {
        resolve({messageArr:messageArr,noTagText:resText})
      })
    },
    //dom转字符串
    nodeToString ( node ) {
      var tmpNode = document.createElement( "div" );
      tmpNode.appendChild( node.cloneNode( true ) );
      var str = tmpNode.innerHTML;
      tmpNode = node = null; // prevent memory leaks in IE
      return str;
    },


    updateData(text) {
      this.$emit('input', text);
    },
    createStyle() {
      // 为自定义的模版标签添加样式，使之不可编辑
      let style = document.createElement('style');
      style.innerHTML = `.w-textarea ${this.tag} {
        cursor: default;
        -webkit-user-modify: read-only !important;
      }`;
      this.$refs.wTextarea.appendChild(style);
    },
    closeModal() {
      this.form.text = '';
      this.showModal = false;
    },
    openTagDialog(type) {
      // 将事件抛给父组件处理
      // 处理后需要调用 addTag() 或者 addLink() 将内容传回来
      this.currentTxtData = JSON.parse(JSON.stringify(this.initCurrentTxtData));
      this.$emit('add', type)
    },
    addTag(text,data) {
      // 创建模版标签
      let node = document.createElement(this.tag);
      node.innerHTML = text;
      // 添加id便于删除
      node.id = data.id;
      node.dataset.obj=JSON.stringify(data)
      this.insertNode(node);

      this.recentlyAddedTagsID = node.id;
    },
    addLink(text, url) {
      // 创建a标签
      let node = document.createElement('a');
      node.innerText = text;
      node.href = url;
      node.target = 'blank';
      this.insertNode(node)
    },
    insertNode (node) { // 在内容中插入标签
      this.isKeyDown = false;
      // 删掉选中的内容（如有）
      // console.log(this.savedRange)
      this.savedRange.deleteContents()
      // 插入链接
      // console.log(this.savedRange)
      let elem = this.savedRange.commonAncestorContainer;
      if(elem.nodeName=='#text' || elem.nodeName=='DIV'&&elem.id.indexOf('contentr')>-1) {
        this.savedRange.insertNode(node)
      }else if(elem.nodeName=='DIV'&&elem.className.indexOf('el-input')>-1) {
        let nodes = this.$refs.wTextareaContent.childNodes;
        // console.log(nodes);
        let cursorTargetIdx = null;
        nodes.forEach((item, idx) => {
          if(item.nodeName=='#text' && item.textContent==this.currentTxtData.txt){
            cursorTargetIdx = idx;
            return true;
          }
        })
        if(this.currentTxtData.isDiv) {
          // 最后一个元素是标签时，在最后位置插入标签
          this.savedRange.selectNode(this.$refs.wTextareaContent);
          this.savedRange.setStart(this.savedRange.commonAncestorContainer.childNodes[0], nodes.length)
          this.savedRange.setEnd(this.savedRange.commonAncestorContainer.childNodes[0], nodes.length)
        }else {
          // 在文本中间插入图片或视频，光标位于当前标签之后，此操作防止将标签插入到弹框中
          // console.log(cursorTargetIdx, this.$refs.wTextareaContent)
          this.savedRange.selectNode(this.$refs.wTextareaContent.childNodes[cursorTargetIdx]);
          // console.log(this.savedRange)
          this.savedRange.setStart(this.savedRange.commonAncestorContainer.childNodes[cursorTargetIdx], this.currentTxtData.startOffset);
          this.savedRange.setEnd(this.savedRange.commonAncestorContainer.childNodes[cursorTargetIdx], this.currentTxtData.startOffset);
          // console.log(cursorTargetIdx , this.savedRange)
        }

        this.savedRange.insertNode(node)
      }


      // 更新双向绑定数据
      let target = this.$refs.wTextareaContent
      this.updateData(target.innerHTML);
      this.currentText = target.innerText;
    },
    handleInput(target) {
      // 即时更新数据
      this.updateData(target.innerHTML);
      this.currentText = target.innerText;
    },
    handleDelete(e) {
      // console.log('handleDelete: ', this.currentTagId)
      // 监听“删除”事件
      if (this.currentTagId) {
        // 若已选中模版标签，直接删除dom节点
        let t = document.getElementById(this.currentTagId);
        console.log(t)
        this.$refs.wTextareaContent.removeChild(t);
        this.currentTagId = null;
        // 阻止浏览器默认的删除事件，并手动更新数据
        e.preventDefault();
        this.handleInput(e.target);
      }
      // else {
      //   e.preventDefault();
      //   console.log('⛰️⛰️⛰️', this.savedRange)
      // }
    },
    inputClick(e) {
      // console.log(e)
      // 监听点击事件
      this.isLocked = true;
      const TAG_NAME = e.target.nodeName;
      if (TAG_NAME === this.tag.toUpperCase()) {
        // 点击模版标签时，记录id
        this.currentTagId = e.target.id;
        e.target.className = 'active';
      } else if (this.currentTagId) {
        // 清空active样式
        let target = document.getElementById(this.currentTagId);
        target.className = '';
        this.currentTagId = null;
      } else {
        this.currentTagId = null;
      }
      this.isTextureClicked = true;
      this.isKeyDown = false;
      this.selectHandler();
    },
    getGuid() {
      // 生成随机ID
      return `r${new Date().getTime()}d${Math.ceil(Math.random() * 1000)}`;
    },
    selectHandler() {
      // 监听选定文本的变动
      let sel = window.getSelection();
      let range = sel.rangeCount > 0 ? sel.getRangeAt(0) : null;

      // console.log(this.isKeyDown, this.isLocked)
      if(range) {
        // console.log('selectHandler: ', range, range.commonAncestorContainer.ownerDocument.activeElement.id , this.contentId, range.commonAncestorContainer.ownerDocument.activeElement.id === this.contentId)

        let elem = range.commonAncestorContainer;
        let nodes = this.$refs.wTextareaContent.childNodes;
        if(range.commonAncestorContainer.ownerDocument.activeElement.id === this.contentId) {
          // console.log('=====')
          if(elem.nodeName=='#text') {
            // 修复输入第一个字符时，光标在字符前的bug
            if(range.endOffset==0 && range.startOffset==0 && elem.textContent.length==1) {
              // console.log('111')
              let targetLen = elem.textContent.length;
              range.setStart(elem, targetLen);
              range.setEnd(elem, targetLen);
            }else if(range.endOffset==0 && range.startOffset==0 && elem.textContent.length>1 && !this.isKeyDown ) {
              // 当点击DIV时，如果已经插入标签、图片、视频，光标位于最后
              // 此方法会导致光标在第一个元素前闪烁一下，随后定位到最后一个元素后。
              // console.log('22222')
              let _idx = 0;
              nodes.forEach((item, idx)=> {
                if(elem.textContent == item.textContent) {
                  _idx = idx;
                }
              })
              if(nodes.length>1 && _idx==0) {
                // console.log('🌞')
                // let idx = nodes.length-1;
                range.selectNode(nodes[nodes.length-1])
                if(!range.collapsed) range.collapse(false);
              }
            }else {
              // console.log(range)
              // 标记当前元素为 text 及光标位置
              this.initCurrentTxtData.startOffset = range.startOffset;
              this.initCurrentTxtData.txt = elem.textContent;
              this.initCurrentTxtData.isDiv = false;
            }
          }
          // 标记当前元素为div
          if(elem.nodeName=='DIV') {
            // console.log('99999')
            this.initCurrentTxtData.isDiv = true;

            // 开始和结束位置都为标签时，将光标置于最后
            if(nodes.length>0 && nodes[0].nodeName=='WISE' && nodes[nodes.length-1].nodeName=='WISE' && !this.isKeyDown && this.isTextureClicked) {
              range.selectNode(nodes[nodes.length-1])
              this.isTextureClicked = false;
            }

            // 一个标签/多个标签+文本 situation1
            if(nodes.length>0 && nodes[nodes.length-1].nodeName=='#text') {
              let _isSituation1 = true;
              nodes.forEach((item,idx) => {
                if(idx < nodes.length-1 && item.nodeName!='WISE') {
                  _isSituation1 = false
                }
              })
              if(_isSituation1 && !this.inHandledSituation1) {
                range.selectNode(nodes[nodes.length-1])
                this.inHandledSituation1 = true;
              }
            }

            if(!range.collapsed) range.collapse(false);
          }
        }else if(elem.className.indexOf('el-input')==-1){
          // console.log('!!!!!!!!!!!!!', this.contentId, '; tagId: ', this.recentlyAddedTagsID)
          // 不失焦的情况，插入图片、视频、标签后，光标位于当前插入标签的后面
          if(elem.nodeName == 'DIV' && nodes.length>0) {
            // console.log('🌛')
            // if(this.recentlyAddedTagsID)
            let recentlyAddedTagsIdx = 0;
            for(let i=0; i<nodes.length; i++){
              if(this.recentlyAddedTagsID == nodes[i].id) {
                recentlyAddedTagsIdx = i;
                break;
              }
            }
            // console.log(nodes.length)
            if(recentlyAddedTagsIdx == 0 && nodes.length==1) {
              // console.log('33333')
              range.setStart(elem, nodes.length)
              range.setEnd(elem, nodes.length)
            }else {
              // console.log('44444')
              range.setStart(elem, recentlyAddedTagsIdx+1)
              range.setEnd(elem, recentlyAddedTagsIdx+1)
            }
            this.$refs.wTextareaContent.focus()
          }
        }

        this.savedRange = range;

      }

      // if (
      //   range &&
      //   range.commonAncestorContainer.ownerDocument.activeElement.id ===
      //   this.contentId
      // ) {
      //   this.savedRange = range;
      // }
    }
  },
  watch: {
    value(val) {
      if(this.isLocked&&this.isFirst){
        this.isFirst = false
        this.$refs.wTextareaContent.innerHTML = this.testData;
      }
      // 非锁定状态下，实时更新innerHTML
      if (!this.isLocked) {
        this.$refs.wTextareaContent.innerHTML = val;
      }
    }
  }
};
</script>
<style lang="less">
// 给标签默认样式，不可scoped
.w-textarea {
  .w-textarea_input {
    caret-color:#FC9C76;
  }
  wise {
    color: #26a2ff;
    padding: 0 1px;
    white-space: nowrap;
    cursor: default;
    -webkit-user-modify: read-only !important;
  }

  .active {
    background: #dcdfe6;
  }
}
</style>

<style lang="less" scoped>
.w-textarea {
  width: 100%;
  box-sizing: border-box;
  /*border-radius: 4px;*/
  margin-bottom: 15px;
  overflow: hidden;
  position: relative;

  &_input {
    width: 100%;
    height: 300px;
    min-height: 100px;
    /*background: white;*/
    background: linear-gradient(#fefbf6, antiquewhite);
    box-sizing: border-box;
    border: 1px solid #FEE0C7;
    overflow: scroll;
    padding: 10px;
    line-height: 1.5;
    word-break: break-word;
    font-size: 14px;
    // 允许编辑，禁止富文本
    -webkit-user-modify: read-write-plaintext-only !important;
    // 兼容safari
    user-select: text;
    /*border-radius: 8px;*/
    &:focus {
      outline: none;
    }
  }

  .w-textarea_tools {
    padding: 0 10px;
    height: 50px;
    line-height: 50px;
    /*background-color: #f5f7fa;*/
    background-color: #fff;
    color: #666;
    font-size: 0px;
    .w-textarea_tools__item {
      font-size: 12px;
      margin-top: 10px;
      display: inline-block;
      line-height: 1;
      padding: 5px 8px;
      margin-right: 8px;
      height: 30px;
      width: 85px;
      border-radius: 32px;
      cursor: pointer;
      border: 1px solid #dcdfe6;
      background: #fff;
      transition: all 0.3s;
      color: #FFFFFF;
      &:hover {
        opacity: .7;
      }
      &:focus {
        outline: none;
      }
    }
    .item1{
      background-color: #FC9C76;
    }
    .item2{
      background-color: #30CBD7;
      margin-left: 12px;
    }
    .item3{
      background-color: #6687FD;
      margin-left: 12px;
    }
    .item4{
      background: #673AB7;
    }
    &__text {
      display: inline-block;
      line-height: 40px;
      padding: 0 8px;
      float: right;
      color: #666;
      cursor: default;
      transition: all 0.3s;

      &:hover {
        opacity: 1;
      }

      &.__danger {
        color: red;
      }
    }
  }
}
</style>
