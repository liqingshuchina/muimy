define([], function() {

String.prototype.byteLength = function() {//计算字符串长度(英文字符占一个字符，汉字字符占2个字符)
return this.replace(/[^\x00-\xff]/g,"aa").length;
};
String.prototype.trim = function(s) {
s = (s ? s : "\\s");
s = ("(" + s + ")");
var reg_trim = new RegExp("(^" + s + "*)|(" + s + "*$)", "g");
return this.replace(reg_trim, "");
};
String.prototype.deleteLast = function(s) {
        var str = String(this);
return str.lastIndexOf(s)==str.length-1 ? str.substring(0,str.lastIndexOf(s)) : str
};
//计算字符串长度(英文字符占一个字符，汉字字符占2个字符)
String.prototype.strlen = function() {
var str = this;
var len = 0;
for(var i=0; i<str.length; i++){
var c = str.charCodeAt(i);
//单字节加1
if((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)){
len++;
}else {
len+=2;
}
}
return len;
};


String.prototype.replaceAll = function(s1,s2){
   return this.replace(new RegExp(s1,"gm"),s2);
};

//取重复数据函数
Array.prototype.getdistinct = function (){
var a = [], b = [], c = [], d = [];
for (var prop in this){
var d = this[prop];
if (d === a[prop]){
continue;
} //防止循环到prototype
if (b[d] != 1){
a.push(d);
b[d] = 1;
}else{
c.push(d);
d[d] = 1;
}
}
return c.getdistinct1();
}
Array.prototype.getdistinct1 = function (){
var a = [], b = [];
for (var prop in this){
var d = this[prop];
if (d === a[prop]){
continue; //防止循环到prototype
}
if (b[d] != 1){
a.push(d);
b[d] = 1;
}
}
return a;
}

!window.gSysName && (window.gSysName="/pa18shopnst");

var common = {
/*******************
* 基础功能相关
********************/
sysName : window.gSysName,
paUrl : window.gPaUrlHttp || "http://www.pingan.com",
sysUrl : window.gSysUrlHttp || "http://www.pingan.com"+window.gSysName,
oServerDate: new Date(),
strServerDate:"",
productUrl : "",
flowId : "",
comeFrom : "",




config : function(opt){
var _this = this;
$.each(opt, function(index,item){
_this[index] = item;
});
_this.sysUrl = location.protocol + "//" + location.hostname + (location.port ? ":"+location.port : "") + _this.sysName;
_this.rum.config();
},

/**
* 配置域名相关，返回域名环境标志
*/
configUrl : function(opt){
var thisHostName = location.hostname;
if(thisHostName=="www.pingan.com"){//如果生产
return "www";
}else if(thisHostName=="www.dr.pingan.com"){//如果容灾环境
this.paUrl = "http://www.dr.pingan.com";
this.sysUrl = this.paUrl+this.sysName;
return "dr";
}else{//测试环境
var paUrl="http://dmzstg1.pa18.com";//默认是用stg环境
var testHostPre = "dmzstg1";
if(thisHostName.indexOf("pa18")>-1){//如果测试环境
testHostPre = (thisHostName.split("."))[0];
paUrl = "http://"+testHostPre + ".pa18.com";
}
common.config({ paUrl:paUrl});
return testHostPre;
}
},

/**
* 截取URL参数
*/
getUrlValue : function (url) {
var url = (url !== undefined) ? url : window.location.href;
if (url.indexOf("#") > -1) {
url = url.split("#")[0];
}
var variable = url.split("?")[1];
if (!variable) {
return null;
} else {
var value = {};
variable = variable.split("&");
for (var i = 0, m = variable.length; i < m; i++) {
var tempv=variable[i].split("=")[1];
if(tempv){
if(tempv=="null")tempv="";
tempv=decodeURIComponent(tempv);
value[variable[i].split("=")[0]] = tempv;
}
}
return value;
}
},
/**
* [showOrHideText 显示或隐藏文本，但依旧占位]
* @param  {[jquery dom]} eDom [jquery对象]
* @param  {[Boolean]} flag [标志位，true显示，false或不传隐藏]
*/
showOrHideText : function(eDom, flag){
flag ?  eDom.css("visibility","visible") : eDom.css("visibility","hidden");
},


//判断一个对象是否为{}
isEmptyObject:function(obj){
for(var name in obj){
return false; 
}
return true;
},

/**
* 根据下拉框的值获取其文本值
*/
getOptionTextByValue : function (obj,value){
return $.trim($("option[value='"+value+"']",$(obj)).text());
},

/**
* 根据文本值定位下拉框的值
*/
getOptionValueByText : function (obj,text){
var objs = $("option",$(obj));
for(i=0;i<objs.length;i++){
if($.trim($(objs[i]).text()) === text){
return $(objs[i]).val();
}
}
return false;
},

/**
* 根据单选框的name值获取被选中的值
*/
getRadioValue : function (name){
return $("input[name='"+name+"']:checked").length > 0 ? $("input[name='"+name+"']:checked").val() : false;
},

/**
* 设置单选框的值
*/
setRadioValue : function (name,value){
var findRadio = $("input[name='"+name+"']");
if(findRadio.length > 0){
findRadio.removeAttr("checked");
$("input[name='"+name+"'][value='"+value+"']").attr("checked","checked");
return true;
}
return false;
}, 


/**
* 根据身份证号，获取身份信息，并返回为信息对象
*/
getIdCardInfo : function(id){
//15位身份证号码：第7、8位为出生年份(两位数)，第9、10位为出生月份，第11、12位代表出生日期，第15位代表性别，奇数为男，偶数为女。
//18位身份证号码：第7、8、9、10位为出生年份(四位数)，第11、第12位为出生月份，第13、14位代表出生日期，第17位代表性别，奇数为男，偶数为女。
var idCardInfo = {};
idCardInfo.id=id;
var y=0,m=0,d=0,sex='';
if(id.length==15){
y = id.substring(6, 8);
m = id.substring(8, 10);
d = id.substring(10, 12);
sex = id.substring(14,15);
sex = sex%2==1?'M':'F';
if (y > 10) y = '19'+y;
else y = '20'+y;
}else if(id.length==18){
y = id.substring(6, 10);
m = id.substring(10, 12);
d = id.substring(12, 14);
sex= id.substring(16,17);
sex = sex%2==1?'M':'F';
}else{
idCardInfo.error=true;
}
idCardInfo.year=y;
idCardInfo.month=m;
idCardInfo.day=d;
idCardInfo.sex=sex;
idCardInfo.date=y+'-'+m+'-'+d;
return idCardInfo;
},


/**
*   格式化报价金额，保留几位小数(toFixed是五舍六入)，默认是两位小数，返回的是String类型
*   premium: 要处理的数值，必选，数值或字符串类型，如：45.62或"45.62";
*   format:  保留的小数位，可选，整数，默认是2，保留两位小数。
*/
formatPremium : function(premium, format){
return (new Number(premium)).toFixed(format || (format==0?0:2));
},

// 千位分隔符
formatNumber: function(num) {
   num = num + '';
   if( !/^\d*$/.test(num) ) { return num; }
   var re = /(-?\d+)(\d{3})/; 
   while ( re.test(num) ) { num = num.replace(re,"$1,$2"); }
   return num;
}, 

/**
* 消息提示统一控制
*/
showMsg : function(opt,jqueryObjFocus){
var _this = this;
typeof(opt)=="string" && (opt={content:opt});//增加简易的使用方法，如果直接传字符串则弹出字符串
var content = opt.message || opt.content || '',
botton = opt.botton || 'Y',
customBtnHtml = opt.customBtnHtml || '',
bottonText = opt.bottonText || "关 闭",
contentAlign = opt.contentAlign || "",//配置内容的对齐方式：tac居中对齐，tal左对齐，tar右对齐
bottonCallback = opt.bottonCallback || "",
focusOn = opt.focusOn || "",
autoHeight = opt.autoHeight || "",
mainContent = 
'<div class="d_c_m '+contentAlign+'">'+content+'</div>' +
(botton == 'Y' ? '<div class="tac">'+customBtnHtml+'<a id="pa_ui_dialog_btn_one" '+ (bottonCallback ? '' : 'onclick="$.paui.dialog.close();return false;') + '" class="sys_btn ch">'+bottonText+'</a></div>' : '');
var height,width;
if(opt.size){
width=opt.size[0]
height=opt.size[1]
}
var hasBtnMore = Boolean(opt.btnMore);
var btnMore = $.extend({
textL : "确 定",
textR : "取 消",
cssL : "",
cssR : "",
cssWrap : "",
funL : function(){},
funR : function(){}
}, (opt.btnMore || {} ));
if(hasBtnMore){
mainContent = '<div class="d_c_m">'+content+'</div>' +
'<div class="tac">'+
'<div id="pa_ui_dialog_btn_more_wrap" class="m_0a w200 dsn" style="'+btnMore.cssWrap+'">'+
'<a id="pa_ui_dialog_btn_more_l"  class="sys_btn ch fl" style="margin-right:20px;'+btnMore.cssL+'">'+btnMore.textL+'</a>'+
'<a id="pa_ui_dialog_btn_more_r"  class="sys_btn ch fl" style="'+btnMore.cssL+'">'+btnMore.textR+'</a>'+
'</div>'+
'</div>';
}
$.paui.dialog.close();
$.paui.dialog.open({
title : opt.title || '温馨提示',
height : height || 200, 
width : width || 350, 
message : opt.content ? mainContent : "\u3000" ,
url : opt.url || null ,
close: opt.close || function(){
focusOn && $(focusOn).length>0 && $(focusOn).is(":text:visible") && !$(focusOn).is(":disabled") && $(focusOn).focus();
},
beforeClose: opt.beforeClose || function() {}
});
$(".pa_ui_dialog").bgIframe();
if(bottonCallback){
$("#pa_ui_dialog_btn_one").bind("click", function(){
var returnValue = bottonCallback();
if(typeof(returnValue) === "boolean" && returnValue===false){
return;
}
$.paui.dialog.close();
});
}
if(hasBtnMore){
$("#pa_ui_dialog_btn_more_l").bind("click", function(){
var returnValue = btnMore.funL();
if(typeof(returnValue) === "boolean" && returnValue===false){
return;
}
$.paui.dialog.close();
});
$("#pa_ui_dialog_btn_more_r").bind("click", function(){
var returnValue = btnMore.funR();
if(typeof(returnValue) === "boolean" && returnValue===false){
return;
}
$.paui.dialog.close();
});
$("#pa_ui_dialog_btn_more_wrap").show();
}
var addHeight = botton=='Y' ? 50 : 0;
autoHeight && _this.adjustDialogHeight(autoHeight==true?addHeight:autoHeight);
},


/**
* 自适应弹出对话框高度
*/
adjustDialogHeight : function(addHeight){
addHeight = addHeight || 0;
var hCeiling = $('.pa_ui_dialog_content').children().height();
$('.pa_ui_dialog').height(hCeiling+addHeight+85).find('.pa_ui_dialog_content').height(hCeiling+addHeight+50);
//$('.pa_ui_dialog').height(hCeiling+addHeight);
},


/**
* 遮罩层防止触发页面上其它事件
*/
showModal : function(flag,opt){
opt = opt || {};
var heightLight = opt.heightLight || false;
var bgiframe = opt.bgiframe==false ? false : true;
var opacityClass = heightLight ? "_transparentHalf" : "_transparentFull";
flag = flag || "show";
if(flag == 'hide'){
$('#_bgModal').hide();
}else{
var bgHeight = document.documentElement.clientHeight;
var bgWidth = (document.body.clientHeight < document.documentElement.offsetHeight-4) ? document.body.clientWidth-17 : document.body.clientWidth;
$('#_bgModal').length==0 && $('<div id="_bgModal" />').appendTo('body').attr("class","_bgModal "+opacityClass);
$('#_bgModal').height(bgHeight).width(bgWidth).show();
bgiframe && $('#_bgModal').bgiframe();
if($.browser.msie && $.browser.version=="6.0"){//修复IE6下无故样式失效的问题，恶心。。。
var bgColor="#FFF", cssOpacity=0, filterOpacity=0;
if(heightLight){
bgColor = "#333";
cssOpacity = 0.5;
filterOpacity = 50;
}
$('#_bgModal').css({width:bgWidth+'px',height:bgHeight+'px', position:'absolute',left:0,top:0,backgroundColor:bgColor,visibility:'visible',zIndex:9999,opacity:cssOpacity,backgroundImage:"url(about:blank)", backgroundAttachment:"fixed",filter:'Alpha(opacity='+filterOpacity+')'});
}
}
return $('#_bgModal');
},


/**
* 显示隐藏正在提交
*/
showLoading : function(dom, flag, opt){
var _this = this;
opt = opt || {};
var loadingText = opt.text || "正在提交，请稍候...";
var loadDiv = $("#_btnSubmitOrAjaxLoading");


if(dom.is(":hidden")){
return ;
}
if(dom.length > 0){
if(flag == "hide"){
loadDiv.hide(); 
_this.showModal('hide');
return;
}
var pos = dom.offset();
var cssTop = pos.top + dom.height() + 'px';
var cssLeft = pos.left;
if(opt.position && opt.position=="left"){
cssTop = pos.top + (dom.height()-16)/2 + 'px' ;
cssLeft = pos.left + dom.width() + 'px';
}
if(loadDiv.length == 0){
$('<div id="_btnSubmitOrAjaxLoading" >'+loadingText+'</div>').appendTo("body");
loadDiv = $("#_btnSubmitOrAjaxLoading");
}
loadDiv.css({top:cssTop, left:cssLeft, width:opt.width||"150px"}).text(loadingText).show();
$.browser.msie && $.browser.version=="6.0" && loadDiv.css({position:"absolute", paddingLeft:"20px", lineHeight:"16px", background:"url("+window.gSysName+"/common/images/loading.gif) no-repeat"});
_this.showModal('show',opt);
}
},


/**
* 跳转至错误页面
* @data类似{errorMsg:"***", errorCode:"001"} json格式的参数 
*/
toError : function(data){
var params = data || {};
params.flatFlag = window.renewlFlag ? "renewal" : "apply";
params.errorFlowId = common.flowId;
params.comeFrom = common.comeFrom;
params.productUrl = common.productUrl;
params.paUrl = common.paUrl;
strParams = $.param(params);
parent!=window && typeof parent.cancelDoDeforeUnload == "function" && parent.cancelDoDeforeUnload();
window.location.replace(common.sysName+'/error.html?'+strParams);
},
/**
* 隐藏正在提交
*/
hideLoading : function(){
common.showLoading($("body"),"hide");
},
/**
* modelAjax
*/
modelAjax : function(option, model){
var opt = {};
opt.type = option.type || "GET";
opt.url = option.url || model.url;
opt.async = typeof(option.async)=="boolean" ? option.async : true;
opt.dataType = option.dataType || "json";
option.data && (opt.data=option.data);
option.success && (opt.success=option.success);
option.error && (opt.error=option.error);
option.beforeSend && (opt.beforeSend=option.beforeSend);
option.complete && (opt.complete=option.complete);
$.ajax(opt);
},
/**
* 转换性别code和name
*/
getSexName : function(sex){
switch(sex){
case "F" : return "女"
case "M" : return "男"
default : return ""
}
},
/**
* 转换证件类型code和name
*/
getIdType : function(typeCode){
switch(typeCode){
case "01" : return "身份证"
case "02" : return "护照"
case "03" : return "军官证"//士兵证
case "06" : return "港澳回乡证或台胞证"
default : return "其他"
}
},

//判断今天是否在某个时间区间内
timeLimit : function(arr){//["2013-09-01","2013-10-31"]true在区间内
var oTodayMS = new Date();
var sBeginDay = arr[0] || "";
var sEndDay = arr[1] || "";
if(!sBeginDay || !sEndDay){
return false;
}
var oBeginDate = common.date.byStr(sBeginDay);
var oEndDate = common.date.byStr(sEndDay);
var oEndDate24 = new Date(oEndDate.getFullYear(), oEndDate.getMonth(), oEndDate.getDate()+1);
if(Date.parse(oTodayMS)>=Date.parse(oBeginDate) && Date.parse(oTodayMS)<Date.parse(oEndDate24)){
//以["2013-09-01","2013-10-31"]为例系统时间>=09-01 00:00
且  系统时间<10-31 24:00
return true;
}
return false;
},


//往数字前面加零
formatNumBit : function(num, bit){
if( isNaN(Number(num)) ){
return null;
}
bit = bit || 2;//默认转换成两位数
var creat0 = function(count){
var str = "";
for (var i = 0; i < count; i++) {
str += "0";
};
return str;
};
var sTemp = String(num);
if(sTemp.length < bit){
return creat0(bit-sTemp.length)+sTemp;
}
return sTemp;
},
//电销,陆金所过来的单要隐藏暂存按钮
hiddeSaveButton : function(mediaSource){
if("ITS-PA18"==mediaSource||"PA18-LJS"==mediaSource){
$('#saveBtn').hide();
}else{
$('#saveBtn').show();
}
}
};




/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
common.sys = {
/**
* 预加载相关图片
* 解决IE6下动态生成的html代码中要加载的图片第一次可能因为网络原因加载不上的问题，故页面开始就将这些图片预加载到隐藏的img标签中。
* 注意：如果以后还有其他是JS里面动态设置html或css从而动态加载图片的情况，则请将对应图片加进去，不然IE6第一次进来很可能加载不到而显示不出来。
*/
preLoadingImg : function(){
var _this = this;
var resUrl = common.sysName;
var imgHtml = '<div id="imgHtmlPreLoadingWrap" style="display:none;">'+
'<img src="'+resUrl+'/common/images/close.gif">'+
'<img src="'+resUrl+'/common/images/loading.gif">'+
'<img src="'+resUrl+'/common/images/continue.gif">'+
'<img src="'+resUrl+'/common/images/control/pa_ui_images.gif">'+
'<img src="'+resUrl+'/common/images/icon/icon04.gif">'+
'</div>'
$("body").append(imgHtml);
},


//比较被保人信息
compareInsInfo : function(oIns, oOther, exclude){
var flag = true;
exclude = exclude || "";
$.each(oIns, function(oKey, oItem){
if(exclude.indexOf(oKey)==-1 && typeof(oOther[oKey])!="undefined"){//要比较的对象也有对应字段
if(oItem != oOther[oKey]){
flag = false;
return false;
}
}
});
return flag;
},

//判断被保人是否为空
isEmptyIns : function(oIns, exclude, include){
var flag = true;
exclude = exclude || "";
var defaultInclude = 'insurantName,birthYear,birthMonth,birthDay,certificateType,certificateNumber,mobileTelephone';//当include为true时默认比较的字段
$.each(oIns, function(oKey, oItem){
if(exclude.indexOf(oKey)==-1 && oItem){//不是需排除字段且字段值为真
if(include){//配置只需要比较的字段时
if(typeof(include) == 'boolean' && include==true && defaultInclude.indexOf(oKey)!=-1
|| typeof(include) == 'string' && include.indexOf(oKey)!=-1){//当include为string时比较的字段
flag = false;
return false;
}
}else{
flag = false;
return false;
}
}
});
return flag;
},


/**
* 服务器ajax请求错误统一处理
*/
ajaxError : function(){
$.ajaxSetup({
error : function(request,status,error){
try{
var request = (new Function('return '+request.responseText))();
switch(request.errorCode){
case 555:
//弹出服务器内部错误 
common.showMsg({content : decodeURIComponent(request.errorMsg)});
break;
case 560:
//session超时
common.showMsg({content : decodeURIComponent(request.errorMsg)});
break;
default :
common.showMsg({content : decodeURIComponent(request.errorMsg)});
break;
}
//common.showLoading($("body"),"hide");
}catch(e){}
} 
  });
},


/**
* 保持流程，每30秒发一次
*/
keepFlow : function(flowid){
return setInterval(function(){
$.ajax({
url : common.sysName+"/do/keep-flow-ctx.do?flowId="+flowid,
dataType:"json",
success:function(data){
if(data.resultCode!="0"){
common.toError({errorTips:"keepFlowFauluire"});
//common.showMsg("系统发生错误，请稍候再试!")
}
},
error:function(){
common.toError({errorTips:"keepFlowError"});
//common.showMsg("系统发生错误，请稍候再试!")
}
});
},30000);
},

/**
* 启动session超时计时
*/
sessionTimeoutStart : function(flowid,notFirstTime){
var _this = this;
window.toTimeoutPageId = setTimeout(function(){//启动会话超时计时，并保存该计时ID,30分钟 30*60*1000=1800000
common.toError({errorCode:"001"});
},1800000);
window.tipToUserTimeout = setTimeout(function(){//25分钟 25*60*1000=1800000 时弹出提示，用户不关闭提示，则5分钟后跳转到超时页面
common.showMsg({
content : '由于您长时间未进行操作，页面即将超时。请点击“继续”以继续操作完成投保。',
bottonText : '继 续',
beforeClose : function(){
clearTimeout(toTimeoutPageId);
_this.sessionTimeoutStart(flowid,true);
}
});
},1500000);
if(!notFirstTime){
//启动保持流程计时器
_this.keepFlow(flowid)
//用户点击了页面，清除两个之前的计时器，重新计时
$("body").bind("click",function(){
clearTimeout(toTimeoutPageId);
clearTimeout(tipToUserTimeout);
_this.sessionTimeoutStart(flowid,true);
});
}
}
};




/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/**
* 校验类
*/
common.validate = {
//后台关于被保人模板上传的相关校验位于ImportClientInfoUtil.java文件中
//日期校验正则表达式
regDate : /^(((((1[6-9]|[2-9]\d)\d{2})-(0?[13578]|1[02])-(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})-(0?[13456789]|1[012])-(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))-0?2-29)))?$/,
regCharacter  : /^\w*$/, //字符(字母|数字|下划线)
regDoubChar  : /^[^\x00-\xff]*$/, //双字节字符(包括汉字在内)
regCh : /^([\u4e00-\u9fa5])*$/,//中文
regEn : /^([a-zA-Z])*$/,//英文字母
regNum  : /^\d*$/, //数字
regBlank  : /^\s*$/, //空格
regNumEn : /^[a-zA-Z\d]*$/,//字母|数字
regChEn : /^([\u4e00-\u9fa5]|[a-zA-Z])*$/,//中文|字母
regChEnNum : /^([\u4e00-\u9fa5]|[a-zA-Z\d])*$/,//中文|字母|数字
regEnNumKuo  : /^([a-zA-Z\d]|[])*$/, //字母|数字|()
regITSMobilePhone: /^((13|14|15|18)\d{1}([0-9]{4}|[*]{4})\d{4})?$/,//13|14|15|18打头的11位数字
regMobilePhone: /^((13|14|15|18)\d{9})?$/,
//13|14|15|18打头的11位数字
regEmail  : /^[\w\-\.]+@[a-zA-Z0-9]+(\-[a-zA-Z0-9]+)?(\.[a-zA-Z0-9]+(\-[a-zA-Z0-9]+)?)*\.[a-zA-Z]{2,4}$/,//emial
regNameOld  : /^([\uFF0E\uFF07\uFF0F\,\.\·\•\'\/\uFF0D\u0391-\uFFE5-]{2,25}|[\uFF0C\uFF0E\uFF07\uFF08\uFF09\uFF0F\,\.\·\•\'\/\uFF0DA-Za-z\s-]{4,50})$/,//姓名-之前的规则
regNameNew  : /^([a-zA-Z\u4e00-\u9fa5\s\.\·\267\•\/]{2,38}|[a-zA-Z\s\.\/]{4,38})*$/,//姓名-中文空格()/.· 或 英文空格/.
regName  : /^([\u4e00-\u9fa5\s]|[a-zA-Z]|[\.])$/,//中文|空格|字母|"."
regNameEmt  : /[a-zA-Z]{2,20}|[\u4e00-\u9fa5]{2,10}/,//谁TM写的养老险的正则？不管了，先原班过来吧
regNameSpell  : /^[^\u4e00-\u9fa5]*$/, //姓名拼音 非中文
regPostCode  : /(^\d{6}$)/, //邮政编码
regAreaCode  : /(0[0-9]{2,3})/, //固定电话 - 区号
regTelephone  : /(^\d{6,8}$)/, //邮政编码 - 号码
regCargoName : /^([0-9a-zA-Z\u4e00-\u9fa5]{2,50})*$/,  //货物名称最多输入50个字符，只能是中文、英文、数字
regAddress  : /^([\u4e00-\u9fa5]|[a-zA-Z\d]|[\.\（\）\-\#])*$/,//中文|字母|数字|(|)|（|）|-|#
regNamePost  : /^([\uFF0E\uFF07\uFF0F\,\.\·\•\'\/\uFF0D\u0391-\uFFE5-]{2,10}|[\uFF0C\uFF0E\uFF07\uFF08\uFF09\uFF0F\,\.\·\•\'\/\uFF0DA-Za-z\s-]{4,10})$/,

/**
* 把输入的字符串转换为半角 常用于校验之前调用如我们项目的校验框架option里面可加这样的配置项 beforeValid:'common.validate.toDBC',
* 输入: Str    任意字符串 
* 输出: DBCStr 半角字符串 
* 说明: 1、全角空格为12288，半角空格为32 
* 2、其他字符半角(33-126)与全角(65281-65374)的对应关系是：均相差65248 
*/ 
toDBC : function(obj){
if(!obj) return true;
var eObj = $(obj)
objValue = eObj.val();
if(!objValue) return true;
var DBCStr = "";
for(var i=0; i<objValue.length; i++){
var c = objValue.charCodeAt(i);
if(c == 12288) {
DBCStr += String.fromCharCode(32);
continue;
}
if (c > 65280 && c < 65375) {
DBCStr += String.fromCharCode(c - 65248);
continue;
}
DBCStr += String.fromCharCode(c);
}
DBCStr = $.trim(DBCStr);//这里是去除首尾空格，看项目具体的需求是否要去空格
//DBCStr = DBCStr.toUpperCase();//这里是转换成大写字母，看项目具体是否要转大写
eObj.val(DBCStr);
return true;
},

/**
* 滚动屏幕到第一个校验错误元素
*/
scrollToError : function(){
var eObj = $(".pa_ui_validator_onerror:visible:eq(0)");
var eDailog = $(".pa_ui_dialog:visible:eq(0)");
if(eObj.length>0 && eDailog.length<1){
//有错误提示且无弹出框提示，则定位到错误元素
var offsetTop= eObj.offset().top;
top.scroll(0,(offsetTop-50));
}
},


/**
* 核对姓名
*/

appName : function(obj) {
var _this = this;
var msg = "姓名只能由2-19位中文或4-38位英文组成，请正确填写";
if(obj == null) return true;
var objValue = obj.value;
var newValue = objValue;
//if(objValue.byteLength()>objValue.length){//如果有汉字 则直接去除所有空格
// newValue = objValue.replace(/\s/g,"");
//}else{//如果是英文则去除连续空格
// newValue=objValue.trim().replace(/\s\s*/g," ");
//}
newValue=$.trim(objValue).replace(/\s\s*/g," ");
newValue = newValue.replace(/\•/g,"\267");//看是否需要将•替换成·以免后台接收是乱码
objValue!=newValue && (obj.value=newValue);
if(newValue.byteLength()==newValue.length){//不包含汉字
if(newValue.indexOf("(")>-1 || newValue.indexOf(")")>-1 || newValue.indexOf("\267")>-1){
return msg;
}
var bChar=newValue.charAt(0), eChar=newValue.charAt(newValue.length-1);
if(bChar=="/" || bChar=="." || eChar=="/" || eChar=="."){
return msg;
}
}
if(!_this.regNameNew.test(newValue)){
return msg;
}
if(!_this.byteLengthCheck(newValue,4,38)){
return msg;
}
if(newValue=="abcd" || newValue=="abcde"){
//return "姓名不能为abcd或abcde";
return "姓名填写不符合规范，请正确填写";
}
var invailidStrArr = ["不详", "不祥", "未知", "不知道"];
//var invailidStrArr = ["不详","不祥","未知","不知道","没有","不清楚"];
for(var i=0;i<invailidStrArr.length;i++){
if(objValue.indexOf(invailidStrArr[i])>=0){
return "姓名填写不符合规范，请正确填写";
//return "姓名不能包含不详、不祥、未知、不知道等非法内容";
}
}
return true;
},


/*
* 
*/
checkname : function(value, elm){
var regs = {  
v0:/^[\uFF0E\uFF07\uFF0F\,\.\·\•\'\/\uFF0D\u0391-\uFFE5-]{2,25}$/,
v1:/^([\uFF0E\uFF07\uFF0F\,\.\·\•\'\/\uFF0D\u0391-\uFFE5-])+$/,
e1:/^[\uFF0C\uFF0E\uFF07\uFF08\uFF09\uFF0F\,\.\·\•\'\/\uFF0DA-Za-z\s-]+$/,
e0:/^[\uFF0C\uFF0E\uFF07\uFF08\uFF09\uFF0F\,\.\·\•\'\/\uFF0DA-Za-z\s-]{4,50}$/,
d0:/^([\u4e00-\u9fa5]|[a-zA-Z])*$/
};
if($.trim(value)==""){
return true;
}
if(value.indexOf('#')>-1){
return "姓名填写不能含有#，请正确填写。";
}
if(value.indexOf('*')>-1){
return "姓名填写不能含有*，请正确填写。";
}  
if (/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
if(/.*[a-zA-z]+.*$/.test(value)){
if(!regs.v0.exec(value)){
return "姓名填写不能中英文混合输入，请正确填写。";
}
}
if(!regs.v1.exec(value)){
return "1.姓名只能由2-25位中文组成    2.姓名只能由4-50位英文组成";
}
if(!regs.v0.exec(value)){
return "姓名只能由2-25位中文组成，请正确填写。";
}
}else if(/.*[a-zA-z]+.*$/.test(value)){
if(!regs.e1.exec(value)){
return "1.姓名只能由2-25位中文组成    2.姓名只能由4-50位英文组成";
}
if(!regs.e0.exec(value)){
return "姓名只能由4-50位英文组成，请正确填写。";
}
}else{
return "1.姓名只能由2-25位中文组成    2.姓名只能由4-50位英文组成";
}
//最后调用公共的完整的正则验证下
if(!this.regNameOld.test(value)){
return "姓名只能由2至25位中文或4至50位英文字符构成,请正确填写";
}
return true;
},


/**
* 核对收件人详细地址
*/
postAddress:function(value, elm){
if(!this.byteLengthCheck(value,1,140)){
return "详细地址只能由1至140位字符组成（汉字占两位）";
}
return true;
},
/**
* 增加对区县的必填校验
*/
postArea : function(area, city,msg){
var eArea = area || $("#areaCode");
var eCity = city || $("#cityCode");
var eMsg = msg || "请选择收件区县";
if(eCity.is(":visible") && eArea.length>0 && eArea.is(":visible") && eArea.find("option").length>1 && eArea.val()===""){
eCity.length>0 && eCity.validator('showMessage',{isValid:false, errorMsg:eMsg});
/*window.hasBindAreaChange && eArea.bind("change", function(){
window.hasBindAreaChange = true;
eCity.length>0 && eCity.validator('showMessage',{isValid:true});
});*/
return false;
}else{
return true;
}
},

/** 
* 核对证件号码,联合证件类型校验
*/
idNo : function (idTypeValue,idValue,elm){
var _this = this;
/*emt
if(idValue == ""){
return true;
}
if(idTypeValue=='1' || idTypeValue=='6'){
elm.value=idValue.toUpperCase();
}
if(idTypeValue == '1' && _this.idCard(idValue) != true){//身份证
return _this.idCard(idValue);
}else if(idTypeValue == '2' && (!_this.regChEnNum.test(idValue) || !_this.byteLengthCheck(idValue,3,20))){//护照
return "护照格式不正确，请正确填写";
}else if(idTypeValue == '3'){//军官证/士兵证
var msg = "证件格式不正确，请正确填写";
if(_this.regNum.test(idValue)){//纯数字
if(idValue.length<4)
return msg;
else 
return true;
}
if(!_this.regChEnNum.test(idValue)){
return msg;
}else{
var indexSpe = idValue.indexOf("字第");
if(!_this.byteLengthCheck(idValue,10,20) || indexSpe<1 || indexSpe+2==idValue.length || !/^([\d]{4,})*$/.test(idValue.substring(indexSpe+2, idValue.length))){
return msg;//+", 如果不全是数字, 那么证件号中必须带有\"字第\"两字, 并且\"字第\"字符前面还至少有一个字符. 并且后面一定是4位或以上的数字, 比如:(装字第12345678)或者(12345)"
}
}
}else if(idTypeValue == '6' && (!_this.regEnNumKuo.test(idValue) || !_this.byteLengthCheck(idValue,8,20))){//港澳台回乡证或台胞证
return "证件格式不正确，请正确填写";
}else if(!_this.byteLengthCheck(idValue,3,20)){//默认
return "证件格式不正确，请正确填写";
}
return true;
*/
if(idValue == ""){
return true;
}
var msg = '证件号码不符合规范，请正确填写.';
if(idTypeValue == '01' && _this.idCard(idValue) != true){//身份证
return _this.idCard(idValue);
}else if(idTypeValue == '02' && !_this.byteLengthCheck(idValue,3,18)){//护照
return msg;
}else if(idTypeValue == '03' && !_this.byteLengthCheck(idValue,6,18)){//军官证/士兵证
return msg;
}else if(idTypeValue == '06' && !_this.byteLengthCheck(idValue,5,18)){//港澳台回乡证或台胞证
return msg;
}else if(!_this.byteLengthCheck(idValue,1,18)){//默认
return msg;
}
return true;
},


/**
* 严格的身份证号码校验
*/
idCard : function (idcard) {
idcard = idcard.toUpperCase();
var Errors = [
true,
"身份证号码位数不对，请正确填写。",
"身份证号码出生日期超出范围或含有非法字符，请正确填写。",
"身份证号码校验错误，请正确填写。",
"身份证号码地区非法，请正确填写。",
"身份证号码出生日期只能在当前日期之前!"
];
var area = {
11: "\u5317\u4eac",12: "\u5929\u6d25",
13: "\u6cb3\u5317",14: "\u5c71\u897f",
15: "\u5185\u8499\u53e4",21: "\u8fbd\u5b81",
22: "\u5409\u6797",23: "\u9ed1\u9f99\u6c5f",
31: "\u4e0a\u6d77",32: "\u6c5f\u82cf",
33: "\u6d59\u6c5f",34: "\u5b89\u5fbd",
35: "\u798f\u5efa",36: "\u6c5f\u897f",
37: "\u5c71\u4e1c",41: "\u6cb3\u5357",
42: "\u6e56\u5317",
43: "\u6e56\u5357",44: "\u5e7f\u4e1c",
45: "\u5e7f\u897f",46: "\u6d77\u5357",
50: "\u91cd\u5e86",51: "\u56db\u5ddd",
52: "\u8d35\u5dde",53: "\u4e91\u5357",
54: "\u897f\u85cf",
61: "\u9655\u897f",62: "\u7518\u8083",
63: "\u9752\u6d77",64: "\u5b81\u590f",
65: "\u65b0\u7586",71: "\u53f0\u6e7e",
81: "\u9999\u6e2f",82: "\u6fb3\u95e8",
91: "\u56fd\u5916"
};
var Y, JYM;
var S, M;
var idcard_array = new Array();
idcard_array = idcard.split("");
if(idcard == ""){//为空
return true;
}
if (area[parseInt(idcard.substr(0, 2))] == null) {
return Errors[4];
}
switch (idcard.length) {
case 15:
if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/
} else {
ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/
}
if (ereg.test(idcard)) {
var birthYear = idcard.substr(6, 2);
var birthMonth = idcard.substr(8, 2);
var birthDay = idcard.substr(10, 2);
if(common.oServerDate){//取服务器端系统时间，没有则取客户端系统时间
var oToday = common.oServerDate;
}else{
var oTodayMS = new Date();
var oToday = new Date(oTodayMS.getFullYear(), oTodayMS.getMonth(), oTodayMS.getDate());
}
var oUserBirth = new Date(birthYear, parseInt(birthMonth,10) - 1, birthDay);
if((Date.parse(oUserBirth)-Date.parse(oToday)) >= 0){
return Errors[5];
}
return Errors[0];
}else {
return Errors[2];
}
break;
case 18:
if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/
} else {
ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/
}
if (ereg.test(idcard)) {
S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
Y = S % 11;
M = "F";
JYM = "10X98765432";
M = JYM.substr(Y, 1);
if (M == idcard_array[17]) {
var birthYear = idcard.substr(6, 4);
var birthMonth = idcard.substr(10, 2);
var birthDay = idcard.substr(12, 2);
if(common.oServerDate){
var oToday = common.oServerDate;
}else{
var oTodayMS = new Date();
var oToday = new Date(oTodayMS.getFullYear(), oTodayMS.getMonth(), oTodayMS.getDate());
}
var oUserBirth = new Date(birthYear, parseInt(birthMonth,10) - 1, birthDay);
if((Date.parse(oUserBirth)-Date.parse(oToday)) >= 0){
return Errors[5];
}
return Errors[0];
} else {
return Errors[3]
}
} else {
return Errors[2];
}
break;
default:
return Errors[1];
break;
}
return true
},

/** 
* 校验是否为整数型字符串
*/
isInteger : function (str){
Val = $.trim(str);
myRegExp = /^([0-9]+)$/;
return (myRegExp.test(Val))
},

/** 
* 校验出生日期
*/
birthDate : function (oBirthYear,oBirthMonth,oBirthDay,dFilterMask){
var birthYear = oBirthYear.val();
var birthMonth = oBirthMonth.val();
var birthDay = oBirthDay.val();
if(birthYear && birthMonth && birthDay &&  common.oServerDate && common.validate.regDate.test(birthYear + "-" + birthMonth + "-" +birthDay)){
var oToday = common.oServerDate;
var oUserBirth = new Date(birthYear, parseInt(birthMonth,10) - 1, birthDay);
if((Date.parse(oUserBirth)-Date.parse(oToday)) >= 0){
return '出生日期只能在当前日期之前，请修改。'
}
}
if(dFilterMask == "year"){
if(birthYear == ""){
return true;
}
if(common.validate.isInteger(birthYear)){
if(birthYear.length == 4){
if(birthYear < 1900){
return '生日年份不能小于1900年，请修改。';
}
return true;
}
return '年份输入有误，请修改。如:2008。';
}
return '年份输入有误，请修改。如:2008。';
} else if (dFilterMask == "month"){
if(birthMonth == ""){
return true;
}
if(common.validate.isInteger(birthMonth)){
if(birthMonth <= 12 && birthMonth >0){
if(birthMonth.length == 1){
oBirthMonth.val("0"+birthMonth);
return true;
}else if(birthMonth.length !=2){
return '月份输入有误，请修改成1到12的范围内。';
}
return true;
}
return '月份输入有误，请修改成1到12的范围内。';
}
return '月份输入有误，请修改成1到12的范围内。';
}else if(dFilterMask == "day"){
if(birthDay == ""){
return true;
}
if(birthYear =="" || birthMonth == ""){
//return '日期不能为空！';
return true;
}else{
if(common.validate.isInteger(birthDay)){
if(birthDay <= common.date.daysInMonth(birthYear,birthMonth) && birthDay>0){
if(birthDay.length == 1){
oBirthDay.val("0"+birthDay);
return true;
}else if(birthDay.length != 2){
return '日期输入有误，请修改。如:01或1。';
}
return true;
}
return '日期输入有误，请修改。如:01或1。';
}
return '日期输入有误，请修改。如:01或1。';
}
}
},

/**
* 校验字符字节长度
*/
byteLengthCheck : function(str,minlen,maxlen) {
if (str == null) return false;
var l = str.length;
var blen = 0;
for(i=0; i<l; i++) {
if ((str.charCodeAt(i) & 0xff00) != 0) {
blen ++;
}
blen ++;
}
if (blen > maxlen || blen < minlen) {
return false;
}
return true;
},

/**
* 用途：检查输入字符串是否为空或者全部都是空格
* 输入：str
* 返回：如果全是空返回true,否则返回false
*/
isEmpty : function (str){
if(str == "") return true;
var regu = "^[ ]+$";
var re = new RegExp(regu);
return re.test(str);  
},

/**
* 去除姓名中所有空格、数字
*/
trimNameMethod : function(nameEle){
var name = nameEle.value;
var reg=/\s+/g;
var numreg = /[\d]/g;
name = name.replace(reg,"")
name = name.replace(numreg,""); 
nameEle.value = name;
},


/**
* 去除页面文本输入域中文本内容包含的所有空格
*/
trimTextValue : function(TextEle){
var text = TextEle.value;
var reg=/\s+/g;
text = text.replace(reg,"")
TextEle.value = text;
}
};




/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/*******************
* 日期处理相关
********************/
common.date = {
/**
* 是否闰年
*/
isLeapYear : function(iYear){
return ((iYear % 4 == 0) && ((iYear % 100 != 0) || (iYear % 400 == 0)));
},

/**
* 某一年的某个月有多少天
*/
daysInMonth : function(theYear, theMonth){
var _this = this;
    var dayCountArray = new Array(0,31,-1,31,30,31,30,31,31,30,31,30,31);
    if (Number(theMonth) != 2){
return dayCountArray[Number(theMonth)];
}
    if (_this.isLeapYear(Number(theYear))){
         return 29;
}
    return 28;
},

/**
* 获取增加或减少多少月后的新日期
*/
dateAddMonth : function(oDate,monthsIncrement){
if(oDate){
return new Date(oDate.getFullYear(), oDate.getMonth()+monthsIncrement, oDate.getDate());
}
return null;
},

/**
* 获取增加或减少多少天后的新日期
*/
dateAddDay : function(date,daysIncrement){
if(typeof(date)=="object"){
return new Date(date.getFullYear(), date.getMonth(), date.getDate()+daysIncrement);
}else if(typeof(date)=="string"){
var oD = this.byStr(date);
var aD = new Date(oD.getFullYear(), oD.getMonth(), oD.getDate()+daysIncrement);
var res = this.toStr(aD) || null;
return res;
}
},

/**
* 日期格式化为标准的####-##-##格式,同时如果传了某元素，则将值更新到该元素上
*/
dateFormat : function(sDateString,jqueryObj){
var _this = this;
if(_this.dateCheck(sDateString)){
var oDate = _this.byStr(sDateString);
var sNewDateString = _this.toStr(oDate);
jqueryObj && jqueryObj.val(sNewDateString);
return sNewDateString;
}
return null;
}, 

/**
* 检测日期字符串是否正确
*/
dateCheck : function(sDateString){
if(common.validate.regDate.test(sDateString)){
return true;  
}
return false;
},

/**
* 将####-##-##格式的日期字符串转化为日期对象
*/
byStr : function(sDateString){
if(this.dateCheck(sDateString)){
var arrDateSplit = sDateString.split("-");
var oNewDate = new Date(arrDateSplit[0],arrDateSplit[1]-1,arrDateSplit[2],0,0,0,0);
return oNewDate;
}
return null;
},

/**
* 将日期对象转化为指定格式的日期字符串,默认格式为####-##-##
*/
toStr : function(oDate,sFormat){
var format = sFormat ? sFormat: "-";
if(oDate){
var iYear = oDate.getFullYear();
var iMonth = oDate.getMonth() + 1;
var iDay = oDate.getDate();
if(iMonth < 10){
iMonth = "0" + iMonth;
} 
if(iDay < 10){
iDay = "0" + iDay;
} 
return (iYear + format + iMonth + format + iDay);
}
return null;
},

/**
* 将分散的年、月、日组装成####-##-##格式的日期字符串
*/
dateStrsToString : function(strYear,strMonth,strDay){
if(strYear && strMonth && strDay){
if(String(strYear).length == 2){//年份为2个字符，则自动在前面加19
strYear = "19" + strYear;
}
if(parseInt(strMonth) < 10){//月份为1个字符，则自动在前面加0
strMonth = "0" + strMonth;
} 
if(parseInt(strDay) < 10){//日子为1个字符，则自动在前面加0
strDay = "0" + strDay;
}
var strDate = strYear + "-" + strMonth + "-" + strDay;
if(this.dateCheck(strDate)){//检测下日期是否为规范化的日期
return strDate;
}
}
return null;
},

/**
* 将日期以指定分隔符分割，并返回日期数组，默认的分隔符是“-”
*/
splitDate : function(sDateString,regFormat){
format = regFormat ? regFormat: /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
var arrMatched = format.exec(sDateString);
if(arrMatched){
var arrDateString = [];
arrDateString.push(arrMatched[1]);
arrDateString.push(arrMatched[2]);
arrDateString.push(arrMatched[3]);
return arrDateString;
}
return null;
},
/**
* 计算两个字符串日期之间相差的天数
*/
daysBetween : function(day1,day2,splitFormat){
if(typeof day1 == 'string' && typeof day2 == 'string'){
splitFormat = splitFormat ? splitFormat: "-";
var arrD1 = day1.split(splitFormat);
var arrD2 = day2.split(splitFormat);
if(arrD1 && arrD2){
var oDay1 = new Date(arrD1[0],arrD1[1] - 1,arrD1[2]);
var oDay2 = new Date(arrD2[0],arrD2[1] - 1,arrD2[2]);
var days = (oDay1.getTime() - oDay2.getTime())/(1000*60*60*24);
return days;
}
}
},


/**
* 根据出生年月日获取相对于保险起期的年龄数组
*/
getAgeArray : function(birth,beginDate){//getAgeArray("2010-12-08","2012-11-05") === [2,-1,-3]
var arrContractBeginDate = beginDate.split('-');
var oContractBeginDate = new Date(parseInt(arrContractBeginDate[0],10),parseInt(arrContractBeginDate[1],10),parseInt(arrContractBeginDate[2],10));
var iContractBeginYear = oContractBeginDate.getFullYear();
var iContractBeginMonth = oContractBeginDate.getMonth();

var arrBirthdaySelect = birth.split("-");
var birthdaySelect = new Date(parseInt(arrBirthdaySelect[0],10),parseInt(arrBirthdaySelect[1],10),parseInt(arrBirthdaySelect[2],10));
var iAge = iContractBeginYear - parseInt(arrBirthdaySelect[0],10);
var iMonth = iContractBeginMonth - parseInt(arrBirthdaySelect[1],10);
var iDay = oContractBeginDate.getDate() - parseInt(arrBirthdaySelect[2],10);
var ageArray = [];
ageArray.push(iAge);
ageArray.push(iMonth);
ageArray.push(iDay);
return ageArray;
},

/**
* 根据出生年月日获取相对于指定日期的年龄，默认是相对于今天
*/
getAge : function(birthYear,birthMonth,birthDay,beginDate){
var today = beginDate ? this.byStr(beginDate) : new Date();
var gDate = today.getDate(),
gMonth = today.getMonth(),
gYear = today.getYear();

if(gYear < 2000){
gYear += 1900;
}
var age = gYear - birthYear;
if((birthMonth == (gMonth + 1)) && (birthDay <= parseInt(gDate))){
age = age;
}else{
if(birthMonth <= (gMonth)){
age = age;
}else{
age = age - 1;
}
}
if (age == 0){
age = age;
}
if((birthMonth == (gMonth + 1)) && (birthDay == gDate)){
age = age - 1;
}
return age;
},

////日期对比等限制 养老险规则
limit : function(initDate, min, max, min_flag, max_flag){
var d=getDate(initDate);

var max_t=max.charAt(max.length-1);
var min_t=min.charAt(min.length-1);

function getNum(str) {
return parseInt(str.substr(0,str.length-1));
}
function getDate(str) {
if(str == null) return null;
return common.date.byStr(str);
}
function getYear(dDate){
if(dDate == null) return null;
return dDate.getFullYear();
}
function getMonth(dDate) {
if(dDate == null) return null;
return dDate.getMonth();
}
function getDay(dDate) {
if(dDate == null) return null;
return dDate.getDate();
}

var now_y_c = getYear(d);
var now_m_c = getMonth(d);
var now_d_c = getDay(d);

this.getAgeByYear=function(dstr){
var date=getDate(dstr);
if(date == null) return null;
var birth_y_c = getYear(date);
var birth_m_c = getMonth(date);
var birth_d_c = getDay(date);
var y_c = now_y_c - birth_y_c;
var m_c = now_m_c - birth_m_c;
var d_c = now_d_c - birth_d_c;
if(d_c < 0) m_c--;
if(m_c < 0) y_c--;
return y_c;
}
this.getAgeByMonth=function(dstr){
var date=getDate(dstr);
if(date  == null) return null;
var birth_y_c = getYear(date);
var birth_m_c = getMonth(date);
var birth_d_c = getDay(date);
var y_c = now_y_c - birth_y_c;
var m_c = now_m_c - birth_m_c;
var d_c = now_d_c - birth_d_c;
var m_c_tmp = 0;
if(y_c > 0) {
var m_c_tmp = y_c * 12;
}
if(d_c < 0) m_c--;
return m_c + m_c_tmp;
}
this.getAgeByDay=function(dstr){
var date=getDate(dstr);
if(date == null) return null;
var startLong = date.getTime();
var endLong = d.getTime();
var day = (endLong - startLong) / (1000 * 3600 * 24);
return day = day + 1;
}

this.compare1=function(dstr){
var max_flag = false;
var min_flag = false;
if(max_t == 'y') {
max_flag = this.compareYear(dstr, true);
} else if(max_t=='M'){
max_flag = this.compareMonth(dstr, true);
} else if(max_t=='d') {
max_flag = this.compareDay(dstr, true);
}
if(min_t == 'y') {
min_flag = this.compareYear(dstr, false);
} else if(min_t=='M'){
min_flag = this.compareMonth(dstr, false);
} else if(min_t=='d') {
min_flag = this.compareDay(dstr, false);
}
return max_flag && min_flag;
}
this.compareYear=function(dstr, isMaxFlag){
if(dstr == null) return false;
var age = this.getAgeByYear(dstr);
if(age == null) return false;
if(isMaxFlag) {
if(age > getNum(max)) {
return false;
} else {
return true;
}
} else {
if(age < getNum(min)) {
return false;
} else {
return true;
}
}
}
this.compareMonth=function(dstr, isMaxFlag){
if(dstr == null) return false;
var age = this.getAgeByMonth(dstr);
if(age == null) return false;
if(isMaxFlag) {
if(age > getNum(max)) {
return false;
} else {
return true;
}
} else {
if(age < getNum(min)) {
return false;
} else {
return true;
}
}
}
this.compareDay=function(dstr, isMaxFlag){
if(dstr == null) return false;
var age = this.getAgeByDay(dstr);
if(age == null) return false;
if(isMaxFlag) {
if(age > getNum(max)) {
return false;
} else {
return true;
}
} else {
if(age < getNum(min)) {
return false;
} else {
return true;
}
}
}


///////
////例:('2011-06-14','30d',true,'18y',false)2011年6月14日前18年到前30天（包括30天和18年）
// max_flag 是否包含最大临界值，min_flag 是否包含最小临界值
function get(str){
var date=new Date(d.getTime());
var t=str.charAt(str.length-1);
var num=parseInt(str.substr(0,str.length-1));
if(t=='y'){
date.setFullYear(date.getFullYear()-num);
}
if(t=='M'){
date.setMonth(date.getMonth()-num);
}
if(t=='d')date.setDate(date.getDate()-num);

return date;
}
this.max=get(max);
this.min=get(min);
this.compare2=function(dstr){
if(!(dstr))return false;
var cDay=common.date.byStr(dstr);
//alert('max_flag = '+max_flag +',min_flag = '+ min_flag+';\n'+this.max.getTime()+"<\n"+cDay.getTime()+"<\n"+this.min.getTime());
if(max_flag && min_flag)
return (this.max.getTime()<=cDay.getTime() && cDay.getTime()<=this.min.getTime()); 
else if(max_flag)
return (this.max.getTime()<=cDay.getTime() && cDay.getTime()<this.min.getTime());
else if(min_flag)
return (this.max.getTime()<cDay.getTime() && cDay.getTime()<=this.min.getTime());
else
return (this.max.getTime()<cDay.getTime() && cDay.getTime()<this.min.getTime());
}




this.compare=function(dstr){
return (typeof(min_flag)!="undefined" && typeof(max_flag)!="undefined" ? this.compare2(dstr) : this.compare1(dstr) );
}
}
};


/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
common.rum = {
oApplicantInfo : null,//投保人信息对象
arrInsurantInfos : [],//被保险人信息数组
arrSenderInfos : [],//收件人信息数组
productMessage : "",//广告offer结果
houseInfos : [],//房屋信息数组
targetUrl : "http://www.pingan.com"+window.gSysName+"/common/page/logonReturn.html",//登录注册返回url


/**
* 根据邮箱判断登录会员类型  01平安内部员工,00普通会员
*/
getCustomerType : function (email){
if(email && (email=email.toLowerCase()) && (email.lastIndexOf("@pingan.com.cn") != -1 || email.lastIndexOf("@pingan.com") != -1 || email.lastIndexOf("@paic.com.cn") != -1 || email.lastIndexOf("@pasc.com.cn") != -1 || email.lastIndexOf("@sdb.com.cn") != -1)){
return "01";
}else{
return "00";
} 
},
config:function(){
this.targetUrl = encodeURI(common.paUrl+window.gSysName+"/common/page/logonReturn.html");
},
convertIdType : function (idType){
if(!idType)
return "";
else if(idType == "1")
return "01";
else if(idType == "2")
return "02";
else if(idType == "3")
return "03";
else if(idType == "6")
return "06";
else
return "99";
},
splitDateString : function(dateString){
var arrDate = dateString.split("-");
if(parseInt(arrDate[1]) < 10){//月份为1个字符，则自动在前面加0
arrDate[1] = "0" + arrDate[1];
} 
if(parseInt(arrDate[2]) < 10){//日子为1个字符，则自动在前面加0
arrDate[2] = "0" + arrDate[2];
}
return arrDate;
},

isBirthday : function(birthday){
if(birthday){

var today = new Date();

//取服务器端系统时间，没有则取客户端系统时间
if(common.oServerDate){
today = common.oServerDate;
}


var births = birthday.split('-');
var year = Number(today.getFullYear());
var month = Number(today.getMonth())+1; 
var day = Number(today.getDate());
if(month==Number(births[1])){
return "Y";
}else{
return "N";
}


}else{
return "N";
}
},


/**
* 返回投保人信息
*/
queryApplicantInfo :function (onComplete,uid){
var _this = this;
if (typeof RumAuth != "undefined") {
RumAuth.rum.getUserInfo('isQueryUser=true',function(json){
//var json = {"resultCode":0,"user":{"email":"ex-zhangyanan001@pingan.com","uid":"800160459384","userName":"asdfddd","sex":"F","mobile":"13600197616","liveCityCode":"310100","liveProvinceCode":"310000","idType":"6","idNo":"8721654321654","birthday":"1970-5-5"}};
_this.processApplicantInfoResult(json);
_this.showUserInfo();
if(onComplete){
onComplete();
}
});
}else
return;
},


/**
*{email：邮箱，name：姓名，sex:性别，mobilePhone：手机号码，
*provinceCode：居住省份代码，cityCode：居住城市代码，
*idType：证件类型，idNo：证件号码，birthDate：生日，
*type：用户类型}
*/
processApplicantInfoResult : function (s){
var _this = this;
if(s == null || (typeof s == "string" && (s == "NOT_LOGON" || s == "OTHER_EXCEPTION" || s == ""))||s.resultCode != "0"){/**resultCode=0，用户登录成功，resultCode=1，用户登录失败，resultCode=102，未登陆，resultCode=105,系统异常*/
return;
}
var app = s.user;
var arrDate = app.birthday ? _this.splitDateString(app.birthday) : ["","",""];
var customerType = _this.getCustomerType(app.email);
var type = "0"//新客户
if(customerType=="00"){//普通网站会员
type = "1";
}else if(customerType=="01"){//内部员工
type = "2";
}

//计算是否是生日
var isBirthday = _this.isBirthday(app.birthday);

_this.oApplicantInfo = {
uid : app.uid,
email : app.email,
name : app.userName,
certificateType : _this.convertIdType(app.idType),
certificateNumber: app.idNo,
sex : app.sex,
birthDate : app.birthday,
birthYear : arrDate[0],
birthMonth : arrDate[1],
birthDay : arrDate[2],
mobileTelephone : app.mobile,
provinceCode : app.liveProvinceCode,
cityCode : app.liveCityCode,
userType  : type,
customerType : customerType,
isBirthday  : isBirthday
};
},


//返回联系地址信息
querySenderInfo : function (onComplete,uid){
var _this = this;
if (typeof RumAuth != "undefined") {
RumAuth.rum.getUserInfo('isQueryContactAddresses=true',function(json){
_this.processSenderInfoResult(json);
if(onComplete){
onComplete();
}
});
}else
return;
},


processSenderInfoResult : function (s){
var _this = this;
if(s == null || (typeof s == "string" && (s == "NOT_LOGON" || s == "OTHER_EXCEPTION" || s == ""))||s.resultCode != "0"){
return;
}
$.each(s.contactAddresses,function(i,item){
_this.arrSenderInfos[i]={
index : i,
receiverName : item.name,
receiverMobile 
: item.mobile,
provinceCode : item.provinceNo,
cityCode : item.cityNo,
receiverAddress : item.address,
postcode : item.postcode
}
});
},




//返回被保险人信息（联系人信息也是用这个）
queryInsurantAndLinkmanInfo : function (onComplete,uid){
var _this = this;
if (typeof RumAuth != "undefined") {
RumAuth.rum.getUserInfo('isQueryContactMans=true',function(json){
_this.processInsurantAndLinkmanResult(json);
if(onComplete){
onComplete();
}
});
}else
return;
},


processInsurantAndLinkmanResult : function (s){
var _this = this;
if(s == null || (typeof s == "string" && (s == "NOT_LOGON" || s == "OTHER_EXCEPTION" || s == ""))||s.resultCode != "0"){
return;
}
$.each(s.contactMans, function(i,item){
if(!item.name || typeof(item.name)=="undefined" || item.name=="undefined"){
return;
}
var arrDate = item.birthday ? _this.splitDateString(item.birthday)  : ["","",""];
_this.arrInsurantInfos[i]={
index : i,
insurantName : item.name,
certificateType : _this.convertIdType(item.idType),
certificateNumber : item.idNo,
sex : item.sex,
birthDate : item.birthday,
birthYear : arrDate[0],
birthMonth : arrDate[1],
birthDay : arrDate[2],
mobileTelephone : (!item.mobile || typeof(item.mobile)=="undefined" || item.mobile=="undefined") ? "" : item.mobile,
nameSpell : (!item.nameSpell || typeof(item.nameSpell)=="undefined" || item.mobile=="nameSpell") ? "" : item.nameSpell
}
});
},

//返回房屋地址信息
queryHouseInfo : function (onComplete,uid){
var _this = this;
if (typeof RumAuth != "undefined") {
RumAuth.rum.getUserInfo('isQueryHouses=true',function(json){
_this.processHouseInfoResult(json);
if(onComplete){
onComplete();
}
});
}else
return;
},


processHouseInfoResult : function (s){
var _this = this;
if(s == null || (typeof s == "string" && (s == "NOT_LOGON" || s == "OTHER_EXCEPTION" || s == ""))||s.resultCode != "0"){
return;
}
$.each(s.houses, function(i,item){
_this.houseInfos[i]={
index : i,
address : item.address,
provinceCode : item.provinceNo,
cityCode : item.cityNo
}
});
},


//获取产品宣传资讯 广告offer
initProductMessage : function(comeFrom, corpsite, pageid){
//url类似于:http://dmzstg1.pa18.com/ebusiness/advert/matchAdvert.do?comeFrom=annualInsurance&pageNo=annualInsurance_plan&mediaSource=stg.pa18.com
var _this = this;
$('#productMsgDiv').html("");
$.get(common.paUrl+"/ebusiness/advert/matchAdvert.do?comeFrom="+comeFrom+"&pageNo="+pageid+"&mediaSource="+corpsite,function(s){
if(s == null || (typeof s == "string" && (s == "NOT_LOGON" || s == "OTHER_EXCEPTION" || s == ""))){
_this.productMessage = "";
return;
}
_this.productMessage = $('advertContent',s.documentElement).text() || "";//兼容
$('#productMsgDiv').html(_this.productMessage=="undefined"?"":_this.productMessage).show();
});
},

/* 根据cookie名取该cookie的信息 */
readCookie : function (name){
var nameEQ = name + "=";
var ca = document.cookie.split(';');
for(var i=0;i < ca.length;i++){
var c = ca[i];
while (c.charAt(0)==' '){
c = c.substring(1,c.length);
}
if(c.indexOf(nameEQ) == 0){
return c.substring(nameEQ.length,c.length);
}
}
return null;
},


/* 根据cookie显示欢迎信息 */
showUserInfo : function (readCookie){//readCookie设置为true则强制读cookie里面的值
var _this=this, userName="", customerType="", userSex="";
if(_this.oApplicantInfo && !readCookie){//从投保人信息里面查
userName = _this.oApplicantInfo.name;
customerType = _this.oApplicantInfo.customerType;
userSex = _this.oApplicantInfo.sex;
!userName && _this.showUserInfo(true);
//}else{//从cookie里面读
}else if(readCookie){//从cookie里面读
var co = _this.readCookie('PA18RUM_USER_IDENTIFIER');//xupantest18%40test.com|xupantest18|2012-12-03+14%3A18%3A31|00|null|800130802214
if(co){
userName = decodeURI(co).split('|')[1]||'';
customerType = decodeURI(co).split('|')[3]||'';
userSex = decodeURI(co).split('|')[4]||'';
}
}
if(userName){
(typeof(userSex)=="undefined" || !userSex ||  userSex=="null") && (userSex="undefined");
var oSex = {"M":"先生", "F":"女士", "undefined":""};
$("#welcome").html('尊敬的<b class="f_c_f30">' + ((customerType=='01')?'平安员工':'') + userName +'</b>'+((customerType=='00')?oSex[userSex]:'')+'，欢迎您！').show();
}
},


doLogon : function (backFun){
var _this = this;
common.showMsg({
title:"中国平安 - 一账通会员登录",
size:[680, 630],
url:common.paUrl+"/customer/toLogin.do?type=02&rumPageFlag=N&target="+_this.targetUrl+"&random="+Math.random(),
close:function(){
backFun && backFun();
}
});
},
/**
 * 获取字符字节长度
 */
getByteLength : function(e) {
    if(!e) {
        return 0;
    }
    var a = e.length;
    var b = 0;
    for( i = 0; i < a; i++) {
        if((e.charCodeAt(i) & 65280) != 0) {
            b++;
        }
        b++;
    }
    return b;
},

doRegister : function (backFun){
var _this = this;
common.showMsg({
title:"中国平安 - 一帐通会员注册",
size:[680, 630],
url:common.paUrl+"/customer/toRegisterUser.do?type=03&rumPageFlag=N&target="+_this.targetUrl+"&random="+Math.random(),
close:function(){
backFun && backFun();
}
});
},


isLoginUserAndComplete : function (complete,noLoginEvent){
var _this = this;
_this.queryApplicantInfo(function(){
if(_this.oApplicantInfo) {
if(complete){
complete();
}
}else{
if(noLoginEvent){
noLoginEvent();
}
} 
});
},


clearSession : function (){
if(event.keyCode==116 ||(event.ctrlKey && event.keyCode==82) || (event.altKey && event.keyCode==115)){
document.inputForm.action = "clearSession.do";
document.inputForm.submit();
} 
}
};




/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
////////省份城市联动对象库
////////用法可参考如下，只需要初始化配置一下即可：
/*
var cityUser = new common.city({//常住城市的联动
oData:provinces,
eProvince:$('#user_provinceCode'),
eCity:$('#user_cityCode'),
eProvinceName : $('#user_provinceName'),
eCityName : $('#user_cityName'),
sFindField : 'cityCode',
eFindField : $('#commonLiveCityWrap input[name=commonLiveCity]'),
bFindFieldBack : true
});
var cityPost = new common.city({//区县及邮政编码的联动
oData:ldsProvinces,
eProvince:$('#provinceCode'),
eCity:$('#cityCode'),
eArea:$('#areaCode'),
eProvinceName : $('#provinceName'),
eCityName : $('#cityName'),
eAreaName : $('#areaName'),
sFindField : 'postCode',
eFindField : $('#postcode')
});
*/
common.city = function(opt) {
var _this = this;
/*
//彻底简化字段json结构
ldsProvinces = [// 省份集合
{
"a":"110000",  //provinceCode 省份 Code
"b":"北京市",  //provinceName 省份名
"c":[ //provinceCities城市集合
{
"d":"110100",  //cityCode 城市 Code
"e":"北京市",  //cityName 城市名


/////////  最基础的省份城市数据(无区县)可以不包括如下字段 --->
"f":"100000",  //postCode 邮政编码
"g":[ //cityAreas区县集合
{
"h":"110101"  //areaCode 区县 Code
"i":"东城区",  //areaName 区县名
},
......// N多区县 Area
]
/////////  <---- 最基础的省份城市数据可以不包括如上字段


}
......// N多城市 City
]
},
......// N多省份 Province
];
*/
this.fieldList = {//字段名简化名和全名对照转换表
"provinceCode" : "a",
"a" : "a",
"provinceName" : "b",
"b" : "b",
"cityCode" : "d",
"d" : "d",
"cityName" : "e",
"e" : "e",
"postCode" : "f",
"f" : "f",
"areaCode" : "h",
"h" : "h",
"areaName" : "i",
"i" : "i"
};


/* opt = {
oData : ldsProvinces,//必选 省份城市区县JSON格式的数据 数据结构如上说明
eProvince : $('#provinceCode'),//必选 省份下拉框 jquery对象
eCity : $('#cityCode'),//必选 城市下拉框 jquery对象
eArea : $('#areaCode'),//可选 区县下拉框 jquery对象
eProvinceName : $('#provinceName'),//可选 省份中文名存放表单 jquery对象
eCityName : $('#cityName'),//可选 省份中文名存放表单 jquery对象
eAreaName : $('#areaName'),//可选 省份中文名存放表单 jquery对象
vProvince : '440000',//可选 省份code的选中值 字符串 默认''
vCity : '440300',//可选 城市code的选中值 字符串 默认''
vArea : '440305',//可选 区县code的选中值 字符串 默认''
aHotProvices : ['110000', '310000', '440000'],//可选 优先排列的省份 字符串数组 默认北上广
aDelProvices : [],//可选 排除显示的省份 字符串数组 默认空数组[]
aHotCities : ['440300'],//可选 优先排列的城市 字符串数组 默认['440300'] 深圳
aDelCities : [],//可选 排除显示的城市 字符串数组 默认空数组[]
aHotAreas : [],//可选 优先排列的区县 字符串数组 默认空数组[]
aDelAreas : [],//可选 排除显示的区县 字符串数组 默认空数组[]
sFindField : '',//可选 需要查找的字段名 默认''
sByField : 'cityCode',//可选 根据哪个字段查找 默认'cityCode'即默认根据cityCode字段查找
eFindField : 'postCode',//可选 需要将查找的字段赋值到哪个表单元素 默认''
bFindFieldBack : true//可选 是否当要查找的字段关联表单元素值改变时联动改变省份城市区县的下拉框值 默认false
fOnCityChange : function(vCity){},//可选 城市改变时的反调函数
provinceChooseFlag : '0',//可选 控制省份默认选中方案，在没有对应默认配置选中值的情况下，'0':默认不选中 , '1'当只有一条数据可选时才选中第一条数据: , '2':始终选中第一条数据。城市和区县的如下类似。
cityChooseFlag : '2',//可选 默认'2'选中第一条数据
areaChooseFlag : '2'//可选 默认'2'选中第一条数据
} */
this.init = function(opt){
_this.opt = $.extend({
oData : null,
eProvince : null,
eCity : null,
eArea : null,
eProvinceName : null,
eCityName : null,
eAreaName : null,
vProvince : '',//测试数据 440000 广东省
vCity : '',  //测试数据 440300 深圳市
vArea : '',  //测试数据 440305 南山区
aHotProvices : ['110000', '310000', '440000'],//测试数据 ['110000', '310000', '440000'] 北京市、上海市、广东省
aDelProvices : [],//测试数据 ['120000'] 天津市
aHotCities : ['440300'],//测试数据 ['440300', '440100', '440400'] 深圳市、广州市、珠海市
aDelCities : [],//测试数据 ['440600'] 佛山市
aHotAreas : [],//测试数据 ['440304', '440303', '440305'] 福田区、罗湖区、南山区
aDelAreas : [],//测试数据 ['4403001', '4403002'] 坪山新区、光明新区
sFindField : '',
sByField : 'cityCode',
eFindField : null,
bFindFieldBack : false,
fOnCityChange : null,
provinceChooseFlag : '0',
cityChooseFlag : '2',
areaChooseFlag :'2'
}, opt);
var _opt = _this.opt;
if(_opt.oData && _opt.eProvince && _opt.eCity){
_this.initProvince(_opt);
_this.initCity(_opt);
_opt.eProvince.bind('change', function(){
_this.initCity(_opt);
_opt.eArea && _this.initArea(_opt);
_this.doReatedName(opt);
_opt.fOnCityChange && _opt.fOnCityChange(_opt.eCity.val());
});
//以上基础的省份城市联动已经处理完毕
//以下处理城市区县的联动
if(_opt.eArea || (_opt.sFindField && _opt.eFindField)){
_opt.eArea && _this.initArea(_opt);
_opt.eCity.bind('change', function(){
_opt.eArea && _this.initArea(_opt);
//如果涉及关联字段查找和赋值
_opt.sFindField && _opt.eFindField && _this.doRelatedField(_opt);
_this.doReatedName(opt);
_opt.fOnCityChange && _opt.fOnCityChange($(this).val());
});
if(_opt.bFindFieldBack && _opt.sFindField && _opt.eFindField){//处理关联字段表单改变时的反调定位
_opt.eFindField.bind(_opt.eFindField.is('input:radio') ? 'click' : 'change', function(){
var v = $(this).val();
v && _this.locationByOneField(_opt.sFindField, v);
});
}
}else if(_opt.fOnCityChange){
_opt.eCity.bind('change', function(){
_opt.fOnCityChange($(this).val());
});
}
_this.doReatedName(opt);
_opt.fOnCityChange && _opt.fOnCityChange(_opt.eCity.val());
_opt.eAreaName && _opt.eAreaName.is('input') && _opt.eArea.bind('change', function(){
_this.doReatedName(opt);
});
}
};
//省份下拉框初始化
this.initProvince = function(opt){
var aProvinces = ['<option value="">省/直辖市</option>'];
var aProvinceCd = [];//存放添加过的数据
opt.aHotProvices.length>0 && $.each(opt.aHotProvices, function(i, c){//有热门省份时的循环优先显示的省份
$.each(opt.oData, function(pIdx, pItem){//循环省份
if(pItem.a === c && $.inArray(pItem.a, opt.aDelProvices) === -1 && $.inArray(_province, aProvinces) === -1){//是热门省份且非需要排除的省份,且没有添加过
var _selected = opt.vProvince===pItem.a || (opt.provinceChooseFlag==='2'&&aProvinces.length===1) || (opt.provinceChooseFlag==='1'&&opt.oData.length===1);
var _province = '<option value="'+pItem.a+'" '+ (_selected ? 'selected' : '') +'>'+pItem.b+'</option>';
aProvinces.push(_province);
aProvinceCd.push(pItem.a);
}
});
});
$.each(opt.oData, function(pIdx,pItem){//循环省份
if( $.inArray(pItem.a, opt.aDelProvices) === -1 && $.inArray(pItem.a, aProvinceCd) === -1){//非需要排除的省份,且没有添加过
var _selected = opt.vProvince===pItem.a || (opt.provinceChooseFlag==='2'&&aProvinces.length===1) || (opt.provinceChooseFlag==='1'&&opt.oData.length===1);
var _province = '<option value="'+pItem.a+'" '+ (_selected ? 'selected' : '') +'>'+pItem.b+'</option>';
aProvinces.push(_province);
aProvinceCd.push(pItem.a);
}
});
opt.eProvince.html(aProvinces.join(''));
};
//城市下拉框初始化
this.initCity = function(opt){
var aCities = ['<option value="">城市/区</option>'];
var aCityCd = [];//存放添加过的数据
var vpc = opt.eProvince.val() || '';
opt.aHotCities.length>0 && $.each(opt.oData, function(pIdx,pItem){//有热门城市时的循环省份
if( pItem.a === vpc && $.inArray(pItem.a, opt.aDelProvices) === -1){//默认值要选中的省份且非要排除的省份
$.each(opt.aHotCities, function(i, c){//循环优先显示的城市
$.each(pItem.c, function(cIdx, cItem){//循环城市
if(cItem.d === c && $.inArray(cItem.d, opt.aDelCities) === -1 && $.inArray(cItem.d, aCityCd) === -1){//是热门城市且非需要排除的城市,且没有添加过
var _selected = opt.vCity===cItem.d || (opt.cityChooseFlag==='2'&&aCities.length===1) || (opt.cityChooseFlag==='1'&&pItem.c.length===1);
var _city = '<option value="'+cItem.d+'" '+ (_selected ? 'selected' : '') +'>'+cItem.e+'</option>';
aCities.push(_city);
aCityCd.push(cItem.d);
}
});
});
return;
}
});
$.each(opt.oData, function(pIdx,pItem){//循环省份
if( pItem.a === vpc && $.inArray(pItem.a, opt.aDelCities) === -1){//非需要排除的城市
$.each(pItem.c, function(cIdx, cItem){//循环城市
if($.inArray(cItem.d, opt.aDelCities) === -1 && $.inArray(cItem.d, aCityCd) === -1){//是热门城市且非需要排除的城市,且没有添加过
var _selected = opt.vCity===cItem.d || (opt.cityChooseFlag==='2'&&aCities.length===1) || (opt.cityChooseFlag==='1'&&pItem.c.length===1);
var _city = '<option value="'+cItem.d+'" '+ (_selected ? 'selected' : '') +'>'+cItem.e+'</option>';
aCities.push(_city);
aCityCd.push(cItem.d);
}
});
return;
}
});
opt.eCity.html(aCities.join(''));
//如果涉及关联字段查找和赋值
opt.sFindField && opt.eFindField && this.doRelatedField(opt);
};
//区县下拉框初始化
this.initArea = function(opt){
var aAreas = ['<option value="">区/县</option>'];
var aAreaCd = [];//存放添加过的数据
var vpc = opt.eProvince.val() || '';
var vcc = opt.eCity.val() || '';
opt.aHotAreas.length>0 && $.each(opt.oData, function(pIdx,pItem){//有热门区县时的循环省份
if( pItem.a === vpc && $.inArray(pItem.a, opt.aDelProvices) === -1){//需要默认选中的省份且非需要排除的省份
$.each(pItem.c, function(cIdx, cItem){//循环城市
if( cItem.d === vcc && $.inArray(cItem.d, opt.aDelCities) === -1){//需要默认选中的城市非需要排除的城市
$.each(opt.aHotAreas, function(i, c){//循环优先显示的区县
$.each(cItem.g, function(aIdx, aItem){//循环区县
if(aItem.h === c && $.inArray(aItem.h, opt.aDelAreas) === -1 && $.inArray(aItem.h, aAreaCd) === -1){//是热门区县且非需要排除的区县,且没有添加过
var _selected = opt.vArea===aItem.h || (opt.areaChooseFlag==='2'&&aAreas.length===1) || (opt.areaChooseFlag==='1'&&cItem.g.length===1);
var _area = '<option value="'+aItem.h+'" '+ (_selected ? 'selected' : '') +'>'+aItem.i+'</option>';
aAreas.push(_area);
aAreaCd.push(aItem.h);
}
});
});
}
});
return;
}
});
$.each(opt.oData, function(pIdx,pItem){//循环省份
if( pItem.a === vpc && $.inArray(pItem.a, opt.aDelProvices) === -1){//需要默认选中的省份且非需要排除的省份
$.each(pItem.c, function(cIdx, cItem){//循环城市
if( cItem.d === vcc && $.inArray(cItem.d, opt.aDelCities) === -1){//需要默认选中的城市非需要排除的城市
$.each(cItem.g, function(aIdx, aItem){//循环区县
if($.inArray(aItem.h, opt.aDelAreas) === -1 && $.inArray(aItem.h, aAreaCd) === -1){//是热门区县且非需要排除的区县,且没有添加过
var _selected = opt.vArea===aItem.h || (opt.areaChooseFlag==='2'&&aAreas.length===1) || (opt.areaChooseFlag==='1'&&cItem.g.length===1);
var _area = '<option value="'+aItem.h+'" '+ (_selected ? 'selected' : '') +'>'+aItem.i+'</option>';
aAreas.push(_area);
aAreaCd.push(aItem.h);
}
});
}
});
return;
}
});
opt.eArea.html(aAreas.join(''));
};
//根据指定的字段获取要查找的指定的字段值, 暂只编码了根据cityCode查找postCode，其他场景若有需要可自行扩展，暂不过量开发了
this.getFieldBy = function(opt, diyFind, sByCityCode){
if(diyFind){//自定义查找
var byField = _this.fieldList[_this.opt.sByField];
if(byField==='d' && sByCityCode){//暂时只支持根据cityCode来查
var vFindField = '';
var hasFind = false;
$.each(_this.opt.oData, function(pIdx,pItem){//如果vCity有值，循环省份
$.each(pItem.c, function(cIdx, cItem){//循环城市
if(cItem.d == sByCityCode){
if(diyFind instanceof Array){
vFindField = [];
for(i=0;i<diyFind.length;i++){
vFindField[i] = cItem[_this.fieldList[diyFind[i]]] || pItem[_this.fieldList[diyFind[i]]];
}
}else{
vFindField = cItem[_this.fieldList[diyFind]] || pItem[_this.fieldList[diyFind]];
}
hasFind = true;
return;
}
});
if(hasFind){
return;
}
});
return vFindField;
}else{
return '';
}
}else{//初始化时程序的自动调用
var byField = this.fieldList[opt.sByField];
var fField = this.fieldList[opt.sFindField];
var vCity = opt.eCity.val();
if(byField==='d'){//暂时只支持根据cityCode来查
if(fField==='d'){//查找的是cityCode,则直接返回vCity
return vCity;
}else if(fField==='f'){//查找的是postCode字段
var vFindField = '';
var hasFind = false;
vCity && $.each(opt.oData, function(pIdx,pItem){//如果vCity有值，循环省份
$.each(pItem.c, function(cIdx, cItem){//循环城市
if(vCity === cItem.d){
vFindField = cItem.f;
hasFind = true;
return;
}
});
if(hasFind){
return;
}
});
return vFindField;
}else{
return '';
}
}else{//若根据其他字段查则返回空
return '';
}
}


};
//处理关联字段查找和赋值
this.doRelatedField = function(opt){
var vFindField = this.getFieldBy(opt) || '';
if(opt.eFindField.is('input')){
var iType = opt.eFindField.attr("type");
if(iType=="text" || iType=="hidden"){
opt.eFindField.val(vFindField);
}else if(iType=="radio"){
opt.eFindField.removeAttr('checked');
opt.eFindField.filter('[value='+vFindField+']').attr("checked","checked");
}
}else if(opt.eFindField.is('select')){
opt.eFindField.val(vFindField);
}
};
//实时给省份城市区县中文名表单赋值
this.doReatedName = function(opt){
if(opt.eProvinceName || opt.eCityName || opt.eAreaName){
opt.eProvinceName && opt.eProvinceName.is('input') && opt.eProvinceName.val((opt.eProvince.find('option:selected').text()||'').replace('省/直辖市',''));
opt.eCityName && opt.eCityName.is('input') && opt.eCityName.val((opt.eCity.find('option:selected').text()||'').replace('城市/区',''));
opt.eAreaName && opt.eAreaName.is('input') && opt.eAreaName.val((opt.eArea.find('option:selected').text()||'').replace('区/县',''));
}
};
//根据具体的某字段定位省份城市区县的选中
this.locationByOneField = function(sField, vField){//sField:要定位的字段名, vField:要定位的字段值
var opt = this.opt;
var _sField = this.fieldList[sField];
var ie6 = $.browser.msie && ($.browser.version == "6.0");
_sField && $.each(opt.oData, function(pIdx,pItem){//循环省份
if((_sField==='a' || _sField==='b') && pItem[_sField] === vField){//根据省份的相关字段provinceCode、provinceName定位
opt.eProvince.val(pItem.a).change();
return;
}else{
$.each(pItem.c, function(cIdx, cItem){//循环城市
if((_sField==='d' || _sField==='e'  || _sField==='f') && cItem[_sField] === vField){//根据城市的相关字段cityCode、cityName、postCode定位
opt.eProvince.val(pItem.a).change();
ie6 ? setTimeout(function(){
opt.eCity.val(cItem.d).change();
}, 0) : opt.eCity.val(cItem.d).change();
return;
}else{//根据区县的相关字段areaCode、areaName定位
cItem.g && $.each(cItem.g, function(aIdx, aItem){//循环区县
if(aItem[_sField] === vField){//
opt.eProvince.val(pItem.a).change();
ie6 ? setTimeout(function(){ //ie6需要延时赋值选中，否则可能会出现“无法设置selected属性的错误”
opt.eCity.val(cItem.d).change(); 
}, 0) : opt.eCity.val(cItem.d).change();
ie6 ? setTimeout(function(){ 
opt.eArea.val(aItem.h).change();
}, 1) : opt.eArea.val(aItem.h).change();
return;
}
});
}
});
}
});
};


//new之后默认马上初始化
this.init(opt);
};


/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////


/**将对象深拷贝 var newObj = $.clone(oldObj);*/
(function($){
$.extend({
clone: function(o){
  if (!o) {
return o;
}
if ($.isArray(o)) {
var r = [];
for (var i = 0; i < o.length; ++i) {
  r.push($.clone(o[i]));
}
return r;
}
if (!(o!== undefined && (o === null || typeof o == "object" || $.isArray(o) || $.isFunction(o)))) {
return o;
}
if (o.nodeType && o.cloneNode) {
return o.cloneNode(true);
}
if (o instanceof Date) {
return new Date(o.getTime());
}
r = new(o.constructor);
for (i in o) {
if (! (i in r) || r[i] != o[i]) {
r[i] = $.clone(o[i]);
}
}
return r;
}
});
})(jQuery);
 
/*! * jquery.bgiframe Version 2.1.2 */
(function($){
$.fn.bgiframe = ($.browser.msie && /msie 6\.0/i.test(navigator.userAgent) ? function(s) {
s = $.extend({
top     : 'auto', // auto == .currentStyle.borderTopWidth
left    : 'auto', // auto == .currentStyle.borderLeftWidth
width   : 'auto', // auto == offsetWidth
height  : 'auto', // auto == offsetHeight
opacity : true,
src     : 'javascript:false;'
}, s);
var html = '<iframe class="bgiframe"frameborder="0"tabindex="-1"src="'+s.src+'"'+
  'style="display:block;position:absolute;z-index:-1;'+
  (s.opacity !== false?'filter:Alpha(Opacity=\'0\');':'')+
  'top:'+(s.top=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderTopWidth)||0)*-1)+\'px\')':prop(s.top))+';'+
  'left:'+(s.left=='auto'?'expression(((parseInt(this.parentNode.currentStyle.borderLeftWidth)||0)*-1)+\'px\')':prop(s.left))+';'+
  'width:'+(s.width=='auto'?'expression(this.parentNode.offsetWidth+\'px\')':prop(s.width))+';'+
  'height:'+(s.height=='auto'?'expression(this.parentNode.offsetHeight+\'px\')':prop(s.height))+';'+
'"/>';
return this.each(function() {
if ( $(this).children('iframe.bgiframe').length === 0 )
this.insertBefore( document.createElement(html), this.firstChild );
});
} : function() { return this; });
// old alias
$.fn.bgIframe = $.fn.bgiframe;
function prop(n) {
return n && n.constructor === Number ? n + 'px' : n;
}
})(jQuery);


(function($){
$.fn.heightLightInput = function(o) {
o = $.extend({
cFocus: "red",
cBlur : "#a5a6a5",
filterInput : "input:text"
}, o);
$(this.selector).filter(o.filterInput).focus(function(){
$(this).css("border-color", o.cFocus);
}).blur(function(){
$(this).css("border-color", o.cBlur);
});
}
})(jQuery);


window.toDBC=common.validate.toDBC;
window._common=common;


return common;
});

