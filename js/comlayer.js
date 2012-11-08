var slideTogStat = 0;
//收缩展示
function slideTog(obj){
	if(slideTogStat == 1){ return false}
	slideTogStat = 1;
	if(obj.hasClass('slide-on')){
		obj.slideUp('fast','',function(){
			obj.removeClass('slide-on');
			slideTogStat = 0;
		});
	}else{
		if(($.browser.version==6.0)&&!$.support.style){obj.css('display','block');}
		obj.slideDown('fast','',function(){
			obj.addClass('slide-on');
			slideTogStat = 0;
		});
	}
}


var __comLayer__={}



__comLayer__ ={
	
	inputID:["#profession","#industry","#address","#major"],
	popID:[".profession",".industry",".address",".major"],
	popTit:["职业","行业","城市","专业"],
	popWidth:["945px","945px","855px","855px"],
	num:[3,3,3,3],
	dataUrl:["/bcenter/data/baijobProfession.js","/bcenter/data/baijob_industry/baijobIndustry.js","/bcenter/data/baijobAddress.js","/bcenter/data/major_data.js"],
	htmlUrl:["/bcenter/data/profession.html","/bcenter/data/industry.html","/bcenter/data/address.html","/bcenter/data/major.html"],
	htmlMod:[1,1,1,1],
	unlimMod:[0,0,0,0],
	restMod:[0,0,0,0],
	inputMod:[0,0,0,0],
	againInc:[0,0,0,0],
	hideSecCheck:[0,0,0,0],
	
	initInputVal:function(){
		$('.sel-ops').closest('div').find("input[type='hidden']").each(function() {
			var $this = $(this);
			var a = $this.val();
			var $i = $this.siblings('i');
			var $li = $this.siblings('.sel-ops').find('li');
			var	txt='';
			if(a!=''&&$li.size()>0){
				$li.each(function(){
					if($(this).attr('val')==a){
						txt=$(this).text();
						$i.text(txt);
					};
				})
			}
			$i.mouseenter();
        });
	},
	inputValChkUn:function(){
		var n=0;
		var m=0;
		$('.search-tab i').each(function(){
			var v=$(this).text();
			if(v==''||v=='不限'){
				n=0;
			}else{
				n=1;
				return false;
			}
		});
		if($('.search-tale-searbox .t-text2').val()==''||$('.search-tale-searbox .t-text2').val()==$('.search-tale-searbox .t-text2').attr('placeholder')){
			m=0;
		}else{
			m=1;
		}
		if(n==0&&m==0){
			$('.search-tale-etc .btn-com-gray:first').addClass('dispoint');
			return true;
		}else{
			$('.search-tale-etc .btn-com-gray:first').removeClass('dispoint');
			return false;
		}
	},
	insetPop:function(popID,popTit,popWidth){
		if($(popID).size()==0){
			var $html=$('<div class="pop '+popID.substr(1)+' hide" id="comLayle"><div class="clearfix popInner"><h4><a class="popClose alertKill"></a><span class="pop_tit"><b>请选择'+popTit+'</b><em>（最多可选<i class="com-layle-count"></i>项）</em></span></h4><div class="popdem"><div class="com-layer-main"></div></div></div></div>');
			$html.appendTo($('body'));
		}
		var posX=(parseInt($(window).width())-parseInt($(popID).outerWidth()))/2;
		var posY=(parseInt($(window).height())-parseInt($(popID).outerHeight()))/2+parseInt($(document).scrollTop());
		if(parseInt($(window).height()) < parseInt($(popID).outerHeight())){
			posY = parseInt($(document).scrollTop())+20;
		}
		$(popID).css({
			'display':'block',
			'width':popWidth,
			'left':posX+'px',
			'top':posY+'px',
			'z-index':'5000'
		})
	},
	popDataInit:function(inputID,popID){
		if($(inputID).find("input[type='hidden']").val()!=''&&!$(popID).hasClass('reset-val-mod')){
			$(popID).find('.item-del .item-tmp').click();
			var initData = $(inputID).find("input[type='hidden']").val();
			var initDataArray = initData.split(",");
			for(var _k=0;_k<initDataArray.length;_k++){
				$(popID).find('.prof-list').find('#v'+initDataArray[_k]).click();
			}
		}
	},
	triggerPop:function(inputID,popID,popTit,popWidth,num,dataUrl,htmlMod,unlimMod,restMod,hideSecCheck,inputMod){
		var ajaxtp = "json";
		if(htmlMod==1){
			ajaxtp = "html";
		}
		$('.prof-list tr:even').addClass('graytr');
		//控件开始
		$(inputID).live('click',function(){
			$('select').hide();
			$(popID).show();
			__comLayer__.insetPop(popID,popTit,popWidth);
			if(restMod==1){
				$(popID).addClass('reset-val-mod');
				$(popID).find('.tabClose').click();
			}
			if(!$(popID).hasClass('ready')){
				$.ajax({
					async:'true',
					type:'GET',
					url:dataUrl,
					dataType:ajaxtp,
					beforeSend: function(){
							__comLayer__.insetPop(popID,popTit,'400px');
							$(popID).find('.com-layer-main').html('读取中...');
							__comLayer__.insetPop(popID,popTit,'400px');
					},
					success: function(data){
							__comLayer__.insetPop(popID,popTit,popWidth);
							if(htmlMod==1){
								$(popID).html(data);
								$(popID).find('.com-layle-count').text(num);
							}else{
								__comLayer__.renderFun(num,data,popID,popTit);
							}
							if(unlimMod==1){
								$(popID).addClass('hideunlim');
								$('#v0000000000').closest('.item-check').remove();
								$('.unlim-btn').remove();
								$('.unlim').find('i').text('');
							}
							if(hideSecCheck==1){
								$(popID).find('.sort-sec a').hide();
							}
							__comLayer__.insetPop(popID,popTit,popWidth);
							__comLayer__.popDataInit(inputID,popID);
							__comLayer__.clickOkBtn(inputID,popID);
							$(popID).addClass('ready');
							if(num==1){
								$(popID).addClass('mode-radio');
							}
					},
					error:function(){
							__comLayer__.insetPop(popID,popTit,'400px');
							$('.profession').find('.com-layer-main').html('发生错误');
							__comLayer__.insetPop(popID,popTit,'400px');
					}
				})
			}else{
				__comLayer__.popDataInit(inputID,popID);
			}
		})
	},
	

	triggerFun:function(type){//inputID,popID,popTit,popWidth,num,dataUrl,htmlMod,unlimMod,restMod,hideSecCheck,inputMod
		if(__comLayer__.htmlMod[type]==1){
			__comLayer__.triggerPop(__comLayer__.inputID[type],__comLayer__.popID[type],__comLayer__.popTit[type],__comLayer__.popWidth[type],__comLayer__.num[type],__comLayer__.htmlUrl[type],__comLayer__.htmlMod[type],__comLayer__.unlimMod[type],__comLayer__.restMod[type],__comLayer__.hideSecCheck[type],0);//通用	
		}else{
			__comLayer__.triggerPop(__comLayer__.inputID[type],__comLayer__.popID[type],__comLayer__.popTit[type],__comLayer__.popWidth[type],__comLayer__.num[type],__comLayer__.dataUrl[type],__comLayer__.htmlMod[type],__comLayer__.unlimMod[type],__comLayer__.restMod[type],__comLayer__.hideSecCheck[type],0);//通用
		}
	},
	triggerProf:function(num,htmlMod,unlimMod,restMod,hideSecCheck,inputID,popID){
		if(num)__comLayer__.num[0]=num;
		if(htmlMod)__comLayer__.htmlMod[0]=htmlMod;
		if(unlimMod)__comLayer__.unlimMod[0]=unlimMod;
		if(restMod)__comLayer__.restMod[0]=restMod;
		if(hideSecCheck)__comLayer__.hideSecCheck[0]=hideSecCheck;
		if(inputID)__comLayer__.inputID[0]=inputID;
		if(popID)__comLayer__.popID[0]=popID;
		__comLayer__.againInc[0]=1;
	},
	triggerIdtry:function(num,htmlMod,unlimMod,restMod,hideSecCheck,inputID,popID){
		if(num)__comLayer__.num[1]=num;
		if(htmlMod)__comLayer__.htmlMod[1]=htmlMod;
		if(unlimMod)__comLayer__.unlimMod[1]=unlimMod;
		if(restMod)__comLayer__.restMod[1]=restMod;
		if(hideSecCheck)__comLayer__.hideSecCheck[1]=hideSecCheck;
		if(inputID)__comLayer__.inputID[1]=inputID;
		if(popID)__comLayer__.popID[1]=popID;
		__comLayer__.againInc[1]=1;
	},
	triggerAddr:function(num,htmlMod,unlimMod,restMod,hideSecCheck,inputID,popID){
		if(num)__comLayer__.num[2]=num;
		if(htmlMod)__comLayer__.htmlMod[2]=htmlMod;
		if(unlimMod)__comLayer__.unlimMod[2]=unlimMod;
		if(restMod)__comLayer__.restMod[2]=restMod;
		if(hideSecCheck)__comLayer__.hideSecCheck[2]=hideSecCheck;
		if(inputID)__comLayer__.inputID[2]=inputID;
		if(popID)__comLayer__.popID[2]=popID;
		__comLayer__.againInc[2]=1;
	},
	triggerMajor:function(num,htmlMod,unlimMod,restMod,hideSecCheck,inputID,popID){
		if(num)__comLayer__.num[3]=num;
		if(htmlMod)__comLayer__.htmlMod[3]=htmlMod;
		if(unlimMod)__comLayer__.unlimMod[3]=unlimMod;
		if(restMod)__comLayer__.restMod[3]=restMod;
		if(hideSecCheck)__comLayer__.hideSecCheck[3]=hideSecCheck;
		if(inputID)__comLayer__.inputID[3]=inputID;
		if(popID)__comLayer__.popID[3]=popID;
		__comLayer__.againInc[3]=1;
	},
	renderFun:function(num,data,popID,popTit){
		if(popTit=='职业'){
			RenderFun(3,num,data,popID,popTit,'profession_id','profession','sub_id','sub_profession','sub_id','sub_profession');
		}
		if(popTit=='行业'){
			RenderFun(3,num,data,popID,popTit,'industry_id','industry','sub_id','sub_industry','sub_id','sub_industry');
		}
		if(popTit=='城市'){
			RenderFun(5,num,data,popID,popTit,'city_id','city','sub_id','sub_city');
		}
		if(popTit=='专业'){
			RenderFun(4,num,data,popID,popTit,'majorClass_id','majorClass','majorType_id','majorType','sub_id','sub_majorType');
		}
	},
	
	
	
	
	
	
	
	clickOkBtn:function(inputID,popID){
		//点击确认
		$(popID).find('.com-done').bind('click',function(){
			var a='';
			var b='';
			$(this).closest('.item-selected').find('.item-del li').each(function() {
				a+=','+$(this).attr('id').substr(3);
				b+=' | '+$(this).find('i').text();
			});
			$(inputID).find('input[type=hidden]').eq(0).val(a.substr(1));
			$(inputID).find('input[type=hidden]').eq(1).val(b.substr(3));
            if (b.substr(3) !== '不限') {
                $(inputID).find('i').text(b.substr(3)).css('color', '#333');
            }
            else {
                $(inputID).find('i').text(b.substr(3)).css('color', '');
            }
			$(inputID).find('i').attr('tit',b.substr(3));
			$(inputID).mouseenter();
			$(this).closest('.pop').hide();
			if($('#comLayle:visible').size()==0){
				$('select').show()
			}
			__comLayer__.inputValChkUn();//遍历“不限”
		})
	},
	itemfilter:function(obj){

		var a=obj.val().toLowerCase();
		var $fath=obj.closest('.pop');
		if(a==''||a==obj.attr('placeholder')){
			$fath.find('.item-check label').css('color','');
			$fath.find('.item-check,.sort-sec,.item-check,.prof-box tr').show();
			//$('.sort-third').hide();
			return false;
		}
		$fath.find('.sort-sec .item-check,.sort-sec,.sort-third,.prof-box tr').hide();
		$fath.find('.sort-sec label').removeClass('b');
		$fath.find('.sort-third').removeClass('slide-on');
		$fath.find('.item-check label').each(function() {
			var $this=$(this);
			if($this.text().toLowerCase().indexOf(a)<0){
			}else{
				$this.css('color','#c00');
				$this.closest('tr').show();
				$this.closest('.item-check').show();
				$this.closest('.sort-sec').show();
				//$(this).closest('.sort-third').show();
				if($this.closest('.sort-third').size()>0){
					var id=$this.closest('.sort-third').attr('id').substr(1);
					$fath.find('#v'+id).closest('.item-check').show();
					$fath.find('#v'+id).closest('.sort-sec').show();
				}
			}
		});
		$fath.find('.prof-list tr:even').addClass('graytr');
	
	},
	init:function (){
		$('.t-text2').mouseenter();
		//显示title
		$("#wrapper_zf .len").live({
			mouseenter:function(){
				$(".tipsBox").not($(this)).remove();
				var $this = $(this);
				var posX = $(this).offset().left;
				var posY = parseInt($(this).offset().top)-40;
				var tit=$this.text();
				if(tit){
					var $tip = $("<span class='tipsBox t'><i class='tris'></i><b class='tipsTxt'>"+tit+"</b></span>");
					$tip.appendTo($(document.body)).css({
						'top':posY,
						'left':posX,
						'display':'block',
						'z-index':'90000'
					});
				}
			},
			mouseleave:function(){
				$(".tipsBox").remove();
			}
		});
		$('#profession,#industry,#address,#major').hover(function(){
			$(".tipsBox").remove();
			var $this = $(this);
			var posX = $(this).offset().left;
			var posY = parseInt($(this).offset().top)-40;
			var tit=$this.find('i').attr('tit');
			if(tit){
				var $tip = $("<span class='tipsBox t'><i class='tris'></i><b class='tipsTxt'>"+tit+"</b></span><iframe class='tipsBox t tipsBoxMsk' style='display:none;_display:block;position:absolute;filter:mask();'></iframe>");
				$tip.appendTo($(document.body)).css({
					'top':posY,
					'left':posX,
					'display':'block',
					'z-index':'90000'
				});
				$('.tipsBoxMsk').css({
					'top':posY,
					'left':posX,
					'display':'block',
					'z-index':'89999',
					'width':$tip.outerWidth(),
					'height':$tip.outerHeight()
				});
			}
		},function(){
			$(".tipsBox").remove();
		})
		$(document).mousedown(function(){
			$(".tipsBox").remove();
		})
		//关闭弹层
		$('.alertKill').live('click',function(){
			$(this).closest('.pop').hide();
			if($('#comLayle:visible').size()==0){
				$('select').show()
			}
		})
		//不限
		$('.unlim-btn').live('click',function(){
			$(this).closest('.pop').find('.item-check .checked').each(function(){
				$(this).click();
			})
		})
		//筛选
		if(document.all){
				$('.filter-btn').live('click',function(){
				var obj = $(this).siblings('.filter-txt');
				__comLayer__.itemfilter(obj);
			})
		}else{
			$('.filter-txt').live('keyup',function(){
				var obj = $(this);
				__comLayer__.itemfilter(obj);
			})
		}
		//多选按钮
		$('.item-check a').live('click',function(){
			var lim=parseInt($(this).closest('.pop').find('.com-layle-count').text());
			var $lim='<li class=\"unlim\"><i>不限</i></li>'; 
			if($(this).closest('.pop').hasClass('hideunlim')){
				$lim='<li class=\"unlim\"><i></i></li>';
			}
			var $a=$(this);
			var $av=$a.attr('id').substr(1);
			var $b='<li id="val'+$av+'" class="item-tmp"><i>'+$a.next('label').text()+'</i><a class="tabClose">×</a></li>';
			var $c=$a.closest('.pop').find('.item-del').find('#val'+$av);
			if($a.hasClass('checked')){
				if($a.closest('.pop').find('#s'+$av).hasClass('disable')){
					$a.closest('.pop').find('#s'+$av).removeClass('disable');
				}
				$a.removeClass('checked');
				$c.remove();
				if($a.closest('.pop').find('.item-del .item-tmp').size()==0){
					$a.closest('.pop').find('.item-del').append($lim);
				}
			}else{
				if (lim === 1) {
                    $('.item-del').find('li').click();
                }
				if(lim !== 1 && $a.closest('.pop').find('.item-del .item-tmp').size()>=lim){
					alert('最多选择'+lim+'项！');
					return false;
				}
				if($a.closest('.sort-third').hasClass('disable')){
					return false;
				}
				
				$a.closest('.pop').find('#s'+$av).find('a').each(function(){
					if($(this).hasClass('checked')){
						$(this).click();
					}
				});
				$a.closest('.pop').find('#s'+$av).addClass('disable');
				$a.addClass('checked');
				$a.closest('.pop').find('.unlim').remove();
				$a.closest('.pop').find('.item-del').append($b);
			}
		})
		
		$('.item-del .item-tmp').live('click',function(){
			var a=$(this).attr('id').substr(3);
			$(this).closest('.pop').find('#v'+a).click();
		})
		//展开3级
		$('.sort-third label,.no-sub').live('click',function(){
			$(this).prev('a').click();
		})
		$('.sort-sec label').live('click',function(){
			var $fath = $(this).closest('.pop');
			if($(this).hasClass('no-sub')){
				return false;
			}
			if($(this).hasClass('b')){
			$fath.find('.sort-sec label').removeClass('b');
				$(this).removeClass('b');
			}else{
			$fath.find('.sort-sec label').removeClass('b');
				$(this).addClass('b');
			}
			var pos=$(this).closest('.item-check').position().left;
			var pos2=$(this).closest('td').position().left;
			var a=$(this).prev('a').attr('id').substr(1);
			var $a=$fath.find('#s'+a);
				$a.find('.silde-top').css('background-position',-977-parseInt(pos2)+parseInt(pos)+'px 0px');
			if($a.closest('tr').hasClass('graytr')){
				$a.find('.silde-bot').css('background-position',-977-parseInt(pos2)+parseInt(pos)+'px -18px');
			}else{
				$a.find('.silde-bot').css('background-position',-977-parseInt(pos2)+parseInt(pos)+'px -9px');
			}
			if($fath.find('.slide-on').size()>0 && !$a.hasClass('slide-on')){
				$fath.find('.slide-on').slideUp('fast','',function(){
					$(this).removeClass('slide-on');
					slideTog($a);
				});
			}else{
				slideTog($a);
			}
		})
		
	},
	renderBox:function(txt,obj){
		var txtary=txt.split(/[;]|[ ]|[；]/);
		var rag = new RegExp(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/);
		var $txt='';
		var $p=$(obj).closest('#wrapper_zf').find('.recive-item p');
		$(obj).val('');
		for(var i=0;i<txtary.length;i++){
			if(rag.test(txtary[i])){
				$txt=$('<a><b class="len">'+txtary[i]+'</b><em class="tabClose">×</em></a>');
				$txt.appendTo($p);
			}else{
				if(txtary[i]!=''){
					$(obj).val($(obj).val()+txtary[i]+';');
				}
			}
		}
		$(obj).val(Trimstr($(obj).val()));
	},
	typeLimit:function(obj,len,outObj,t) {
        var l = 0; //当前长度
        var o = 0; //剩余长度
        if(t) $(obj).attr('maxlength',len);
        $(obj).live('keydown keyup change',function() {
            l = $(this).val().length;
			if(l>len){
				$(obj).val($(obj).val().substr(0,len))
			}
            o = len - l;
            if(o<0) o = 0;
            $(outObj).text(o);
        });
    }
};









