//dom转字符串
function nodeToString ( node ) {
  let tmpNode = document.createElement( "div" );
  tmpNode.appendChild( node.cloneNode( true ) );
  let str = tmpNode.innerHTML;
  tmpNode = node = null; // prevent memory leaks in IE
  return str;
}

//转意符换成普通字符
function escape2Html(str) {
  let arrEntities={'Alpha':'Α','Beta':'Β','Gamma':'Γ',
    'Delta':'Δ', 'Epsilon':'Ε', 'Zeta':'Ζ',
    'Eta':'Η', 'Theta':'Θ', 'Iota':'Ι',
    'Kappa':'Κ', 'Lambda':'Λ', 'Mu':'Μ',
    'Nu':'Ν', 'Xi':'Ξ', 'Omicron':'Ο',
    'Pi':'Π', 'Rho':'Ρ', 'Sigma':'Σ',
    'Tau':'T', 'Upsilon':'Y', 'Phi':'Φ',
    'Chi':'X', 'Psi':'Ψ', 'Omega':'Ω',
    'alpha':'α', 'beta':'β', 'gamma':'γ',
    'delta':'δ', 'epsilon':'ε', 'zeta':'ζ',
    'eta':'η', 'theta':'θ', 'iota':'ι',
    'kappa':'κ', 'lambda':'λ', 'mu':'μ',
    'nu':'ν', 'xi':'ξ', 'omicron':'ο',
    'pi':'π', 'rho':'ρ', 'sigmaf':'ς',
    'sigma':'σ', 'tau':'τ', 'upsilon':'υ',
    'phi':'φ', 'chi':'χ', 'psi':'ψ',
    'omega':'ω', 'thetasym':'ϑ', 'upsih':'ϒ',
    'piv':'ϖ', 'bull':'•', 'hellip':'…',
    'prime':'′', 'Prime':'″', 'oline':'‾',
    'frasl':'⁄', 'weierp':'℘', 'image':'ℑ',
    'real':'ℜ', 'trade':'™', 'alefsym':'ℵ',
    'larr':'←', 'uarr':'↑', 'rarr':'→',
    'darr':'↓', 'harr':'↔', 'crarr':'↵',
    'lArr':'⇐', 'uArr':'⇑', 'rArr':'⇒',
    'dArr':'⇓', 'hArr':'⇔', 'forall':'∀',
    'part':'∂', 'exist':'∃', 'empty':'∅',
    'nabla':'∇', 'isin':'∈', 'notin':'∉',
    'ni':'∋', 'prod':'∏', 'sum':'∑',
    'minus':'−', 'lowast':'∗', 'radic':'√',
    'prop':'∝', 'infin':'∞', 'ang':'∠',
    'and':'∧', 'or':'∨', 'cap':'∩',
    'cup':'∪', 'int':'∫', 'there4':'∴',
    'sim':'∼', 'cong':'≅', 'asymp':'≈',
    'ne':'≠', 'equiv':'≡', 'le':'≤',
    'ge':'≥', 'sub':'⊂', 'sup':'⊃',
    'nsub':'⊄', 'sube':'⊆', 'supe':'⊇',
    'oplus':'⊕', 'otimes':'⊗', 'perp':'⊥',
    'sdot':'⋅', 'lceil':'⌈', 'rceil':'⌉',
    'lfloor':'⌊', 'rfloor':'⌋', 'loz':'◊',
    'spades':'♠', 'clubs':'♣', 'hearts':'♥',
    'diams':'♦', 'nbsp':' ', 'iexcl':'¡',
    'cent':'¢', 'pound':'£', 'curren':'¤',
    'yen':'¥', 'brvbar':'¦', 'sect':'§',
    'uml':'¨', 'copy':'©', 'ordf':'ª',
    'laquo':'«', 'not':'¬', 'shy':' ',
    'reg':'®', 'macr':'¯', 'deg':'°',
    'plusmn':'±', 'sup2':'²', 'sup3':'³',
    'acute':'´', 'micro':'µ', 'quot':'"',
    'lt':'<', 'gt':'>','amp':'&'};
  return str.replace(/&(Alpha|Beta|Gamma|Delta|Epsilon|Zeta|Eta|Theta|Iota|Kappa|Lambda|Mu|Nu|Xi|Omicron|Pi|Rho|Sigma|Tau|Upsilon|Phi|Chi|Psi|Omega|alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|omicron|pi|rho|sigmaf|sigma|tau|upsilon|phi|chi|psi|omega|thetasym|upsih|piv|bull|hellip|prime|Prime|oline|frasl|weierp|image|real|trade|alefsym|larr|uarr|rarr|darr|harr|crarr|lArr|uArr|rArr|dArr|hArr|forall|part|exist|empty|nabla|isin|notin|ni|prod|sum|minus|lowast|radic|prop|infin|ang|and|or|cap|cup|int|there4|sim|cong|asymp|ne|equiv|le|ge|sub|sup|nsub|sube|supe|oplus|otimes|perp|sdot|lceil|rceil|lfloor|rfloor|loz|spades|clubs|hearts|diams|nbsp|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|shy|reg|macr|deg|plusmn|sup2|sup3|acute|micro|quot|lt|gt|amp);/ig,function(all,t){return arrEntities[t];});
  // let reg = /&[a-z]{1,7};/ig
  // return str.replace(reg,' ')
}
//去除标签的纯文本
function exportMessage(text){
  // // 兼容QQ浏览器、window系统chrome 84.0.4147.125
  // String.prototype.replaceAll = function(s1,s2){
  //   return this.replace(new RegExp(s1,"gm"),s2);
  // }
  let wiseDomList = document.getElementsByClassName('w-textarea_input')[0].querySelectorAll('wise')
  // document.getElementsByClassName('w-textarea_input')[0].querySelectorAll('wise')[0].innerText
  let resText=document.getElementsByClassName('w-textarea_input')[0].innerText;
  //IndexTextArr——全部带html文本标签分段数组；IndexNumArr为全部纯文本标签分段数组；resArr为data-obj和下标集合
  let IndexTextArr = [],IndexNumArr=[],messageArr =[];
  //筛选待处理
  wiseDomList.forEach(wise=>{
    resText = resText.replace(wise.innerText,'')
    var escapedStr = nodeToString( wise ).replace( "<" , "<" ).replace( ">" , ">");
    IndexTextArr.push(text.split(escapedStr)[0]);
    messageArr.push({
      datasetObj:JSON.parse(wise.dataset.obj),
      index:''
    })
  })

  IndexTextArr.forEach((val,ind)=>{
    let _text=val;
    wiseDomList.forEach(wise=>{
      var escapedStr = nodeToString( wise ).replace( "<" , "<" ).replace( ">" , ">");
      _text = _text.replace(escapedStr,'')
    })
    IndexNumArr.push(escape2Html(_text));
  })
  console.log('纯文本缺最后一项文本，标签分段数组',IndexNumArr)
  IndexNumArr.forEach((val,ind)=>{//整合标签下标
    messageArr[ind].index = val.length;
  })

  resText = escape2Html(resText)
  // resText.replaceAll('&nbsp;','').replaceAll('&amp;','&')
  return new Promise(resolve => {
    resolve({messageArr:messageArr,noTagText:resText})
  })
}
export const ExportMessage = exportMessage;
export const NodeToString = nodeToString;
