var errmsgcode = -1;
var _pscroll = {};

//头部导航
function _topnav_init()
{
	switch (_topnav_path) {
		case 'inbox_index': //按职位查看简历
			if (_topnav_jobid > 0) {
				_topnav_path = 'jobresumes_index';
			}
		break;
		case 'jobmanage_edit': //编辑职位
		case 'jobs_filter': //简历接收设置
			_topnav_path = 'jobrecord_index';
		break;
		case 'jobtpl_editjobtpl': //职位模板
			_topnav_path = 'jobtpl_index';
		break;		
		case 'jobpost_joblist': //职位列表-未发布的职位
			_topnav_path = 'jobpost_list';
		break;
		case 'usermanage_add': //新增用户信息
		case 'usermanage_edit': //修改用户信息
			_topnav_path = 'usermanage_index';
		break;
	}
	
	var _topnav_top = $('#p_'+ _topnav_path);
	var _topnav_sub = $('#s_'+ _topnav_path);
	var _topnav_list = $('#l_'+ _topnav_path);
	
	if (_topnav_top.length > 0) {
		
		//主导航
		_topnav_top.addClass('current_item');
		_topnav_top.parent().prev().addClass('bg_none');
		_topnav_top.parent().next().addClass('bg_none');
		
		//如果有子导航
		if (_topnav_list.length > 0) {
			_topnav_sub.addClass('subnav_item_first');
			_topnav_list.show();
		}
		
	} else if (_topnav_sub.length > 0) {
		
		var _topnav_subtop = $('#p_'+ _topnav_sub.parent().attr('id').substr(2));
		
		//主导航
		_topnav_subtop.addClass('current_item');
		_topnav_subtop.parent().prev().addClass('bg_none');
		_topnav_subtop.parent().next().addClass('bg_none');
		
		//子导航
		_topnav_sub.addClass('subnav_item_first');
		_topnav_sub.parent().show();
		
	}
}

// JavaScript Document
function changeTab(nav,cont,onstyle){
    $(nav).mouseover(function(){
        var $onnav = $(this).html();
        var i=0;
        $(nav).each(function(){
            if($onnav==$(this).html()){
                $(nav).find('a').removeClass(onstyle);
                $(this).find('a').addClass(onstyle);
                $(cont).hide();
                $(cont+":eq("+i+")").show();
				
            }else{
                i=i+1;
            }
        })
    })
}

//全选全取消等调用函数 start 
function checkAll(allCheckbox, checkboxs){
    $("."+allCheckbox).click(function(){
        var flag = $(this).attr("checked");
        $("."+checkboxs).attr("checked",flag);
        $("."+allCheckbox).attr("checked",flag);
    })
    check();
    $("."+checkboxs).each(function(){
        $(this).click(function(){
            check();			  
        })
    })
    function check(){
        var checked = $("."+checkboxs+":checked").length;
        var check = $("."+checkboxs).length;
        if(checked == check && check != 0 ){
            $("."+allCheckbox).attr("checked","checked")	
        }else{
            $("."+allCheckbox).removeAttr("checked");
        }	
    }
}


//搜索器列表
function searList(){
    var $eaIframe = $("<iframe id='seaIframe'  frameborder='0'></iframe>");
    var flg = true;
    $('.searSel').live('click',function(e){
        var $this = $(this);
        var $s =$(this).next($('.searTools'));
        $s.show();	
        $('#seaIframe').size()==0?$eaIframe.appendTo($(document.body)):$('#seaIframe').show();
        var _l = $s.offset().left,
        _t = $s.offset().top,
        _w = $s.width();
        _h = $s.height();
        $('#seaIframe').css({
            position:"absolute",
            left:_l,
            top:_t,
            width:_w,
            height:_h,
            "z-index":'999', 
            border:'none', 
            background:'none'
        });
        flg = false;
        $s.find('a').click(function(){
            $s.hide();
            $('#seaIframe').hide();
            var f = $(this).hasClass('toolClose')||$(this).hasClass('deleteBtn');
            if(!f){
                $this.val($(this).text());
            }
        })
    })
    $('.searTools').live('click',function(e){
        flg = false;						   
    })
    $(document).add($(".toolClose")).click(function(){
        if(flg){
            $('.searTools').hide();
            $('#seaIframe').hide();
        }
        flg=true;
    })
}



