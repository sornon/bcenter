(function($){
	$.fn.dragSel= function(){
		$(this).each(function(i,item){
			var pram ={
				_left:$(item).offset().left,
				_top:$(item).offset().top,
				flg: false,
				$em:$(item).find('em'),
				_al:0,
				_cl:0,
				fg:true,
				_in:$(item).find('em').find("input[type='hidden']")
			};
			//隐藏域传值
			var n = $(item).width()/8;
			if(pram._in.val()==1){
				pram.$em.css({left:"0"});
			}else if(pram._in.val()==2){
				pram.$em.css({left:n*2-5+"px"});
			}else if(pram._in.val()==3){
				pram.$em.css({left:n*4-5+"px"});
			}else if(pram._in.val()==4){
				pram.$em.css({left:n*6-5+"px"});
			}else if(pram._in.val()==5){
				pram.$em.css({left:n*8-5+"px"});
			}else{
				pram.$em.css({left:n*4-5+"px"});
			}
			pram.$em.mousedown(function(e){
				if(e.button==0)pram.flg = true;
				pram._cl = 1;
				pram.fg = false;
			});
			$(document).bind('mousemove',function(e){
				e = e || window.event;
				if(pram.flg){
					pram.$em.selectUnable();
					if(e.pageX - pram._left<0){
						pram.$em.css({left:'0px'});
					}else if(e.pageX - pram._left>212){
						pram.$em.css({left:'212px'});
					}else{
						pram.$em.css({left:e.pageX - pram._left});
					}
				}
				pram._al = pram.$em.offset().left - pram._left;
			});	
			$(item).mousedown(function(e){
				pram.flg = true;
				if(pram.fg){
					e = e || window.event;
					pram.$em.selectUnable();
					pram._al = e.pageX - pram._left;
					$(this).find('em').animate({left:pram._al});
				}
			});
			
			$(document).mouseup(function(e){
				e = e || window.event;
				pram.flg = false;
				pram.fg = false;
				var n = $(item).width()/8;
				if(pram._al<n){
					pram.$em.animate({left:"0"},function(){pram.fg = true;});
					pram._in.val("1");
				}else if(pram._al<n*3){
					pram.$em.animate({left:n*2-5+"px"},function(){pram.fg = true;});
					pram._in.val("2");
				}else if(pram._al<n*5){
					pram.$em.animate({left:n*4-5+"px"},function(){pram.fg = true;});
					pram._in.val("3");
				}else if(pram._al<n*7){
					pram.$em.animate({left:n*6-5+"px"},function(){pram.fg = true;});
					pram._in.val("4");
				}else{
					pram.$em.animate({left:n*8-5+"px"},function(){pram.fg = true;});
					pram._in.val("5");
				}
				
			});
						
		})
	}
	
	//防止拖动中选中
	$.fn.selectUnable=function(){
		if(document.selection){//IE ,Opera
			if(document.selection.empty)
				document.selection.empty();//IE;
			else //Opera
				document.selection = null;
		}else if(window.getSelection){//FF,Safari
			window.getSelection().removeAllRanges();
		}
	};
})(jQuery); 