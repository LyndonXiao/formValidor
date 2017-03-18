$.fn.extend({
    "validate": function (options) {
        var $this = $(this);
        var defaults = {
            required_tips: "不能为空",
            maxLen_tips: "不能多于%s个字符",
            minLen_tips: "不能少于%s个字符",
            email_tips: "邮箱格式错误",
            phone_tips: "手机号码格式错误",
            num_tips: "包含非数字",
            match_tips:"与%s不相同",

            email_reg: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/,
            phone_reg: /^1[34578]\d{9}$/,
            num_reg: /^\d+$/
        };

        if (options) {
            $.extend(defaults, options);
        }

        //表单元素依次检查
        $this.find('[name]').each(function () {
            $(this).blur(function () {
                var $obj = $(this);
                var $error_box = $('#error');//统一错误提示
                var $single_error_box = $('#'+ $obj.attr('name') + '_tips');//单独错误提示
                $error_box.text("");
                $single_error_box.text("");
                var _validate = $obj.attr("check"); //获取check属性的值
                if (_validate) {
                    var tempArr = _validate.split(',');
                    for(var i in tempArr) {
                        var tmp = tempArr[i].split(':');
                        tmp[1] = '"' + tmp[1] + '"';//转为字符串
                        tempArr[i] = tmp.join(':');
                    }
                    _validate = tempArr.join(',');
                    var rules = eval('({' + (_validate) + '})'); //转成json对象
                    for (var key in rules) {
                        //逐个进行验证，不通过跳出返回false
                        if (!check($obj, $obj.val().trim(), key, rules[key])){
                            $error_box.text(sprintf(defaults[key + '_tips'], rules[key]));
                            $single_error_box.text(sprintf(defaults[key + '_tips'], rules[key]));
                            return false;
                        }
                    }
                }
            })
        });

        //检查规则
        var check = function (obj, _val, _rule, _param) {
            switch (_rule) {
                case "required":
                    if (_param && !_val)
                        return false;
                    break;
                case "maxLen":
                    if (_val && _val.length > _param)
                        return false;
                    break;
                case "minLen":
                    if (_val &&_val.length < _param)
                        return false;
                    break;
                case "phone":
                    if (_val && _param && !defaults.phone_reg.test(_val))
                        return false;
                    break;
                case "email":
                    if (_val && _param && !defaults.email_reg.test(_val))
                        return false;
                    break;
                case "num":
                    if(_val && _param && !defaults.num_reg.test(_val))
                        return false;
                    break;
                case "match":
                    if(_val && _val != $this.find('[name="' + _param + '"]').val())
                        return false;
                    break;
                default:
                    break;
            }
            return true;
        };

        function sprintf() {
            var arg = arguments,
                str = arg[0] || '',
                i, n;
            for (i = 1, n = arg.length; i < n; i++) {
                str = str.replace(/%s/, arg[i]);
            }
            return str;
        }
    }
});