//弹出层popLayer(是否加载遮罩层，追加位置-不填则加在body里)
function popLayer(url,flg,h,appObj,callBack){
    var h =h?h:"";
	var thisID=Math.floor(Math.random()*10000+1);
    var $popObj = $("<div class=\"pop\" id=\"popLayle\" style=\"display:none\"><div class=\"clearfix popInner\"><h4><a class=\"popCl popKill\"></a><span>"+h+"</span></h4><div class=\"popCon\"></div></div></div>");
    //加载弹出层页面
    var rand = Math.random()*935+134;
    if(url){
        if(url.substring(0,1)=='#'){
            var datatemp = $(url).clone();
            $popObj.find('.popCon').html(datatemp);
            $('#popLayle').find('.popCon').html(datatemp);
            $('#popLayle').find(url).css('display','block');
            init();
            $('#popLayle').find(url).show();
            init();
        }else{
            if(url.indexOf('?')== "-1"){
                url = url+"?rand="+rand;
            }else{
                url = url+"&rand="+rand;
            }
            $.ajax({
                url:url,
                type:"GET",
                async:true,
                error:function(){
                    throw "Page address is wrong!";
                    return false;
                },
                success:function(data){
                    $popObj.find('.popCon').html(data);
                    $('#popLayle').find('.popCon').html(data);
                    init();
                }
            })
        }
    }else{
        throw "Please input your address!";
    }
    closePop('.popKill',callBack);

    //抖一下
    $('#popIframe').live('click',function(){
        var _l = $popObj.offset().left-10,  _r = _l +20, _c = _r -10;
        $popObj.animate({
            "left":_l+"px"
            },5,function(){
            $popObj.animate({
                "left":_r+"px"
                },10,function(){
                $popObj.animate({
                    "left":_c+"px"
                    },5)
            });
        });
    })

    //加载弹出层
    function init(){
        var appObj = appObj || $(document.body);
        $('#popLayle').size()==0?$popObj.appendTo(appObj).show():$('#popLayle').show();
        $('#popLayle').width($('#popLayle .popCon').children('div').outerWidth()+20+'px');
        $('#popLayle h4 span').text(h);
        var $iframe = $("<div id=\"popIframe\"><div id=\"vayDiv\"  style=\"width:100%;height:"+$(document.body).height()+"px;top:0px; position:absolute; z-index:9999; border-style:none;filter:alpha(opacity=10);opacity:0.1; background:#000 \"></div><iframe width=\"100%\" style=\"height:"+$(document.body).height()+"px;top:0px; position:absolute; z-index:9998; border-style:none;filter:alpha(opacity=0);opacity:0; \"></iframe></div>");
        if(flg){
            $('#popIframe').size()=="0"?$iframe.appendTo($(document.body)):$('#popIframe').show();
        };
        var _w = $('#popLayle').outerWidth(), _h =$('#popLayle').outerHeight();
        var _top = $(window).height()-_h,_left = $(window).width() - _w;
        var scrTop = $(window).scrollTop();
        var topover = _top*0.5 + scrTop;
        if(topover<0){
            topover=0
            }
        $('#popLayle').css({
            left:_left*0.5 +"px",
            top:topover+"px",
            "z-index":"10000"
        });

        popLayer_init();
    }

}

function popLayer_init(){}

function closePop(closeObj,callBack){
    $(closeObj).live('click',function(){
        $('#popIframe').hide();
        $('#popLayle').hide();
        if(callBack){
            top.location.href=callBack;
        }
    });
}



