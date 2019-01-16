# js-json
自动回填与取值

在前端开发过程中，频繁从接口读取数据，并显示到html页面，为提高效率，开发自动回填与取值类库，依赖于jquery

1:自动回填函数
模拟接口返回JSON，实际中这里可以是服务器接口返回JSON

{"C":"SUCCESS","D":[{"price":"123.00","integral":"100","remark":"回填JSON内容","seltype":"1"}]}
目前支持自动回填label,text,textarea,select,radio,checkbox

var data={"C":"SUCCESS","D":[{"price":"123.00","integral":"100","remark":"回填JSON内容","seltype":"1","cbox":"1"}]};
NW3.DEVFORM.setFormAutoValue(data.D);

2：提交拼接函数
<select name="seltype" id="seltype"><option value="">请选择</option><option value="1">A</option><option value="21">B</option></select>
var _ac={"action":"sbumitFormEx","p":[{"n":"seltype","v":""+$('#seltype').val()+""}]};
NW3.DEVFORM.nw3GetData('http://localhost/api.aspx',_ac.action,_ac);
