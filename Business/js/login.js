var vm = new Vue({
    el: '#app'
});

var loading = false;
var type = 0;

//防止页面后退
history.pushState(null, null, document.URL);
window.addEventListener('popstate', function () {
    history.pushState(null, null, document.URL);
});

$("body").keydown(function () {
    if (event.keyCode == "13") {//keyCode=13是回车键
        $('#login').click();
    }
});

var minus = 180;
// 发送验证码
function sendCode(obj) {
    var account = $("#account").val();
    if (minus == 180) {
        var timer = setInterval(function () {
            minus--;
            if (minus < 0) {
                minus = 180;
                obj.innerHTML = "重新发送";
                clearInterval(timer);
            } else {
                obj.innerHTML = minus;
            }
        }, 1000);
        //alert(account);
        $.ajax({
            type: "post",
            data: { vcPhone: account },
            url: "/Auth/SendCode",
            success: function (jsonData, status) {
                if (status == 'success') {
                    //eval("res=" + jsonData.value);
                    if (jsonData.type == 2) {
                        vm.$message({
                            message: jsonData.message,
                            type: 'success',
                        });
                    }
                    else
                    {
                        vm.$message.error(sonData.message);
                    }
                }
                else
                {
                    vm.$message.error('连接服务器失败');
                }              
            },
            error: function (err) {
                vm.$message.error(err);
            }
        });
    }
    
}
// 切换登录方式
function loginModal(obj) {
    type = obj.getAttribute("data-type");
    if (type == 2) {
        obj.setAttribute("data-type", 1);
        $("#account_info").hide();
        $("#msg_info").show();
        $("#rcode").val('');
        obj.innerHTML = "账号密码登录";
    } else {
        obj.setAttribute("data-type", 2);
        $("#account_info").show();
        $("#msg_info").hide();
        $("#password").val('');
        obj.innerHTML = "短信快捷登录";
    }

}

$(function () {
    //showLoginMask();
    $(".wx").on('mouseenter ', function () {
        $(this).find(".wx-code").css({ opacity: 1 });
    });
    $(".wx").on('mouseleave ', function () {
        $(this).find(".wx-code").css({ opacity: 0 });
    });
    $("#login").on("click", loginClick);

    //$('.login-form input').keypress(function (e) {
    //    if (e.which == 13) {
    //        loginClick();
    //        return false;
    //    }
    //});
    if (localStorage.getItem("__ccc") == "1") {
        $("#g1").removeAttr("checked").attr("checked", true);
        $("#g1").val("1");
        $("input[name='account']").val(Base64.decode(Base64.decode(localStorage.getItem("__aaa"))));
        $("input[name='password']").val(Base64.decode(Base64.decode(localStorage.getItem("__bbb"))));
    } else {
        $("#g1").removeAttr("checked").attr("checked", false);
        $("#g1").val("0");
        $("input[name='account']").val();
        $("input[name='password']").val();
    }

    $("#g1").on("change", function () {
        if ($(this).is(":checked")) {
            $(this).val("1");
        } else {
            $(this).val("0");
        }
    });
});
// 关闭登陆的弹框
function closeLoginMask() {
    document.getElementById('login_mask').style.display = 'none';
    localStorage.setItem("first", "yes");
}
// 判断弹出框 显示的时间
function showLoginMask() {
    // 判断新用户第一次打开后，关闭了下次就不要显示
   
    var first = localStorage.getItem("first");
    if (!first) {
        document.getElementById('login_mask').style.display = "table";
    }

    // 正月15/2月19后 关闭弹框
    var date = new Date();
    var today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    if (today > '周三抽奖活动-2-19') {
        closeLoginMask();
    }

}
//真实登录js
function loginClick() {
    var account = $("#account").val();
    var password = $("#password").val();
    var rcode = $("#rcode").val();
    var Pwd = "";
    if (account == null || account == undefined || account == "") {
        vm.$message.error("手机号不能为空");
        return;
    }

    if (type == 2) {
        Pwd = rcode;
        if (rcode == null || rcode == undefined || rcode == "") {
            vm.$message.error("验证码不能为空");
            return;
        }
    }
    else
    {
        //避免先编码
        Pwd = Base64.encode(password);
        if (password == null || password == undefined || password == "") {
            vm.$message.error("密码不能为空");
            return;
        }
    }
    if (loading) return;

    loading = true;

    //真实发起登录
    $.ajax({
        type: "post",
        data: { account: account, Pwd: Pwd, type, type  },
        url: "/auth/userlogin",
        success: responseLogin,
        error: function (err) {
            vm.$message.error(err);
        }
    });
}

function responseLogin(jsonData, status) {
    loading = false;
    if (status == 'success') {
        //sessionStorage.setItem("tab", 0);
        localStorage.setItem("__ccc", $("#g1").val());

        if ($("#g1").val() == "1") {
            if (localStorage.getItem("jqb_loginname") != "") {
                localStorage.removeItem("jqb_loginname");
            }
            if (localStorage.getItem("jqb_loginpwd") != "") {
                localStorage.removeItem("jqb_loginpwd");
            }
            if (localStorage.getItem("jqb_loginsingle") != "") {
                localStorage.removeItem("jqb_loginsingle");
            }
            localStorage.setItem("__aaa", Base64.encode(Base64.encode($("input[name='account']").val())));
            localStorage.setItem("__bbb", Base64.encode(Base64.encode($("input[name='password']").val())));
        } else {
            localStorage.removeItem("__aaa");
            localStorage.removeItem("__bbb");
            localStorage.removeItem("jqb_loginname");
            localStorage.removeItem("jqb_loginpwd");
            localStorage.removeItem("jqb_loginsingle");
        }
        eval("res=" + jsonData.value);
        if (jsonData.type == "1") {
            var ReturnMsg = "登录成功";
            var ReturnUrl = getParameter("ReturnUrl");
            var ReturnSec = 1000;

            if (res.isTrialUser == 10) {
                if (ReturnUrl == null || ReturnUrl == "") {
                    ReturnUrl = "/";
                }
            }
            else {
                ReturnUrl = "/";
            }

            if (res.nIsDefaultPwd == 1) {
                ReturnMsg = "您正在使用默认密码登录,为了确保您的账号安全请修改初始密码";
                ReturnUrl = "/auth/agreement";
                ReturnSec = 1000;
            }

            vm.$message({
                message: ReturnMsg,
                type: 'success',
                /*onClose: function() {
                    window.location.href = ReturnUrl;
                }*/
            });
            setTimeout(function () {
                window.location.href = ReturnUrl;
            }, ReturnSec);
        }
        else {
            vm.$message.error(jsonData.message);
            return;
        }
    } else {
        vm.$message.error('连接服务器失败');
    }
}


function getParameter(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

function register() {
    window.location.href = "/auth/register";
}

function myEncodeDecode(str) {
      
    var base = ".@ElZkyNW2fqguL0PKoOvpM149GYJ8Ax6Fr3c5awebCTXQUdIiBD7hRszStVmjHn";       

    var back = base.split("").reverse().join("");
    var strArr = str.split("");
    var newStr = "";
    for (var i = 0; i < strArr.length; i++) {
        newStr += back.substr(base.indexOf(strArr[i]), 1);
    }
    return newStr;
}

var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode: function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode: function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode: function (string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode: function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while (i < utftext.length) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}