var $_ScrollBot = {};
$_ScrollBot.scrollHeight;
//屏幕滚动
$_ScrollBot.pageScroll = function(){
    if(jQuery.browser.mozilla || jQuery.browser.msie){
        window.scrollBy(0,-20);
        scrolldelay = setTimeout('$_ScrollBot.pageScroll()',1);
        if(document.documentElement.scrollTop < $_ScrollBot.scrollHeight) clearTimeout(scrolldelay);        
    }else{
        scroll(0,$_ScrollBot.scrollHeight);
    }
}
//错误验证
function err_tip(obj,type,_pxmsg){
    $('.tipBox').hide();
    var clrT = null;
    var $tip = $("<div class=\"tipBox\"><div class=\"outTip\"><div class=\"outDot\">◇<div class=\"inDot\">◆</div></div><span class=\"top-err\"></span></div></div>");
	var esc = 1;

	if(type=="01" || type=="02"){ esc = 0; }

	$(obj).each(function(i,item){

        if( !(type=="01" || type=="02") && ( $(item).val()==""||$(item).val()==$(item).attr("placeholder") ) ){
            tipPost("该项不能为空",item);
            errmsgcode = -1;
            return false;
        }else{

            $('.tipBox').hide();
			var _val = $(item).val();
            if(type&&type == "0"){   
                var rag = new RegExp(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)
                if(!rag.test(_val)){
                    tipPost("您输入的邮箱格式不对",item);
                    errmsgcode = -1;
                    return false;
                }
            }else if(type&&type == "1"){
                tipPost("此帐号不存在",item);
                errmsgcode = -1;
                return false;
            }else if(type&&type == "2"){
                tipPost("验证码不正确",item);
                errmsgcode = -1;
                return false;
            }else if(type&&type == "3"){
                tipPost("密码不正确",item);
                errmsgcode = -1;
                return false;
			}else if(type&&type == "4"){
				tipPost("企业名有误",item);
				errmsgcode = -1;
				return false;
			}else if(type&&type == "56"){

				if( !(/^1(3|4|5|8)\d{9}$/.test(_val)) ){
					tipPost('请输入正确的电话号码或手机号码',item);
					//phand.focus();
					errmsgcode = -1;
					return false;
				}

			}else if(type&&type == "55"){

				if( !(/^0(([1-9]\d)|([3-9]\d{2}))\d{8}$/.test(_val)) ){
					tipPost('请输入正确的电话号码或手机号码',item);
					//phand.focus();
					errmsgcode = -1;
					return false;
				}
			}else if(type&&type=='01'){

				if( _val!='' && ! (/^\d{3,4}-\d{7,8}(-\d{2,6})?$/.test(_val) || /^1(3|4|5|8)\d{9}$/.test(_val)) ){

					err_tip('#phone','100','联系电话不正确');
					return; 
				}
			}else if(type&&type=='02'){

				if( _val!='' && ! (/^1(3|4|5|8)\d{9}$/.test(_val)) ){
					err_tip('#testphone','100','手机号码不正确');
					return; 
				}

			}else if(type&&type == "6"){
				if(_val.length < 6) {
					tipPost('请输入6-20个字符',item);
					errmsgcode = -1;
					return false;
				}
			}else if(type&&type == "7") {
				if(_val.length < 4 || _val.length>20) {
					tipPost('帐号不能少于4个字符',item);
					errmsgcode = -1;
					return false;
				}

				if( !(/^[\u4E00-\u9FA5\uF900-\uFA2D\w]+$/.test(_val)) )	{
					tipPost('帐号不能包含特殊符号',item);
					errmsgcode = -1;
					return false;					
				}

				$.post(_checkUrl,
					{pm:1,admin_name:_val},
					function(res){
						if(res.s==0){
							tipPost(res.mes,item);
							errmsgcode = -1;
						}
					},'json'
				);
				if(errmsgcode==-1) return false;
			}else if(type&&type == "8") {
				$.post(_checkUrl,
					{pm:0,admin_name:_val},
					function(res){
						if(res.s==0){
							tipPost(res.mes,item);
							errmsgcode = -1;
						}
					},'json'
				);
				if(errmsgcode==-1) return false;

            }else if((type&&type == "100")||(type&&isNaN(type))){		//通用
				
                if(type!="100"){
                    _pxmsg=type
                    };
                tipPost(_pxmsg,item);
                errmsgcode = -1;
                return false;
            }else{
                $('.tipBox').hide();
                errmsgcode = 0;
            }
            errmsgcode = 0;
        }
    });


    function tipPost(msg,item){
        clearTimeout(clrT);
        $('.tipBox').clearQueue();
        $('.tipBox').stop();
        if($(item).is(':visible')){
            if(!$('.tipBox').is(':visible')){
                $('.tipBox').size()=="0"?$tip.appendTo($(document.body)).show().css('opacity','1'):$('.tipBox').show().css('opacity','1');
                //$(item).focus();
                $('.tipBox').css({
                    "left":$(item).offset().left,
                    "top":$(item).offset().top+$(item).outerHeight(),
                    "display":"block",
					"z-index":"50000"
                });
                $('.tipBox').find(".top-err").text(msg);
                $_ScrollBot.scrollHeight=$(item).offset().top;
				if($_ScrollBot.scrollHeight>$(document).scrollTop()&&$_ScrollBot.scrollHeight<$(document).scrollTop()+$(window).height()){}else{
                $_ScrollBot.pageScroll();}
                //redbox(item);
                clrT = setTimeout(function(){
                    $('.tipBox').clearQueue();
                    $('.tipBox').stop();
                    $('.tipBox').animate({
                        'opacity':'0'
                    },1500,function(){
                        $('.tipBox').hide()
                        })		
                },2000);
            }
        }
    }

    return errmsgcode==0 ? true : false;
}



