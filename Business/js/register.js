var vm = new Vue({
    el: '#login_app',
    data:function() {
        return {
            dialog: false
        }
    },
    methods:{
        go:function() {
            window.location.href = "/auth/login";
        },
    }
});

$(function () {
    var w = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent); // 判断是手机端还是Pc端
    $(".help").on("mouseenter", function () {
        if(w) {  // 手机端
            $("#re_p").show();
        }else { // pc端
            $(".regit-mask").show();
        }
        $(".pop-info").show();
    });
    // $(".help").on("touchstart", function () {
    //     $("#re_p").show();
    //     $(".pop-info").show();
    // });
    // $(".iknow").on("touchstart", function (event) {
    //     $("#re_p").hide();
    //     $(".pop-info").hide();
    // });
    $(".trade").on("click", function (e) {
        e.stopPropagation();
        $(".sel-arrow").removeClass("sel-arrow-down");
        $(this).find(".sel-arrow").addClass("sel-arrow-down");
        if ($(this).next(".mask-phone").length > 0) {
            $("#mask_trade").show();
        } else {
            $(".droplist").hide();
        }
        $(this).parents(".select-drop").find(".droplist").show();
        
        
    });
    $(".droplist").on("click", "li", function (e) {
        e.stopPropagation();
        var _this = $(this),
            parents = _this.parents(".select-drop"),
            inputs = parents.find(".login-input");
       // var inputs = $("#trade_name");
        inputs.val(_this.find("span").html());
        //inputs.attr("placeholder", _this.find("span").html());
        inputs.attr("industryid", _this.find("span").attr("id"));
        inputs.attr("industry", _this.find("span").html());
        parents.find(".sel-arrow").removeClass("sel-arrow-down");
        $("#mask_trade").hide();
        _this.parent().hide();
    });
    $(".wx").on('mouseenter ', function () {
        $(this).find(".wx-code").css({ opacity: 1 });
    });
    $(".wx").on('mouseleave ', function () {
        $(this).find(".wx-code").css({ opacity: 0 });
    });
    $(document).on("click", function () {
        $(".sel-arrow").removeClass("sel-arrow-down");
        $(".mask-phone").hide();
        $(".droplist").hide();
        if (!$(".regit-mask").is(":hidden")) {
            $(".regit-mask").hide();
            $(".pop-info").hide();
        }
    });
});

function changePhone() {
    var phone = $("#phone").val();
    $.ajax({
        type: "post",
        data: { vcPhone: phone },
        url: "/Auth/CheckPhone",
        success: function (json) {
            if (json > 0) {
                document.getElementById("sphone").innerHTML = "该手机号已被注册";
                document.getElementById('phoneDiv').style.display = "";
                return false;
            }
        }
    });

    document.getElementById('phone').focus();
}

function showButton() {
    if ($("input[type='checkbox']").is(':checked')) {
        $("#btn").removeClass().addClass("orange-btn register-btn marginTop-15");
        $('#btn').removeAttr("disabled");
    } else {
        $("#btn").removeClass().addClass("gray-btn register-btn marginTop-15");
        $('#btn').attr("disabled", "disabled");
    }
}


function sms(obj) {
    var phone = $("#phone").val();
    if (phone == "") {
        document.getElementById("sphone").innerHTML = "手机号不能为空";
        document.getElementById('phoneDiv').style.display = "";
        return false;
    } else {
        var re = /^1\d{10}$/
        if (re.test(phone)) {
        } else {
            document.getElementById("sphone").innerHTML = "手机号格式错误";
            document.getElementById('phoneDiv').style.display = "";
            return false;
        }
    }
    //changePhone();
    $.ajax({
        type: "post",
        data: { phone: phone },
        url: "/Auth/SendSms",
        success: function (json) {
            if (json == 0) {
                document.getElementById("sphone").innerHTML = "该手机号已被注册";
                document.getElementById('phoneDiv').style.display = "";
                return false;
            } else {
                var countdown = 600;
                settime(obj);
                function settime(obj) {
                    if (countdown == 0) {
                        $("#sms").attr("disabled", false);
                        $("#sms").text("获取验证码");
                        $("#sms").removeClass().addClass("getcode orange-btn");
                        countdown = 600;
                        return;
                    } else {
                        $("#sms").attr("disabled", true);
                        $("#sms").text("剩余时间" + (countdown) + "秒");
                        $("#sms").removeClass().addClass("gray-btn getcode orange-btn");
                        countdown--;
                    }
                    setTimeout(function () {
                        settime(obj)
                    }, 1000)
                }
            }
        }
    });
}

function serviceagreement() {
    window.open("/auth/serviceagreement");
}

function login() {
    window.location.href = "/auth/login";
}

