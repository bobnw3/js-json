/**
* NW3后台绘制基本类库 
* 此类库主要用于自动拼接请求接口传入参数，根据页面接口数据自动回填页面控件
* v 0.2
* @date 2016-1-22
* @author bob.nw
* Licensed under MIT license.
*  http://opensource.org/licenses/MIT
*/
var NW3 = NW3 ||
{};
var DEV=DEV||{};

var dshopPData={};
Date.prototype.format = function(format){
	/* 通用日期函数 */
		var o = {
			"M+": this.getMonth() + 1,
			"d+": this.getDate(), 
			"h+": this.getHours(),
			"m+": this.getMinutes(),
			"s+": this.getSeconds(),
			"q+": Math.floor((this.getMonth() + 3) / 3),
			"S": this.getMilliseconds()
		}
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
};
NW3.DEVFORM = NW3.prototype = {
	/** 通用函数，获取连接中参数
	* 例如：https://XXX.com?abs=888
	* 调用方法 var res=NW3.DEVFORM.GUV('abs');
	* 结果 res=888
	*/
	GUV:function(name){
        if (location.href.indexOf("?") == -1 || location.href.indexOf(name + '=') == -1) {
            return '';
        }
        var queryString = decodeURI(location.href.substring(location.href.indexOf("?") + 1));
        var parameters = queryString.split("&");
        var pos, paraName, paraValue;
        for (var i = 0; i < parameters.length; i++) {
            pos = parameters[i].indexOf('=');
            if (pos == -1) {
                continue;
            }
            paraName = parameters[i].substring(0, pos);
            paraValue = parameters[i].substring(pos + 1);
            if (paraName == name) {
                return unescape(paraValue.replace(/\+/g, " "));
            }
        }
        return '';
    },

	nw3SelectSetObj:function(divs,_jsons,_option,obj){
		if(_jsons.length>0){
			$("#"+divs).empty();
			$("#"+divs).append("<option value=''>请选择</option>");
			var _n='',_v='',sed='';
			
			for(var _i=0;_i<_jsons.length;_i++){
				_n=eval("_jsons[_i]."+_option.n);
				_v=eval("_jsons[_i]."+_option.v);
				sed='';
			 	if(NW3.DEVFORM.nw3CheckUndefined(obj)){
					if(_v==obj){sed='selected="selected"';}
				}
				if(NW3.DEVFORM.nw3CheckUndefined(_n)&&NW3.DEVFORM.nw3CheckUndefined(_v)){
					$("#"+divs).append("<option "+sed+" value='"+_v+"'>"+_n+"</option>");
				}
			}
		}
	},	
	selectedSelectOptionForValueId:function(objid,_val){
		var obj="#"+objid+" option";
		$(obj).each(function(){
		   if($(this).val()==_val){
			  $(this).attr('selected', 'selected');
		   }
		}); 
	},
	
	addButtonPostClickForTableStr:function(_formid){
		var nvl=$("#"+_formid).serialize();
		var _ph=[];
		var _s='';
		_ph.push("[");
		if(NW3.DEVFORM.nw3CheckUndefined(nvl)){
			var _s1='',_s2='',_st=0;
			_s1=nvl.split('&');
			for(var _i=0;_i<_s1.length;_i++){
				_s2=_s1[_i].split("=");
				if(_s2.length>0){
					_ph.push("{");
					_ph.push('"n":'+'"'+_s2[0]+'","v":'+'"'+decodeURIComponent(_s2[1])+'"');
					_ph.push("},");
					_st=1;
				}
			}
		}_s=_ph.join("");
		if(_st==1){
			
			_s=_s.substring(0,_s.length-1);
		}
		_s+="]";
		return _s;
	},
	setDrawLoopRadioCheckBox:function(id,type,_jsons,_option,cid){
		if(_jsons.length>0){
			$("#"+id).empty(); 
			var _n='',_v='';
			for(var _i=0;_i<_jsons.length;_i++){
				_n=eval("_jsons[_i]."+_option.n);
				_v=eval("_jsons[_i]."+_option.v);
				if(NW3.DEVFORM.nw3CheckUndefined(_n)&&NW3.DEVFORM.nw3CheckUndefined(_v)){
					$("#"+id).append('<input type="'+type+'" class="checkboxcss" name="'+cid+'" id="'+cid+'" value="'+_v+'" /> <label for="'+cid+'-'+_i+'">'+_n+'</label><br />');
				}
			}
		}
	},
	nw3GetDataKeyVal:function(_data,signstr,_timestamp){
		var _d=[];
		_d.push('"timestamp": "'+_timestamp+'",');
		_d.push('"sign": "'+ signstr+'",');
		for(var _z=0;_z<_data.length;_z++){
			if(NW3.DEVFORM.nw3CheckUndefined(_data[_z].n)){
				_d.push('"'+_data[_z].n+'": "'+ _data[_z].v+'",');
			}
		}
		var _s=_d.join("");
		_s=_s.substring(0,_s.length-1);
		return "{"+_s+"}";
	},
	setFormAutoValue:function(_jsons){
	/** 
	 * 根据JSON，自动回填表单中控件
	*/
		if(_jsons.length>0){
			var _n='',_v='';
			for(var _i in _jsons){
				for(var key in _jsons[_i])
				{
					_n=key;
					_v=_jsons[_i][key];
					if(NW3.DEVFORM.nw3CheckUndefined(_v)){
						if(NW3.DEVFORM.nw3CheckUndefined(_n)&&NW3.DEVFORM.nw3CheckUndefined(_v)){
							NW3.DEVFORM.setFromValueSetup2(_n,_v);
						}
					}
				 }
			}
		}
	},
	setFromValueSetup2:function(_n,_v){
		if(NW3.DEVFORM.nw3CheckUndefined($("#"+_n)[0])){
			var _ty=$("#"+_n)[0].type;
			if(NW3.DEVFORM.nw3CheckUndefined(_ty)){
				
				if(_ty=="text"||_ty=="textarea"){
					NW3.DEVFORM.setInputTextValue(_n,_v);
				}else if(_ty=="radio"){
					NW3.DEVFORM.checkedRadioForValueId(_n,_v);
				}
				else if(_ty=="checkbox"){
					NW3.DEVFORM.checkedRadioForValueId(_n,_v);
				}
				else if(_ty=="select-one"||_ty=="select"){
					NW3.DEVFORM.selectedSelectOptionForValueId(_n,_v);
				}
			}else{
				if($("#"+_n).html()!=undefined){
					$("#"+_n).html(_v);
				}
			}
			if($('#'+_n).prop("className")==_n){
				$("."+_n).html(_v);
			}
		}
		 
	},
	nw3CheckUndefined:function(val){
		if(val!=undefined&&val!=''&&val!=null){
			return true;
		}else{
			return false;
		}
	},
	setInputTextValue:function(id,_v){
		$("#"+id).val(_v);
	},
	checkedRadioForValueId:function(objid,_val){
        var chkRadio = document.getElementsByName(objid);
        for (var i = 0; i < chkRadio.length; i++) {
           if (chkRadio[i].value==_val){
            chkRadio[i].checked="checked";}
        }
	},
	nw3GetData:function(dshopHost,paction,pdata){
	/** 提交参数，根据传入json，自动加入签名与时间戳记
	* 例如：https://XXX.com?abs=888
	× 调用方法 var res=NW3.DEVFORM.GUV('abs');
	* 结果 res=888
	*/
		var par=pdata.p;
		var token ='token', _timestamp = new Date().format("yyyy-MM-dd hh:mm:ss"), _action = paction;
		var signstr = '签名';
		var UData = eval("("+NW3.DEVFORM.nw3GetDataKeyVal(par,signstr,_timestamp)+")");
		var datastr=JSON.stringify(UData);
		console.log("提交参数->"+datastr); 
		alert("提交参数->"+datastr);
		$.ajax({
				type: 'post',
				async: !1,
				dataType: "jsonp",
				jsonp: "jsoncallback",
				url: dshopHost + "?action=" + _action + "&jscallback=?",
				data: $.extend({}, dshopPData, UData),
				error: function(result, status){
					console.log(result); 
				},
				success: function(result){
					console.log(result); 
				}
			});
	}
}