//错误验证
function err_tip_error(obj,type,_pxmsg){
    $('.tipBox').hide();
    var clrT = null;
    var $tip = $("<div class=\"tipBox\"><div class=\"outTip\"><div class=\"outDot\">◇<div class=\"inDot\">◆</div></div><span class=\"top-err\"></span></div></div>");
    $(obj).each(function(i,item){

        $('.tipBox').hide();
        if(type&&type == "0"){
            var _val = $(item).val();
            var rag = new RegExp(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)
            if(!rag.test(_val)){
                tipPost("您输入的邮箱格式不对",item);
                errmsgcode = -1;
                return false;
            }
        }else if(type&&type == "1"){
            tipPost("此帐号不存在",item);
            errmsgcode = -1;
            return false;
        }else if(type&&type == "2"){
            tipPost("验证码不正确",item);
            errmsgcode = -1;
            return false;
        }else if(type&&type == "3"){
            tipPost("密码不正确",item);
            errmsgcode = -1;
            return false;
        }else if((type&&type == "100")||(type&&isNaN(type))){		//通用
				
            if(type!="100"){
                _pxmsg=type
                };
            tipPost(_pxmsg,item);
            errmsgcode = -1;
            return false;
        }else{
            $('.tipBox').hide();
            errmsgcode = 0;
        }
        errmsgcode = 0;
		
    });


    function tipPost(msg,item){
        clearTimeout(clrT);
        $('.tipBox').clearQueue();
        $('.tipBox').stop();
        if($(item).is(':visible')){
            if(!$('.tipBox').is(':visible')){
                $('.tipBox').size()=="0"?$tip.appendTo($(document.body)).show().css('opacity','1'):$('.tipBox').show().css('opacity','1');
                //$(item).focus();
                $('.tipBox').css({
                    "left":$(item).offset().left,
                    "top":$(item).offset().top+$(item).outerHeight(),
                    "display":"block"
                });
                $('.tipBox').find(".top-err").text(msg);
                $_ScrollBot.scrollHeight=$(item).offset().top;
				if($_ScrollBot.scrollHeight>$(document).scrollTop()&&$_ScrollBot.scrollHeight<$(document).scrollTop()+$(window).height()){}else{
                $_ScrollBot.pageScroll();}
                //redbox(item);
                clrT = setTimeout(function(){
                    $('.tipBox').clearQueue();
                    $('.tipBox').stop();
                    $('.tipBox').animate({
                        'opacity':'0'
                    },1500,function(){
                        $('.tipBox').hide()
                        })		
                },2000);
            }
        }
    }

    return errmsgcode==0 ? true : false;
}



