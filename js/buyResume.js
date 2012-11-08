var _buy = {};
//*
_buy.type = '1';    //类型
_buy.params = '';   //参数
_buy.refresh = true;//刷新
//*

_buy.obj = null;
_buy.postUrl = '/serverpans/buyResume';
_buy.viewUrl = '/baijob/data/buy.html';
_buy.Msg = ['请您选择需要购买的简历', '请登录后再试', '购买成功', '操作失败，请稍后再试'];

_buy.__init__ = function()
{
    _buy.count = 0;
    _buy.overCount = 0;
    _buy.reMes = false;
    _buy.logout = true;
    _buy.eCount = 0;
}

//列表购买
$('#buyId').click(function(){
    _buy.init();
    if(_buy.obj == undefined || _buy.obj.length == 0) {
        alert(_buy.Msg[0]);
        return;
    }
    var ids = [];
    $(_buy.obj).each(function(){
        ids.push($(this).val().toString());
    });
    _ids = ids.join(',');
    _buy.__init__();
    _buy.view(_ids, _buy.type);
});

//单个购买
$('.buyNeed').click(function(){
    _buy.__init__();
    _buy.view($(this).attr('key'), _buy.type);
});

//购买详情
_buy.view = function(_ids, type)
{
    _buy.count = _ids.toString().split(',').length;    
    var _url = _buy.viewUrl + '?ids=' + _ids + '&sourceId=' + type;
    new popLayer(_url, true, '购买简历');
}

//购买
_buy.post = function(id, type)
{
    var _postForm = {};
    _postForm.sourceId = type;
    _postForm.objId = id;
    $.ajax({
        type: "post",
        url : _buy.postUrl,
        data: _postForm,
        success: function(msg){
            if(msg == '1') {
                _buy.reMes = true
            }else if(msg == '-100') {
                _buy.logout = false;
            }else{
                _buy.eCount++;
            }
            _buy.overCount = _buy.overCount + 1;
            if(_buy.overCount == _buy.count) {
                $('.popKill').click();
                $('.buy-ok').html('确定');
                if(_buy.logout == false) {
                    alert(_buy.Msg[1]);
                    return;
                }
                if(_buy.eCount > 0) {
                    alert('有' + _buy.count + '份简历购买成功,' + _buy.eCount + '份简历购买失败');
                    return;
                }
                alert(_buy.Msg[2]);
                if(_buy.refresh == true) {
                    setTimeout(function(){location.reload()}, 1000);
                }
                return;
            }
        }
    });
}


$('.buy-del').live('click', function(){
    $(this).parent().remove();
    if($('.buy-car-list ul li').length == 0) {
        $('.popKill').click();
    }
    var dataLen = $('.buy-car-list ul li').length;
    _buy.count = dataLen;
    var _dataLen = $('.buy-car-list ul li[key=0]').length;
    _buy.cspCount = _dataLen;
    var money = _dataLen * 10;
    $('.buy-cay-info').html('您选择了' +dataLen+ '份简历，需要付费购买的有' +_dataLen+ '份，共计' +money+'元');
});

$('.buy-ok').live('click', function(){
    if($('.buy-car-list ul li').length == 0) {
        $('.popKill').click();
        return;
    }

    if(_buy.cspCount != 0 && _buy.resumeNum < _buy.cspCount) {
        alert('余额不足，请您充值');
        return;
    }
    $('.buy-ok').html('<img src="/images/bCenter/min_loadding.gif">...');
    $('.buy-car-list ul li').each(function(){
        var _id = $(this).attr('objid');
        _buy.post(_id, _buy.type)
    });
});

$(function(){
	$('.jubao').click(function(){
       alert('<div class="jubao-box"><p class="jubao-tip">尊敬的用户！您的选择将会有效帮助我们改善简历信息，为您提供更优质简历！为了保证举报真实有效，请您慎重决定！谢谢！</p><dl class="jubao-form mt-20 clearfix"><dt>举报信息：</dt><dd><input type="radio" name="jubaoRadio" value="1">电话打不通  <input type="radio" name="jubaoRadio" value="2">电话号码错  <input type="radio" name="jubaoRadio" value="3">简历信息不实  <br><input type="radio" name="jubaoRadio" value="4">最近不找工作  <br><input type="radio" name="jubaoRadio" value="5">其他  <input type="text" name="jubaoText" class="txt_230 t-text2"></dd></dl><p align="center" class="mt-20"> <input class="alertPost btn75_33" type="button" value="提交"> <input class="alertKill btn75_33 ml-20" type="button" value="取消"></p></div>','简历举报');
       $jubao = $(this).closest('div');
	   var typeid = $jubao.attr('typeid');
       $('input[name=jubaoRadio]').each(function(index, elem){
            var $elem = $(elem);
            if($elem.val() == typeid){
                $elem.attr('checked', true);
                if(typeid == 5 && $jubao.find('span')){
                    var content = $jubao.find('span').html();
                    $('input[name=jubaoText]').val(content);
                }
            }
        });
    })
    $('.jubao_del').click(function(){
        if(confirm('确定要删除吗','删除举报')){
            $jubao = $(this).closest('div');
            var typeid = $jubao.attr('typeid');
            _report.reportid = 0;
            $.post('/report/update', _report, function(d,s){
                if(d==1){
                    alert('删除成功');
                    setTimeout(function(){location.reload();}, 1000);
                 }else{
                    alert('删除失败');
                }
                setTimeout(function(){$('.alertKill').click();}, 5000);
            });
        }
    })
    $('.alertPost').live('click', function(){
        $('input[name=jubaoRadio]').each(function(index, elem){
            var $elem = $(elem);
            if($elem.attr('checked')){
                _report.reportid = $elem.val();
                _report.reportval = $('input[name=jubaoText]').val();
                if(_report.reportid==5 && $.trim(_report.reportval)==''){
                    err_tip($('input[name=jubaoText]'), 100, '该项不能为空');
                    $('.tipBox').css('z-index', '99999');
                    return;
                }
                $.post('/report/update', _report, function(d,s){
                    if(d==1){
                        alert('举报成功');
                        setTimeout(function(){location.reload();}, 1000);
                    }else{
                        alert('举报失败');
                    }
                    setTimeout(function(){$('.alertKill').click();}, 5000);
                });
            }
        });
    })
})