function registerUser() {
    var phone = $("#phone").val();
    if (phone == "") {
        document.getElementById("sphone").innerHTML = "手机号不能为空";
        document.getElementById('phoneDiv').style.display = "";
        $(".register-inner").addClass("show-tops");
        return false;
    } else {
        var re = /^1\d{10}$/
        if (re.test(phone)) {
            document.getElementById("sphone").innerHTML = "";
            document.getElementById('phoneDiv').style.display = "none";
            $(".register-inner").removeClass("show-tops");
        } else {
            document.getElementById("sphone").innerHTML = "手机号格式错误";
            document.getElementById('phoneDiv').style.display = "";
            $(".register-inner").addClass("show-tops");
            mark = 1;
            return false;
        }
    }
    changePhone();
    var pws = $("#pws").val();
    if (pws == "") {
        document.getElementById("passwordS").innerHTML = "密码不能为空";
        document.getElementById('pwsDiv').style.display = "";
        $(".register-inner").addClass("show-tops");
        return false;
    } else {
        var regex = new RegExp('[0-9 | A-Z | a-z]{6,12}');
        if (!regex.test(pws)) {
            document.getElementById("passwordS").innerHTML = "密码长度为6-12个字符，只能包含字母、数字、下划线";
            document.getElementById('pwsDiv').style.display = "";
            $(".register-inner").addClass("show-tops");
            return false;
        } else {
            document.getElementById('pwsDiv').style.display = "none";
            $(".register-inner").removeClass("show-tops");
        }
    }
    var pwe = $("#pwe").val();
    if (pwe != pws) {
        document.getElementById("passwordE").innerHTML = "两次输入的密码不一致";
        document.getElementById('pweDiv').style.display = "";
        $(".register-inner").addClass("show-tops");
        return false;
    } else {
        document.getElementById('pweDiv').style.display = "none";
        $(".register-inner").removeClass("show-tops");
    }

    var company = $("#company").val();
    if (company == "") {
        document.getElementById("companyE").innerHTML = "请填写公司名称";
        document.getElementById('companyDiv').style.display = "";
        $(".register-inner").addClass("show-tops");
        return false;
    } else {
        document.getElementById('companyDiv').style.display = "none";
        $(".register-inner").removeClass("show-tops");
    }
    //var industry = $("#trade_name").attr("industry");
     var industryid = $("#trade_name").attr("industryid");
    var industry = $("#trade_name").val(); 
    if (industry == "") {
        document.getElementById("industryE").innerHTML = "请选择公司所在行业";
        document.getElementById('industryDiv').style.display = "";
        $(".register-inner").addClass("show-tops");
        return false;
    } else {
        document.getElementById("industryE").innerHTML = "";
        document.getElementById('industryDiv').style.display = "none";
        $(".register-inner").removeClass("show-tops");
    }

   // var source = $("#source").attr("industry");
   // var sourceval = $("#source").attr("industryid");
    var source = $("#source").val();
    var sourceName = $("#sourceName").val();
    if (source == "" && sourceName =="") {
        document.getElementById("sourceE").innerHTML = "请选择了解途径";
        document.getElementById('sourceDiv').style.display = "";
        $(".register-inner").addClass("show-tops");
        return false;
    } else {
        document.getElementById("sourceE").innerHTML = "";
        document.getElementById('sourceDiv').style.display = "none";
        $(".register-inner").removeClass("show-tops");
    }
    //如果是友商渠道直接使用
    if (sourceName != "") {
        source = sourceName;
    }

    var rePhone = "";
    var vcSmsCode = "";
    //var rePhone = $("#rePhone").val();
    //if (rePhone == phone) {
    //    document.getElementById("rePhoneE").innerHTML = "注册手机号与推荐人手机号不能一致";
    //    document.getElementById('rePhoneDiv').style.display = "";
    //    return false;
    //}
    //else {
    //    document.getElementById('rePhoneDiv').style.display = "none";
    //}
    //var vcSmsCode = $("#smsCode").val();

    var urlKey = $("#urlKey").val();
    $.ajax({
        type: "post",
        data: { Phone: phone, Pwd: pws, UserName: company, Industry: industry, IndustryId: industryid, SmsCode: vcSmsCode, RefPhone: rePhone, Source: source, UrlKey: urlKey },
        url: "/auth/RegisterUser",
        success: function (json) {
            if (json.type == 1) {
                /*vm.$message({
                    message: "恭喜您注册成功!",
                    type: 'success'
                    /*onClose: function() {
                        window.location.href = ReturnUrl;
                    }#1#
                });*/
                vm.dialog = true;
                console.log(1);
                return true;
            } else if (json.type == -1001) {
                document.getElementById("sphone").innerHTML = "该手机号已被注册";
                document.getElementById('phoneDiv').style.display = "";
                $(".register-inner").addClass("show-tops");
                return false;
            } else if (json.type == -1002) {
                $(".register-inner").addClass("show-tops");
                document.getElementById("smsCodeE").innerHTML = "请输入收到的短信验证码";
                document.getElementById('smsCodeDiv').style.display = "";
                return false;
            } else if (json.type == -1003) {
                document.getElementById("rePhoneE").innerHTML = "该手机号未在平台注册，无法参与";
                document.getElementById('rePhoneDiv').style.display = "";
                $(".register-inner").addClass("show-tops");
                return false;
            } else if (json.type == -1005) {
                document.getElementById("companyE").innerHTML = "该公司名称已被注册，可添加部门名称以示区分。例如：湖南涂色网络科技有限公司（运营部）";
                document.getElementById('companyDiv').style.display = "";
                $(".register-inner").addClass("show-tops");
                return false;
            }

        }
    });

}
