var __marks__={
	_add:[], _del:[],_old:[],_all:[],
	_api:'/changeindex/update',
	_url:'/inbox/ajaxtab',
	init:function($list){
		// 初始化
		var a=[];
		var $t=this;
		$t._old=[];
		$('.tdCheck').each(function(){
			if($(this).attr('checked')){
				var b=$(this).attr('tabid').split(',');
				for(var i=0;i<b.length;i++){
					if($.inArray(b[i],$t._old)==-1){
						$t._all.push(b[i]);
						$t._old.push(b[i]);
					}
				}
				a.push(b);
			}
		});
		for(var i=$t._all.length;i>=0;i--){
			for(var j=0;j<a.length;j++){
				if($.inArray($t._all[i], a[j])==-1){
					$t._all.splice(i,1);
				}
			}
		};
		$list.each(function(){
			var $a=$(this).find('a');
			var v=$(this).attr('val');
			$a.removeClass('checked');
			$a.removeClass('checksome');
			if($.inArray(v,$t._old)!=-1){
				if($.inArray(v,$t._all)==-1){
					$a.addClass('checksome');
				}else{
					$a.addClass('checked');
				}
			}
		});
	},
	click:function($item){
		// 点击
		var $t=this;
		var $a=$item.find('a');
		var v=$item.attr('val');
		if($a.hasClass('checksome')){ // checksome
			$a.removeClass('checksome');
			$a.addClass('checked');
			$t.value(v,'add');
		}else if($a.hasClass('checked')){ // checked
			$a.removeClass('checked');
			if($.inArray(v,$t._old)==-1){
				$t.value(v,'clear');
			}else{
				$t.value(v,'del');
			}
		}else{ // nothing
			if($.inArray(v,$t._old)==-1){
				$a.addClass('checked');
				$t.value(v,'add');
			}else{
				if($.inArray(v,$t._all)==-1){
					$a.addClass('checksome');
				}else{
					$a.addClass('checked');
				}
				$t.value(v,'clear');
			}
		}
	},
	remove:function($item){
		// 删除
		var $t=this;
		var v=$item.attr('val');
		$.post($t._url,{act:'del',val:v},function(d,s){
			if(s=='success' && d=='1'){
				$t.value(v,'clear');
				$item.remove();
			}
		});
	},
	button:function($btn){
		var $t=this;
		if($btn.hasClass('btn-add')){
			// 添加
			var $a=$('.pop-form input[type=text]');
			var b=$a.attr('placeholder');
			var v=$.trim($a.val());
			if(v=='' || v==b){
				alert('请输入备注');
				$a.focus();
				return;
			}
			$btn.attr('disabled', true);
			$.post($t._url,{act:'add',val:v}, function(d,s){
				if(s=='success' && d>0){
					$('<li val="'+d+'"><a>* '+v+'</a><i class="box-del"></i></li>').appendTo('.pop-checkbox ul');
					$a.val(b);
				}
				$btn.attr('disabled',false);
			});
		}else if($btn.hasClass('btn-set')){
			// 应用
			var v=[];
			$('.tdCheck').each(function(){
				if($(this).attr('checked'))
					v.push($(this).val());
			});
			if(v.length==0){
				alert('请选择要应用备注的简历');
				return;
			}
			if($t._add.length==0 && $t._del.length==0){
				 alert('请选择要应用的备注');
				 return;
			}
			$btn.attr('disabled', true);
			$.post($t._url,{act:'set',val:$t._add.join(',')+'|'+v.join(',')+'|'+$t._del.join(','),flg:$btn.attr('flag')},function(d,s){
				if(s=='success' && d>0){
					for(var i=0;i<v.length;i++){
						$.post($t._api, {id:v[i]});
					}
					alert('备注应用成功');
					setTimeout(function(){
						location.reload();
					}, 1000);
				}else{
					alert('备注应用失败，请重试');
				}
				$btn.attr('disabled',false);
			});
		}
	},
	value:function(v,a){
		var $t=this;
		switch(a){
			case 'del':
				if($.inArray(v,$t._del)==-1) $t._del.push(v);
				$t._add=$.grep($t._add,function(n,i){return n!=v;});
				break;
			case 'clear':
				$t._add=$.grep($t._add,function(n,i){return n!=v;});
				$t._del=$.grep($t._del,function(n,i){return n!=v;});
				break;
			case 'add':
			default:
				if($.inArray(v,$t._add)==-1) $t._add.push(v);
				$t._del=$.grep($t._del,function(n,i){return n!=v;});
		}
	}
}

