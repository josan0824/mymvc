/**
 * Chuangkit Api Client Sample Code
 * https://www.chuangkit.com
 *
 */

/**
 * 调起创客贴设计有两种方式：
 * 第一种是通过js直接调起创客贴
   * 第二种是通过用户点击页面中的按钮来调起
**/

// 无论哪种方式，需要先加载api所需的js
(function (d, s, a) {
    var w = d.createElement(s),
 		s = d.getElementsByTagName(s)[0];
    w.src = a;
    s.parentNode.insertBefore(w, s);
})(document, 'script', 'https://static.chuangkit.com/api/v4.js');

function openChuangkitByJs(designId, qrcodeUrl, logoUrl) {

    var timestamp = new Date().getTime() + 1000 * 60 * 10; // 得到当前时间戳（毫秒）+ 10分钟

    // 假设这里需要通过名片场景调起创客贴，名片场景'data-kind' 为 12，并设置调起创客贴的弹窗zindex样式为10000
    // 列出所有参数
    var option = {
        'data-access': '38ef7e00d7a9469bb0d19743a4405ab9', //'e43b19d800b64e16ba8c28e5c32288bb',
        'data-exp': timestamp, // 这里假设请求参数的过期时间为2030/1/1 8:0:0 则 'data-exp'时间戳为 1893456000000 （注意单位为毫秒）
        'sign': null, // sign参数稍后计算，这里先置为null
        'signType': 'MD5', // signType参数固定为MD5
        'data-zIndex': 100000, // 设置调起创客贴的弹窗zindex样式为10000
    };

    if (designId != "") {
        option["data-design-id"] = designId;
    }
    else if (qrcodeUrl != "") {
        option["data-kind"] = 166;
        option["upload-img"] = qrcodeUrl;
        option["data-upload-img-width"] = 200;
        option["data-upload-img-top"] = 10;
        option["data-upload-img-left"] = 10;
    }
    else {
        option["data-kind"] = 166;
    } 
    var kvData = Object.assign({}, option);
    //console.log(kvData);
    delete kvData.sign;
    delete kvData.signType;
    //console.log(kvData);
    var kvDataArray = [];
    for (var key in kvData) {
        kvDataArray.push(key + '=' + kvData[key]);
    }
    kvDataArray.sort();  // 数组排序

    var kvString = kvDataArray.join('&'); // 数组变字符串
    //console.log(kvString);

    if (logoUrl != "") {
        option["data-extra-add-img-list"] = JSON.stringify([logoUrl]);
    }

    $.ajax({
        url: '/Management/ChuangkitSign',
        type: 'POST',
        dataType: "text",
        data: { keyValueString: kvString },
        success: function (ret) {
            if (ret != "") { 
                option.sign = ret;
                //console.log(option);

                // 在需要使用创客贴的地方实例以下JS对象
                var cktIframe = new ChuangkitIframe(option);

                //  调起创客贴:
                cktIframe.openIframe();
            }
            else {
                alert('系统繁忙，请稍候重试。');
            }
        }
    });
}


/**
 * 调起创客贴后需要接收回调
   * 在页面js中定义全局方法 chuangkitComplate
   * 当用户在调起的创客贴中设计“保存成功”或者用户点击“完成设计”时会执行回调函数
   * 同时会传递一个参数过来
{
   cktMessage: 判断是否是创客贴的返回
   kind: 	1：保存,2:生成图片,-1:错误
   design-id: 本次调起JSSDK使用的设计ID
   thumb-urls: 生成的图片缩略图地址
   thumb-exp: thumb-urls有效时常(秒)
   error: 报错说明
}
**/

window.chuangkitComplate = function (data) {
    //console.log(data);
    if (data.cktMessage && data['thumb-urls']) {

        var designId = data["design-id"];
        var imgUrl = 'http:' + data['thumb-urls'][0];
        $.ajax({
            url: '/Image/UploadOnlineImage',
            type: 'POST',
            dataType: "json",
            data: { imageUrl: imgUrl, fileName: designId },
            success: function (ret) {               
                if (ret) {
                    if (ret.errcode > 0) {
                        //console.log(designId);
                        //console.log(ret.errmsg);
                        //return;
                        materialInsert(designId, ret.errmsg); 
                    }
                    else {
                        alert('系统繁忙，请稍候重试。');
                    }
                }
            }
        });
    }
}

//新增素材
function materialInsert(designId, imgUrl) {
    var m = new Object();
    m.vcImage = imgUrl;
    m.vcData = designId;
    m.nMsgType = 11;

    $.ajax({
        url: '/Management/MaterialInsert',
        type: 'POST',
        dataType: "json",
        data: { inputModel:m },
        success: function (data) {
            console.log(data);
            if (data.code > 0) {
                setTimeout(function () {
                    window.location.href = window.location.href;
                }, 1000);
            }
            else {
                alert(data.msg); 
            }
        }, error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
}