//生成通用窗口，只执行一次
function RenderFun(col,num,profJSON,popID,popTit,id1,txt1,id2,txt2,id3,txt3){
	var popObj = popID.substr(1);
	var $html=$('<dl class="item-selected clearfix"><dt>已选择的'+popTit+'：</dt><dd><ul class="item-del"><li class="unlim"><i>不限</i></li></ul><span class="btn-com-gray com-done">确定</span><span class="btn-com-gray unlim-btn">不限</span></dd></dl><div class="item-filter"><label>只显示相关项：</label><input type="text" class="t-text2 filter-txt" placeholder="输入想查询的关键字，可去除杂项" autocomplete="off"><span class="btn-com-gray filter-btn">筛选</span></div><div class="prof-box"><table border="0" cellspacing="0" cellpadding="0" class="prof-list" width="100%"></table></div>');
	
	if($(popID).size()!=0){
		$(popID).find('.com-layer-main').html($html);
		$(popID).find('.pop_tit b').text('请选择'+popTit);
		$(popID).find('.com-layle-count').text(num);
		if(id3&&txt3){
			$.each(profJSON.items, function(i,item){
				var firId = eval('item.' + id1);
				var firTxt = eval('item.' + txt1);
				var tabBase = $("<tr><th><label>"+firTxt+"</label></th><td id='m"+firId+"'></td></tr>").appendTo(popID+" .prof-list");
			});
			
			for(var k=0;k<profJSON.items.length;k++){
					var n=0;
					var m=0;
				$.each(profJSON.items[k].items,function(i,item){
					n+=1;
					if(n==1){
						//生成2级行
						$("<div class='sort-sec'></div>").appendTo($(popID+" .prof-list").find("td").eq(k));
					}
					var secId = eval('item.' + id2);
					var secTxt = eval('item.' + txt2);
					//生成2级
					var $sortSec = $(popID+" .prof-list").find("td").eq(k).find(".sort-sec").eq(m);
					$("<span class='item-check'><a id='v"+secId+"'></a><label>"+secTxt+"</label></span>").appendTo($sortSec);
					$($sortSec).after("<div id='s"+secId+"' class='sort-third hide'><div class='silde-top'></div><div class='sort-third-in clearfix'>&nbsp;</div><div class='silde-bot'></div></div>");
					//生成3级
					var thirdItems = item.items;
						if(thirdItems != undefined){
						$.each(thirdItems,function(i,item){
							var thirdId = eval('item.' + id3);
							var thirdTxt = eval('item.' + txt3);
							//生成3级
							$("<span class='item-check'><a id='v"+thirdId+"'></a><label>"+thirdTxt+"</label></span>").appendTo($(popID).find("#s"+secId).find(".sort-third-in"));
						})
					}
					//3个一组
					if(n==col){
						n=0;
						m+=1;
					}
				});
			}
		}else{
			var tabBase = $("<tr><td></td></tr>").appendTo(popID+" .prof-list");
			var n=0;
			var m=0;
			$.each(profJSON.items, function(i,item){
				var cityId = eval('item.' + id1);
				var cityTxt = eval('item.' + txt1);
				n+=1;
				if(n==1){
				//生成1级城市
				$("<div class='sort-sec'></div>").appendTo($(popID+" .prof-list").find("td"));
				}
				
				//生成2级
				var $sortSec = $(popID+" .prof-list").find("td").find(".sort-sec").eq(m);
				$("<span class='item-check'><a id='v"+cityId+"'></a><label>"+cityTxt+"</label></span>").appendTo($sortSec);
				$($sortSec).after("<div id='s"+cityId+"' class='sort-third hide'><div class='silde-top'></div><div class='sort-third-in clearfix'>&nbsp;</div><div class='silde-bot'></div></div>");
				//生成3级
				var thirdItems = item.items;
					if(thirdItems != undefined){
					$.each(thirdItems,function(i,item){
						var thirdId = eval('item.' + id2);
						var thirdcity = eval('item.' + txt2);
						//生成3级
						$("<span class='item-check'><a id='v"+thirdId+"'></a><label>"+thirdcity+"</label></span>").appendTo($(popID).find("#s"+cityId).find(".sort-third-in"));
					})
				}
	
				//3个一组
				if(n==col){
					n=0;
					m+=1;
				}
			});
		}
		
		$(popID+' .prof-list tr:even').addClass('graytr');
		$(popID+' .sort-third').each(function(i){
            var a = $(this);
			if(a.find('.item-check').size()==0){
				$(popID).find('#v'+a.attr('id').substr(1)).next('label').addClass('no-sub');
				a.remove();
			}
        });
	};
}




//初始化
$(function(){
__comLayer__.init();
__comLayer__.triggerFun(0);//职业
__comLayer__.triggerFun(1);//行业
__comLayer__.triggerFun(2);//城市
__comLayer__.triggerFun(3);//专业
__comLayer__.initInputVal();
__comLayer__.inputValChkUn();
})


//(参数：1.限制数;2.是否ajax静态页;3.是否禁用不限;4.是否重置已选单位;5.隐藏二级check;6.按钮id;7.弹层id)
/*
触发器html结构id:profession->职业;industry->行业;address->城市;major->专业
<div id="profession" class="sel_150 t-text2 len">
	<i tit="">不限</i>
	<input type="hidden" value="">
	<input type="hidden" value="">
</div>

*/
__comLayer__.triggerProf(3,1);//职业
__comLayer__.triggerIdtry(3,1);//行业
__comLayer__.triggerAddr(3,1);//城市
__comLayer__.triggerMajor(3,1);//专业