function redbox(item){
    if($(item).is('input')&&!document.all){
        $(item).css({
            "box-shadow":"0 0 3px #e70000",
            "border-color":"#e70000"
        }).delay(1).animate({
            "box-shadow":"0 0 3px #fff",
            "border-color":"#fff"
        }).animate({
            "box-shadow":"0 0 3px #e70000",
            "border-color":"#e70000"
        }).animate({
            "box-shadow":"0 0 3px #fff",
            "border-color":"#fff"
        }).animate({
            "box-shadow":"0 0 3px #e70000",
            "border-color":"#e70000"
        });
    }
}

//遍历class或id为obj执行blur()事件
function eachCheck(obj){
    $(obj).each(function(){
        $(this).blur();
        if(errmsgcode==-1){
            return false;
        }
    });
    return errmsgcode==0 ? true : false;
}
//判断汉字
function chkIsHalf(str) {  
    for (var i=0;i<str.length;i++) {     
        strCode = str.charCodeAt(i);     
        if ( (strCode>65248) || (strCode==12288) ) {     
            return true;   
        }   
   }
   return false;
}

// JavaScript Document
$(function(){
    //页面加载完成
    $('li').live('mouseenter',function(){
        $('.selDelete').hide();
        $(this).find('.selDelete').show();
    })
    //添加删除技能
    var $dd = $('.addSkill').prev('dd');
    var _n = $dd.attr('num')?$dd.attr('num'):0;
    $('.addSkillBtn').click(function(){
        _n++;
        var $a = $(this).parents('.addSkill');
        var $cl = $dd.clone().attr('num',_n);
        $cl.find('a').removeAttr('tr_id');
        var num = $a.index();
        $cl.insertBefore($a);
        $cl.find('.num').text(num);
        $cl.find(':text').val("").css("color","#adadad");
        $cl.find('.sk_close').show();
        $cl.find('select').val('了解');
    })
    $('.sk_close').live('click',function(){
        $(this).parents('dd:first').remove();
        for(var i=0;i<$('.skill_list').size();i++){
            $('.skill_list').eq(i).find('.num').text(i+1);
        }
        if($('.skill_list').size() <= 1){
            $('.sk_close').hide();
        }
    });


    $(document).ready(function(){
        if($('.skill_list').size() <= 1){
            $('.sk_close').hide();
        }	
    });
	
	 $(".alertKill").live("click",function(){
		$("#alertLayle").remove();
		$("#alertIframe").remove(); 
	 })	
	 $(document).keydown(function(e){
	 	if(e.keyCode==13){
		$("#alertLayle").remove();
		$("#alertIframe").remove(); 
		}
	 })


//结束

})