//cookie设置
var __aboutCookie__={
	setCookie:function(objName,objValue,objHours){//添加cookie
		var str = objName + "=" + escape(objValue);
		if(objHours > 0){//为0时不设定过期时间，浏览器关闭时cookie自动消失
		var date = new Date();
		var ms = objHours*3600*1000;
		date.setTime(date.getTime() + ms);
		str += "; expires=" + date.toGMTString();
		}
		document.cookie = str;
	},
	getCookie:function(objName){//获取指定名称的cookie的值
		var arrStr = document.cookie.split("; ");
		for(var i = 0;i < arrStr.length;i ++){
		var temp = arrStr[i].split("=");
		if(temp[0] == objName) return unescape(temp[1]);
		}
	},
	delCookie:function(objName){//为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
		var date = new Date();
		date.setTime(date.getTime() - 10000);
		document.cookie = objName + "=a; expires=" + date.toGMTString();
	}
	
}
//页面加载完执行
$(function(){
	$('.search-list tr:even').css('background','#f5f5f5');
	$('.icon-favored,.icon-favor').click(function(){		
		if($(this).hasClass('icon-favored')){
			$(this).addClass('icon-favor');
			$(this).removeClass('icon-favored');
		}else{
			$(this).addClass('icon-favored');
			$(this).removeClass('icon-favor');		
		}
	})
	$('.icon-atted,.icon-att').click(function(){		
		if($(this).hasClass('icon-atted')){
			$(this).addClass('icon-att');
			$(this).removeClass('icon-atted');
		}else{
			$(this).addClass('icon-atted');
			$(this).removeClass('icon-att');		
		}
	})
	//全选实例
	checkAll('allCheck','tdCheck');
	//下拉菜单
	$('.select').find('i:first').keydown(function(e){
		e=e||window.event;
		if(e.keyCode==13){
			$(this).blur();
			$(this).closest('.select').mouseleave();
			e.preventDefault();
			e.stopPropagation();
		}
	})
	$('.select').live('click',function(){
		var $holder=$(this).find('i:first');
		if($holder.attr('contenteditable')&&$holder.attr('placeholder')==$holder.text()){
			$holder.text('');
		}
		if($(this).hasClass('search-tale-searbox')){
			return false;
		}
		$(this).find('.sel-ops').slideDown('fast');
	})
	$('.select i').blur(function(){
		var $holder=$(this);
		if($holder.attr('contenteditable')&&$holder.text()==''){
			$holder.text($holder.attr('placeholder'));
		}
		$holder.mouseenter();
	})
	$('.select i').keyup(function(){
		var $this = $(this);
		$this.siblings('input[type=hidden]:first').val($this.text())
		if($this.text()==''){
			$this.text('');
		}
	})
	$('.select').live('mouseleave',function(){
		$(this).find('.sel-ops').slideUp('fast');
	})
	
	$('.sel-ops li').live('click',function(e){
		e=e||window.event;
		e.preventDefault();
		e.stopPropagation();
		var a=$(this).text();
		var b=$(this).attr('val');
		var $c=$(this).closest('.select');
		var d=$c.find('input[type=hidden]');
		var f=d.attr('act');
		var g=d.attr('gte');//大于等于
		var l=d.attr('lte');//小于等于
		var v=d.attr('val');//默认值
		var $firV=b;
		if(g && $('input[name='+g+']')){
			$firV=parseInt($('input[name='+g+']').val());
		}
		var $sec=$('input[name='+l+']').siblings('.sel-ops').find('li');
		var secV =$('input[name='+l+']').val();
		if(secV==''){secV=v;}
		$sec.removeClass('hide');
		$sec.each(function(){
			if(parseInt($(this).attr('val'))<$firV){
				$(this).addClass('hide');
			}
		});
		if(parseInt($firV)>parseInt(secV)){
			$('input[name='+l+']').val($firV);
			$('input[name='+l+']').siblings('i').text(a)
		}
		$c.find('i').text(a);
		if(a.indexOf('不限')>=0||a.indexOf('请选择')>=0){
			$c.find('i').css('color','');
		}else{
			$c.find('i').css('color','#333');
		}
		d.val(b);
		$c.find('.sel-ops').slideUp('fast');
		if(f && $('#'+f)) $('#'+f).submit();
		__comLayer__.inputValChkUn();//遍历“不限”
	})
	$('.t-text2').bind('mouseenter mouseout mouseover',function(){
		var $this=$(this).find('i');
		var a=$this.text();
		if(a.indexOf('不限')>=0||a.indexOf('请选择')>=0){
			$this.css('color','');
		}else{
			$this.css('color','#333');
		}
	})
	//搜索-下拉菜单
	$('.search-tale-keyword').live('keydown keyup change',function(){
		var $this=$(this);
		var v=$this.val();
		if(v!=''&&v!=$this.attr('placeholder')){
			$this.siblings('.sel-ops').slideDown('fast');
		}else{
			$this.siblings('.sel-ops').slideUp('fast');
		}
		$this.siblings('.sel-ops').find('li b').each(function() {
            $(this).text(v);
        });
		__comLayer__.inputValChkUn();
	})
	//搜索框按键控制
	$('.search-tale-keyword').live('keydown',function(e){
		e=e||window.event;
		var $this=$(this);
		var $ul=$this.siblings('.sel-ops');
		var $hidden=$this.siblings('input[type="hidden"]:first');
		var v=$this.val();
		var _v=$hidden.val();
		var $hov;
		//按键上
		if(e.keyCode==38){
		e.preventDefault();
		e.stopPropagation();
			if(!$ul.is(':visible')){return false;}
			if($ul.find('.js-hov').size()==0){
				$ul.find('li:last').addClass('js-hov');
			}else{
				$hov=$ul.find('.js-hov');
				$ul.find('li').removeClass('js-hov');
				if($hov.prev('li').size()==0){
					$this.val(v);
					$hidden.val(_v);
					return false;
				}
				$hov.prev('li').addClass('js-hov');
			}
			$hidden.val($ul.find('.js-hov').attr('val'));
			$this.val($ul.find('.js-hov b').text());
		}
		//按键下
		if(e.keyCode==40){
		e.preventDefault();
		e.stopPropagation();
			if(!$ul.is(':visible')){return false;}
			if($ul.find('.js-hov').size()==0){
				$ul.find('li:first').addClass('js-hov');
			}else{
				$hov=$ul.find('.js-hov');
				$ul.find('li').removeClass('js-hov');
				if($hov.next('li').size()==0){
					$this.val(v);
					$hidden.val(_v);
					return false;
				}
				$hov.next('li').addClass('js-hov');
			}
			$hidden.val($ul.find('.js-hov').attr('val'));
			$this.val($ul.find('.js-hov b').text());
		}
		__comLayer__.inputValChkUn();
	})
	//鼠标经过下拉的效果
	$('.sel-ops li,.float-pop-list li').live({
		mouseenter:function(){
			$(this).siblings('li').removeClass('js-hov');
			$(this).addClass('js-hov');
		},
		mouseleave:function(){
			$(this).removeClass('js-hov');
		}
	})
	//其他触发器
	$('.trigger-export,.trigger-marks,.trigger-view').click(function(e){
		e=e||window.event;
		e.preventDefault();
		e.stopPropagation();
		var $a=$(this).next('.float-pop-list');
		var x=parseInt($(this).offset().left);
		var y=parseInt($(this).offset().top)+parseInt($(this).outerHeight()+2);
		$a.css({'left':x+'px','top':y+'px'})
		$a.slideToggle('fast');
		setTimeout(function(){$a.addClass('canslide');} , 1);
		//添加备注
		if($(this).hasClass('trigger-marks')){
			__marks__.init($a.find('li'));
		}
	})
	$('.float-pop-list').hover(function(){
		$(this).removeClass('canslide');
	},function(){
		$(this).addClass('canslide');
	})
	$(document).click(function(){
		$('.canslide').slideUp('fast');
		$('.canslide').removeClass('canslide');
	})
	//单选按钮点击
	$('.pop-radio li').live('click',function(){
		var $a=$(this).find('a');
		var $b=$(this).closest('ul');
		$b.find('.checked').removeClass('checked');
		$a.addClass('checked');
	})
	//备注多选按钮点击
	$('.pop-checkbox li').live('click',function(){
		__marks__.click($(this));
	})
	//删除备注
	$('.pop-checkbox li .box-del').live('click',function(e){
		e=e||window.event;
		e.preventDefault();
		e.stopPropagation();
		var $a=$(this).closest('li');
		__marks__.remove($a);
	})
	//添加&应用备注
	$('.pop-form input[type=button]').live('click',function(e){
		__marks__.button($(this));
	})
	//高级搜索收缩
	$('.search-togg').click(function(){
		var a= $('.search-togg').find('div');
		if(a.hasClass('search-togg-down')){
			$('.search-tale-more').slideDown('fast');
			$('#SlideStat').val('1');
			a.removeClass('search-togg-down').addClass('search-togg-up')
		}else{
			$('.search-tale-more').slideUp('fast');
			$('#SlideStat').val('0');
			a.removeClass('search-togg-up').addClass('search-togg-down')
		}
	})
	if($('.search-tale-more').is(':visible')){
		$('.search-togg').find('div').removeClass('search-togg-down').addClass('search-togg-up')
	}else{
		$('.search-togg').find('div').removeClass('search-togg-up').addClass('search-togg-down')
	}
	$('.search-togg').fadeTo(1,0.5)
	$('.search-togg').hover(function(){
		$(this).clearQueue().stop().fadeTo('fast',1);
	},function(){
		$(this).clearQueue().stop().fadeTo('fast',0.5);
	})
	//购买
/*	
	$('.buy-btn').click(function(){
		var a=$('.search-list .tdCheck:checked').size();
		if(a==0){
			alert('没选择购买项！');
		}
		var b=0;
		var list='';
		$('.search-list .tdCheck:checked').each(function(){
			if($(this).siblings('.icon-buyed').size()==0){
				b+=1;
				var id=$(this).closest('tr').find('.resume-id').text();
				list+='<li><a class="buy-del">×</a><a class="res-id" href="">'+id+'</a></li>'
			}
		})
		if($('.buy-car').size()==0&&a!=0){
			var $html=$('<div class="pop buy-car hide"><div class="clearfix popInner"><h4><a class="popClose alertKill"></a><span class="pop_tit"><b>购买确认</b></span></h4><div class="popdem"><div class="buy-car-main"><div class="buy-cay-info">您选择了'+a+'份简历，需要付费购买的有'+b+'份，共计'+(b*10)+'元</div><div class="buy-car-list clearfix"><ul>'+list+'</ul></div><p align="center"><span class="btn75_33 buy-ok">确认</span></p></div></div></div></div>');
			$html.appendTo($('body'));
			var posX=(parseInt($(window).width())-parseInt($('.buy-car').outerWidth()))/2;
			var posY=(parseInt($(window).height())-parseInt($('.buy-car').outerHeight()))/2+parseInt($(document).scrollTop());
			if(parseInt($(window).height()) < parseInt($('.buy-car').outerHeight())){
				posY = parseInt($(document).scrollTop())+20;
			}
			$('.buy-car').css({
				'display':'block',
				'left':posX+'px',
				'top':posY+'px',
				'z-index':'2000'
			})
		}
	})
	//关闭购买框
	$('.buy-car .popClose').live('click',function(){
		$('.buy-car').remove();
	})
	//删除已购买简历
	$('.buy-car .buy-del').live('click',function(){
		$(this).closest('li').remove();
	})
	//确认购买
	$('.buy-car .buy-ok').live('click',function(){
		var id=$(this).closest('.buy-car').find('.res-id');
		id.each(function(){
			var a=$(this).text();
            $('.search-list .resume-id').each(function() {
                if($(this).text()==a){
					$(this).closest('tr').find('.icon-buy').removeClass('icon-buy').addClass('icon-buyed');
				}
            });
        });
		$('.buy-car').remove();
		alert('购买成功!');
	})
	$('.icon-buy').live('click',function(){
		var $a=$(this).closest('tr').find('.tdCheck');
		if($a.attr('checked')!='true'){
			$a.click();
		}
		$('.buy-btn').click();
	})
*/	
	//转发简历 下拉选择email
	//框效果
	$(".recive-item input:first").live('focus',function(){
		var $this = $(this).closest('.t-text2');
		$this.clearQueue();
		$this.stop();
		$this.addClass("active_t");
		$this.css({
			"color":"",
			"box-shadow":"0 0 3px #08c",
			"border-color":"#08c"
		});
	})
	
	$(".recive-item input:first").live('blur',function(){
		var $this = $(this).closest('.t-text2');
		$this.removeClass("active_t");
		$this.css({
			"box-shadow":"",
			"border-color":""
		});
	})
	//选择收件人按钮
	$('.trigger-recive').live('click',function(e){
		var $this = $(this);
		e=e||window.event;
		e.preventDefault();
		e.stopPropagation();
		var list=$this.closest('#wrapper_zf').find('.recive-id-list');
		if(parseInt(list.outerHeight())>200){
			list.height("200px");
		}
		setTimeout(function(){
			list.addClass('canslide');
			list.clearQueue().stop().slideToggle('fast');} , 2)
		$this.closest('#wrapper_zf').find('.recive-item input:first').focus();
	})
	//关闭邮箱列表
	$('.recive-id-list').live({
		mouseenter:function(){
			$(this).removeClass('canslide');
		},
		mouseleave:function(){
			$(this).addClass('canslide');
		}
	});
	//点选邮箱
	$('.recive-id-list a').live('click',function(){
		var $this = $(this);
		var input = $('.recive-id-list a').closest('#wrapper_zf').find('.recive-item input[type="hidden"]');
		var txt = $this.find('b').text();
		$this.closest('#wrapper_zf').find('.recive-item input:first').focus();
		if(!$this.hasClass('on')){
			if($this.closest('#wrapper_zf').find('.recive-item a').size()>2){
				err_tip_error($this.closest('#wrapper_zf').find('.recive-item input:first'), 100, "最多可以输入三个邮箱");
				return false;
			}
			__comLayer__.renderBox(txt,$this);
			input.val(input.val()+txt.replace(/<[^>]*>/,'')+";");
			$this.addClass('on');
		}
		
	})
	//设置输入框焦点
	$('.recive-item').live('click',function(){
		$(this).find('input:first').focus()
	})
	//输入框手动输入
	$('.recive-item input:first').live('keyup',function(e){
		e=e||window.event;
		var $this=$(this);
		var input=$this.siblings('input[type="hidden"]');
		var $thisv=$this.val();
		if(e.keyCode==186||e.keyCode==59){
			if($this.closest('#wrapper_zf').find('.recive-item a').size()>2){
				err_tip_error($this.closest('#wrapper_zf').find('.recive-item input:first'), 100, "最多可以输入三个邮箱");
				return false;
			}
			__comLayer__.renderBox($thisv,$this);
			input.val('');
			$this.attr('size',$this.val().length+5);
			$this.closest('.recive-item').find('a b').each(function(){
				input.val(input.val()+$(this).text().replace(/<[^>]*>/,'')+";");                
            });
			
		}
	})
	//输入框失去焦点
	$('.recive-item input:first').live('blur',function(e){
		e=e||window.event;
		var $this=$(this);
		var input=$this.siblings('input[type="hidden"]');
		var $thisv=$this.val();
		var _q=$thisv.substr($thisv.length-1,1);
		if(_q==";"||_q=="；"){
		}else{
			$thisv+=";";
		}
		if($this.closest('#wrapper_zf').find('.recive-item a').size()>3){
			err_tip_error($this.closest('#wrapper_zf').find('.recive-item input:first'), 100, "最多可以输入三个邮箱");
			return false;
		}
		if($this.closest('#wrapper_zf').find('.recive-item a').size()==3){
			if($this.val()!=''){
				err_tip_error($this.closest('#wrapper_zf').find('.recive-item input:first'), 100, "最多可以输入三个邮箱");
			}
			return false;
		}
		if($thisv.substr($thisv.length-1)!=';'){
			$thisv = $thisv+';';
			$this.val($thisv);
		}
		__comLayer__.renderBox($thisv,$this);
		input.val('');
		$this.attr('size',$this.val().length+5);
		$this.closest('.recive-item').find('a b').each(function(){
			input.val(input.val()+$(this).text().replace(/<[^>]*>/,'')+";");                
		});
	})
	//键盘删除邮箱
	$('.recive-item input:first').live('keydown',function(e){
		e=e||window.event;
		var $this=$(this);
		$this.attr('size',$this.val().length+5);
		if(e.keyCode==8&&$this.val()==''){
			$this.closest('.recive-item').find('a:last').click();
		}
	})
	//点击删除邮箱
	$('.recive-item a').live('click',function(){
		var $this = $(this);
		var txt = $this.find('b').text().replace(/<[^>]*>/,'');
		var input = $this.closest('.recive-item').find('input[type="hidden"]');
		var val = input.val().split(";");
		input.val("");
		for(var i=0;i<val.length;i++){
			if(val[i]!=txt&&val[i]!=''){
				input.val(input.val()+val[i]+';');
			}else{
				$this.closest('#wrapper_zf').find('.recive-id-list a').each(function(){
					var on = $(this);
                    if($(this).find('b').text().replace(/<[^>]*>/,'')==val[i]){
						on.removeClass('on');
					}
                });
			}
		}
		$this.remove();
		$this.closest('#wrapper_zf').find('.recive-item input:first').focus();
	})
	//字数限制
		__comLayer__.typeLimit('#wrapper_zf .textarea-lim',100,'#wrapper_zf .type-lim-now',1);
	//提交
	$('#wrapper_zf #send_forward_btn').live('click',function() {
		var _flag = true;
		var emails = $('#email').val();
		var subject = $('#subject').val();
		var content = $('#content').val();
		var ids = $('#ids').val();
		var flag = $('#flag').val();
		
		if (emails.length != 0) {
			if (chkIsHalf(emails)) {
				err_tip_error($('#email'), 100, "您输入的邮箱中包含全角字符");
				_flag = false;
				return false;
			}
			var email_list = emails.split(";");
			if (email_list.length == 0) {
				err_tip_error($('#email'), 100, "您输入的邮箱格式不对");
				_flag = false;
				return false;
			} else {
				if (email_list.length > 4) {
					err_tip_error($('#emailput'), 100, "最多可以输入三个邮箱");
					_flag = false;
					return false;
				}
				var len = email_list.length;
				var rag = new RegExp(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)
				
				for (var i = 0; i < len; i++) {
					if(!rag.test(email_list[i])&&email_list[i]!=''){
				    	err_tip_error($('#email'), 100, "您输入的邮箱[" + email_list[i] + "]格式不对");
				    	_flag = false;
				        return false;
				    }
				}
			}
		} else {
			err_tip_error($('#emailput'), 100, "请填写正确的邮箱");
			_flag = false;
			return false;
		}
	
		if (subject.length == 0) {
			err_tip_error($('#subject'), 100, "该项不能为空");
			_flag = false;
			return false;
		}
		var curLength = content.length;
		if (curLength == 0) {
			err_tip_error($('#content'), 100, "该项不能为空");
			_flag = false;
			return false;
		} else if(curLength > 100 ) {
			err_tip_error($('#content'), 100, "超过字数限制");
			_flag = false;
			return false;
		}
        
		$('.submit_zhuanfa').html('<img src="/images/bCenter/min_loadding.gif">...');
        
		if (_flag) {
			$.ajax({
                type: "post",
                url : '/inbox/AjaxSendForward',
                data: 'emailList=' + emails + '&subject=' + subject + '&content=' + content + '&ids=' + ids + '&flag=' + flag,
				dataType:'json',
                success: function(msg) {
                    if(msg.error == 0) {
                    	alert(msg.message);
                    	$('#popIframe').hide();
                    	$('#popLayle').hide();   	
                    } else {
                    	alert(msg.message);
					}                    
                }
            });
		}
		
	});
	//清空选项
	$('#qingkong').click(function(){
		$('.search-tale .search-tale-keyword').val('').mouseenter();
		$('.search-tale .search-tale-keyword').siblings('input[type="hidden"]').val('');
		$('.search-plug-box i').text('使用快速搜索').mouseenter();
		$('.search-plug-box i').siblings('input[type="hidden"]').val('');
		$('.search-tab-val i').text('不限').mouseenter();
		$('.search-tab-val i').siblings('input[type="hidden"]').val('');
		$('.search-tale-etc span:first').addClass('dispoint');
	})
	//简历附件，删除警示字
	$('.alert-box-close').click(function(){
		$(this).closest('.alert-box-text').remove();
		__aboutCookie__.setCookie('alertBox','off',24);
	})
	//简历附件警示字初始化
	if(__aboutCookie__.getCookie('alertBox')=='off'){
		$('.alert-box-text').hide();
	}else{
		$('.alert-box-text').show();
	}
	
	//浮动提示方法
	function titlepop(obj,txt){
		$(obj).live({
			mouseenter:function(){
				$(".tipsBox").not($(this)).remove();
				var $this = $(this);
				var posX = $(this).offset().left;
				var posY = parseInt($(this).offset().top)-40;
				var tit=txt;
				if(!txt){
					tit=$this.text();
				}
				if(tit){
					var $tip = $("<span class='tipsBox t'><i class='tris'></i><b class='tipsTxt'>"+tit+"</b></span>");
					$tip.appendTo($(document.body)).css({
						'top':posY,
						'left':posX,
						'display':'block',
						'z-index':'10005'
					});
				}
			},
			mouseleave:function(){
				$(".tipsBox").remove();
			}
		});
	}
//浮动提示框定义
	titlepop('.search-tale-etc .dispoint','请先设定搜索条件');

//初始化结束
})
