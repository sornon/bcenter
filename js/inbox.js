$(function(){
	$('.orderby').live('click', function(){
		var a=$(this).attr('act');
		var s=$(this).attr('set');
		var v=$(this).attr('val');
		var $b=$(this).find('em');
		if($b.hasClass('nothing')){
			$('input[name='+s+']').val('a'+v);
		}else if($b.hasClass('asc')){
			$('input[name='+s+']').val('d'+v);
		}else{
			$('input[name='+s+']').val('a'+v);
		}
		if(a && $('#'+a)) $('#'+a).submit();
	});
	$('#searchReset').click(function(){
		$('input[name=kw]').val('');
		$('input[type=hidden]').each(function(){
			var a=$(this).attr('name');
			if('[d,m,s,o]'.indexOf(a)==-1){
				$(this).prev('i').css('color','').attr('tit','').text('不限');
				$(this).val('');
				__comLayer__.inputValChkUn();
			}
		});
	});
});

function searchCheck()
{
	var keyword = $.trim($('input[name=kw]').val());
	if (keyword == '请输入搜索关键字') {
		$('input[name=kw]').val('');
	} else {
		keyword = keyword.replace(/( + |'|"|\\)/, '');
		$('input[name=kw]').val(keyword);
	}
	
	return true;
}

function searcherAdd(type)
{
	var keyword = $('input[name=kw]').val().replace('请输入搜索关键字', '').replace(/ + /g, ' ');
	var scope = $('input[name=ks]').val();
	var profession = $('input[name=p1]').val();
	var industry = $('input[name=i1]').val();
	var residence = $('input[name=c1]').val();
	var gender = $('input[name=g]').val();
	var freshtime = $('input[name=t]').val();
	var degree_all = $('input[name=h1]').val() +','+ $('input[name=h2]').val();
	var workingage_all = $('input[name=w1]').val() +','+ $('input[name=w2]').val();
	var age_all = $('input[name=a1]').val() +','+ $('input[name=a2]').val();
	var name = [];
	if(keyword) name.push(keyword);
	if(profession) name.push($('input[name=p2]').val());
	if(industry) name.push($('input[name=i2]').val());
	if(residence) name.push($('input[name=c2]').val());
	if(gender>0) name.push($('#g').text());
	if(freshtime>0) name.push($('#t').text());
	if(degree_all.replace(/0/g,'')!=','){
		name.push($('#h1').text()+'至'+$('#h2').text());
	}else{
		degree_all='';
	}
	if(workingage_all.replace(/-2/g,'')!=','){
		name.push($('#w1').text()+'至'+$('#w2').text());
	}else{
		workingage_all='';
	}
	if(age_all.replace(/0/g,'')!=','){
		name.push($('#a1').text()+'至'+$('#a2').text());
	}else{
		age_all='';
	}
	name = name.join(' + ');
	if(name==''){
		alert('请输入关键字和搜索条件');
		return;
	}

	$.ajax({
		type:     'POST',
		url:      '/talentsfind/ajaxaddsearcher',
		data:     'keyword='+ encodeURIComponent(keyword) +'&scope='+ scope +'&vocation='+ profession +'&industry='+ industry +'&currentcity='+ residence +'&sex='+ gender +'&updatedays='+ freshtime +'&degree='+ degree_all +'&workyear='+ workingage_all +'&age='+ age_all +'&name='+ encodeURIComponent(name) +'&type='+type,
		dataType: 'json',
		success:  function(result){
			if (result['status'] == 1) {
				$('#searcherList > li[val="0"]').remove();
				$('#searcherList').prepend('<li val="'+ result['id'] +'" title="'+ result['name'] +'" onclick="searcherGetUrl('+ result['id'] +');">'+ result['name'] +'<span id="searcherParam_'+ result['id'] +'" style="display:none">'+ result['param'] +'</span></li>');
				if ($('#searcherList > li').length > 0) {
					$('#searcherList > li:eq(5)').nextAll().remove();
				}
				alert('创建快速搜索成功！');
			} else {
				alert('服务器繁忙，请稍后重试！');
			}
		},
		error:    function(){
			alert('创建快速搜索失败，请稍后重试！');
		}
	});
	
	return false;
}

//获取快速搜索
function searcherGet(type)
{
	if ($('#searcherList > li').length == 0) {
		$('#searcherList').html('<li val="0">读取中...</li>');
		$.ajax({
			type:     'POST',
			url:      '/talentsfind/ajaxgetsearcher',
			data:     'type='+type,
			dataType: 'json',
			success:  function(result){
				var searcherList = '';
				if (result.length > 0) {
					for (k = 0, c = result.length; k < c; k++) {
						searcherList +='<li val="'+ result[k]['id'] +'" title="'+ result[k]['name'] +'" onclick="searcherGetUrl('+ result[k]['id'] +');">'+ result[k]['name'] +'<span id="searcherParam_'+ result[k]['id'] +'" style="display:none">'+ result[k]['param'] +'</span></li>';
					}
				} else {
					searcherList = '<li val="0">您还没有创建快速搜索！</li>';
				}
				$('#searcherList').html(searcherList);
			}
		});
	}
	
	return false;
}

//跳转快速搜索链接
function searcherGetUrl(searcherId)
{
	var key = 0;
	var url = [];
	var pars = eval('('+ $('#searcherParam_'+ searcherId).html() +')');
	var text = pars.name.split(' + ');
	var jobid = $('input[name=jobid]').val();
	if(jobid){
		url.push('jobid='+jobid);
	}
	if (pars.keyword) {
		url.push('kw='+encodeURIComponent(pars.keyword)+'&ks='+pars.scope);
		key++;
	}
	if (pars.vocation) {
		url.push('p1='+pars.vocation);
		url.push('p2='+ encodeURIComponent(text[key]));
		key++;
	}
	if (pars.industry) {
		url.push('i1='+pars.industry);
		url.push('i2='+ encodeURIComponent(text[key]));
		key++;
	}
	if (pars.currentcity) {
		url.push('c1='+pars.currentcity);
		url.push('c2='+ encodeURIComponent(text[key]));
	}
	if (pars.sex>0) {
		url.push('g='+pars.sex);
	}
	if (pars.posttime) {
		url.push('t='+pars.posttime);
	}
	if (pars.degree && pars.degree.replace(/0/g,'')!=',') {
		var h = pars.degree.split(',');
		url.push('h1='+ h[0]+'&h2='+h[1]);
	}
	if (pars.workyear && pars.workyear.replace(/-2/g,'')!=',') {
		var w = pars.workyear.split(',');
		url.push('w1='+ w[0]+'&w2='+ w[1]);
	}
	if (pars.age && pars.age.replace(/0/g,'')!=',') {
		var a = pars.age.split(',');
		url.push('a1='+ a[0]+'&a2='+a[1]);
	}
	url.push('d='+ $('input[name=d]').val());
	url.push('q='+ pars.name);
	
	location.href = '?'+ url.join('&');
}