// 重写 alert
function alert(message,tit){
	var $tit="";
	if(tit){
		$tit=tit;
	}else{
		$tit='&nbsp;';
	}
	 $("body").append("<div class=\"pop\" id=\"alertLayle\" style=\"display:none\"><div class=\"clearfix popInner\"><h4><a class=\"popCl alertKill\"></a><span>"+$tit+"</span></h4><div class=\"popCon2\"></div></div></div>");
	 $('#alertLayle .popCon2').html(message);
	 $("#alertLayle").show();
	 var $iframe = $("<div id=\"alertIframe\"><div id=\"vayDiv\"  style=\"width:100%;height:"+$(document).height()+"px;top:0px;left:0px; position:absolute; z-index:9999; border-style:none;filter:alpha(opacity=10);opacity:0.1; background:#000 \"></div><iframe width=\"100%\" style=\"height:"+$(document).height()+"px;top:0px; position:absolute; z-index:89998; border-style:none;filter:alpha(opacity=0);opacity:0; \"></iframe></div>");	
	$('#alertIframe').size()=="0"?$iframe.appendTo($(document.body)):$('#alertIframe').show();	
	 $('#alertLayle').width($('#alertLayle .popCon2').outerWidth()+20+'px');
	 var _w = $('#alertLayle').outerWidth(), _h =$('#alertLayle').outerHeight();
	 var _top = $(window).height()-_h,_left = $(window).width() - _w;
	 var scrTop = $(window).scrollTop();
	 $('#alertLayle').css({left:_left*0.5 +"px",top:(_top*0.5 + scrTop)+"px","z-index":"89999"});	 
	 $(".alertKill").live("click",function(){
		$(this).parents("#alertLayle").remove();
		$("#alertIframe").remove(); 
	 })	
	 $(document).keydown(function(e){
	 	if(e.keyCode==13){
		$("#alertLayle").remove();
		$("#alertIframe").remove(); 
		}
	 })
}

//去除字符串空格和分号
function LTrimstr(str)
{
    var i;
    for(i=0;i<str.length;i++)
    {
        if(str.charAt(i)!=" "&&str.charAt(i)!=";")break;
    }
    str=str.substring(i,str.length);
    return str;
}
function RTrimstr(str)
{
    var i;
    for(i=str.length-1;i>=0;i--)
    {
        if(str.charAt(i)!=" "&&str.charAt(i)!=";")break;
    }
    str=str.substring(0,i+1);
    return str;
}
function Trimstr(str)
{
    return LTrimstr(RTrimstr(str));
}

//企业帮助页面导航状态
$(function(){
    var navON = $('#navOn').val();
    if(navON == 'index'){
        $('.nav-list li:eq(0)').addClass('hover');
    };
    
    if(navON == 'helpa'){
        $('.nav-list li:eq(4)').addClass('hover');
        $('.help-nav ul li:eq(0)').addClass('here');
    };
    if(navON == 'helpb'){
        $('.nav-list li:eq(4)').addClass('hover');
        $('.help-nav ul li:eq(1)').addClass('here');
    };
    if(navON == 'helpc'){
        $('.nav-list li:eq(4)').addClass('hover');
        $('.help-nav ul li:eq(2)').addClass('here');
    };
    if(navON == 'helpd'){
        $('.nav-list li:eq(4)').addClass('hover');
        $('.help-nav ul li:eq(3)').addClass('here');
    };
    if(navON == 'ressa'){
        $('.nav-list li:eq(5)').addClass('hover');
    };
})
//side left up down
function h(d,i){
    var obj = document.getElementById(d);
    var objImg = document.getElementById(i);
    if(obj.style.display=="none"){
        obj.style.display="";
        objImg.src="../../images/bCenter/side-b.gif";
    }
    else
    {  	
        obj.style.display="none";
        objImg.src="../../images/bCenter/side-a.gif";
    }
}

//side left up down
function changeLeftBar(d,i){
    var obj = document.getElementById(d);
    var objImg = document.getElementById(i);
    if(obj.style.display=="none"){
        obj.style.display="";
        objImg.src="../../images/bCenter/side-b.gif";
    }
    else
    {  	
        obj.style.display="none";
        objImg.src="../../images/bCenter/side-a.gif";
    }
}

_pscroll.pageScroll = function(height){
    if(jQuery.browser.mozilla || jQuery.browser.msie){
        window.scrollBy(0,-20);
        scrolldelay = setTimeout('_pscroll.pageScroll('+height+')',1);
        if(document.documentElement.scrollTop < height) clearTimeout(scrolldelay);        
    }else{
        scroll(0, height);
    }
}


$(function(){

//初始化input提示
$("input[type='text']").each(function(){
	if($(this).val()==""||$(this).val()==$(this).attr("placeholder")){
		$(this).val($(this).attr("placeholder"));
		$(this).css("color","#adadad");
	}
})
if($.browser.msie){
	$("input[type='password']").each(function(i,item){
		if($(item).attr('placeholder')){
			var p={
				$la : $("<label class='pwdholder'>"+$(item).attr('placeholder')+"</label>"),
				_t : $(item).offset().top + 5,
				_l : $(item).offset().left +7
			}
			if(!$(item).is(':visible')){
				$(item).parent().addClass('pos-r');
				p.$la.insertBefore($(item)).css({position:"absolute",left:p._l,top:p._t,display:"block",color:"#ADADAD"});
			}else{
				p.$la.appendTo($(document.body)).css({position:"absolute",left:p._l,top:p._t,display:"block",color:"#ADADAD"});
			}
			$(item).focus(function(){
				p.$la.hide();
			});
			$(item).blur(function(){
				if($(item).val()=== $(item).attr('placeholder')||$(item).val()==""){
					p.$la.show()
				}
			})
		}
	})
}
//鼠标经过技能框效果
$("input[type='text'],input[type='password'],textarea").live('focus',function(){
	if(!$(this).hasClass('nostyle')){
    $(this).clearQueue();
    $(this).stop();
    $(this).addClass("active_t");
    $(this).css({
        "color":"",
        "box-shadow":"0 0 3px #08c",
        "border-color":"#08c"
    });
    if($(this).val()==$(this).attr("placeholder")){
        $(this).val("");
    }
	}
})

$("input[type='text'],input[type='password'],textarea").live('blur',function(){
	if(!$(this).hasClass('nostyle')){
    $(this).removeClass("active_t");
    $(this).css({
        "box-shadow":"",
        "border-color":""
    });
    if($(this).val()==""||$(this).val()==$(this).attr("placeholder")){
        if(!$(this).is(':password')){
            $(this).val($(this).attr("placeholder"));
        };
        $(this).css("color","#adadad");
    }
	}
})

//隐藏密码提示
	$('.pwdholder').click(function(){
		$(this).hide();
		$('input[type=password]').focus();
	})
})  
// 重写 alert
//function alert(message){
//	 $("body").append("<div class=\"pop\" id=\"alertLayle\" style=\"display:none\"><div class=\"clearfix popInner\"><h4><a class=\"popCl alertKill\"></a><span></span></h4><div class=\"popCon2\"></div></div></div>");
//	 $('#alertLayle .popCon2').html(message);
//	 $("#alertLayle").show();
//	 var $iframe = $("<div id=\"alertIframe\"><div id=\"vayDiv\"  style=\"width:100%;height:"+$(document).height()+"px;top:0px; position:absolute; z-index:9999; border-style:none;filter:alpha(opacity=10);opacity:0.1; background:#000 \"></div><iframe width=\"100%\" style=\"height:"+$(document).height()+"px;top:0px; position:absolute; z-index:99998; border-style:none;filter:alpha(opacity=0);opacity:0; \"></iframe></div>");	
//	$('#alertIframe').size()=="0"?$iframe.appendTo($(document.body)):$('#alertIframe').show();	
//	 $('#alertLayle').width($('#alertLayle .popCon2').outerWidth()+20+'px');
//	 var _w = $('#alertLayle').outerWidth(), _h =$('#alertLayle').outerHeight();
//	 var _top = $(window).height()-_h,_left = $(window).width() - _w;
//	 var scrTop = $(window).scrollTop();
//	 $('#alertLayle').css({left:_left*0.5 +"px",top:(_top*0.5 + scrTop)+"px","z-index":"99999"});	 
//	 $(".alertKill").live("click",function(){
//		$(this).parents("#alertLayle").remove();
//		$("#alertIframe").remove(); 
//	 })	
//	 $(document).keydown(function(e){
//	 	if(e.keyCode==13){
//		$("#alertLayle").remove();
//		$("#alertIframe").remove(); 
//		}
//	 })
//}        
        