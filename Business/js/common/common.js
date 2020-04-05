function dateFormat(row, column, cellValue, index) {
    const daterc = row[column.prop];
    if (daterc != null) {
        const dateMat = new Date(parseInt(daterc.replace("/Date(", "").replace(")/", ""), 10));
        const year = dateMat.getFullYear();
        const month = dateMat.getMonth() + 1;
        const day = dateMat.getDate();
        const hh = dateMat.getHours();
        const mm = dateMat.getMinutes();
        const ss = dateMat.getSeconds();
        const timeFormat = year + "-" + (month.toString().length == 1 ? "0" + month : month) + "-" + (day.toString().length == 1 ? "0" + day : day) + " " + (hh.toString().length == 1 ? "0" + hh : hh) + ":" + (mm.toString().length == 1 ? "0" + mm : mm) + ":" + (ss.toString().length == 1 ? "0" + ss : ss);
        return timeFormat;
    }
}

function dateFormatColumn(column, type) {
    if (column != null) {
        const dateMat = new Date(parseInt(column.replace("/Date(", "").replace(")/", ""), 10));
        const year = dateMat.getFullYear();
        if (year == "1900") {
            return '';
        }
        const month = dateMat.getMonth() + 1;
        const day = dateMat.getDate();
        const hh = dateMat.getHours();
        const mm = dateMat.getMinutes();
        const ss = dateMat.getSeconds();
        if (type == 1) {
            return year + "-" + (month.toString().length == 1 ? "0" + month : month) + "-" + (day.toString().length == 1 ? "0" + day : day);
        } else {
            return timeFormat = year + "-" + (month.toString().length == 1 ? "0" + month : month) + "-" + (day.toString().length == 1 ? "0" + day : day) + " " + (hh.toString().length == 1 ? "0" + hh : hh) + ":" + (mm.toString().length == 1 ? "0" + mm : mm) + ":" + (ss.toString().length == 1 ? "0" + ss : ss);
        }
    }
}

//微信账号处理
function wxAccount(str) {
    str += "";
    return str.length > 6 ? str.substring(0, 3) + "***" + str.substring(str.length - 3) : str.substring(0, 3) + "***";
}

//处理时间段
function timeDistance(month) {
    month = parseInt(month);
    var array = [];
    var date = new Date();
    var end = dateFormatTime(date);
    var begin = dateFormatTime(date.setMonth(date.getMonth() - month));
    array.push(begin);
    array.push(end);
    return array;
}

function dateFormatTime(str) {
    var date = new Date(str);
    var month = (date.getMonth() + 1);
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var t = date.getFullYear() + '-' + month + '-' + strDate; // + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();    
    return t;
}
function dateFormatSecondTime(str) {
    var date = new Date(str);
    var month = (date.getMonth() + 1);
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var t = date.getFullYear() + '-' + month + '-' + strDate + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return t;
}
/*
    * formatNumber(s,type)
    * 功能：金额按千位逗号分割
    * 参数：s，需要格式化的金额数值.
    * 参数：type,判断格式化后的金额是否需要小数位.
    * 返回：返回格式化后的数值字符串.
   */
function formatNumber(s, type) {
    if (/[^0-9\.]/.test(s))
        return "0";
    if (s == null || s == "")
        return "0";
    s = s.toString().replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(s))
        s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    if (type == 0) {// 不带小数位(默认是有小数位)
        var a = s.split(".");
        if (a[1] == "00") {
            s = a[0];
        }
    }
    return s;
}

//格式化金额
function toDecimal2(x) {
    var f = Math.round(x * 100) / 100;
    var s = f.toString();
    var rs = s.indexOf('.');
    if (rs < 0) {
        rs = s.length;
        s += '.';
    }
    while (s.length <= rs + 2) {
        s += '0';
    }
    return s;
}

// 判断数组是否有重复的内容
function checkRepeate(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === val) {
            return true;
        }
    }
    return false;
}

function TimeController() {
    var now = new Date();
    var hour = now.getHours();
    var str = "";
    if (hour < 6) {
        str = "凌晨好！";
    }
    else if (hour < 9) {
        str = "早上好！";
    }
    else if (hour < 12) {
        str = "上午好！";
    }
    else if (hour < 14) {
        str = "中午好！";
    }
    else if (hour < 17) {
        str = "下午好！";
    }
    else if (hour < 19) {
        str = "傍晚好！";
    }
    else if (hour < 22) {
        str = "晚上好！";
    }
    else {
        str = "夜里好！";
    }
    $("#greeting").html(str);
}

function GetCharByteCount(value) {
    var length = value.length;
    for (var i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 127) {
            length++;
        }
    }
    return length;
}

/* 
 * 处理过长的字符串，截取并添加省略号 
 * 注：半角长度为1，全角长度为2 
 *  
 * pStr:字符串 
 * pLen:截取长度 
 *  
 * return: 截取后的字符串 
 */
function cutStringTail(pStr, pLen) {
    var _ret = cutString(pStr, pLen);
    var _cutFlag = _ret.cutflag;
    var _cutStringn = _ret.cutstring;

    if ("1" == _cutFlag) {
        return _cutStringn + "...";
    } else {
        return _cutStringn;
    }
}

//------------字符串截取------------------------------------
/* 
 * 取得指定长度的字符串 
 * 注：半角长度为1，全角长度为2 
 *  
 * pStr:字符串 
 * pLen:截取长度 
 *  
 * return: 截取后的字符串 
 */
function cutString(pStr, pLen) {
    pStr = pStr + "";
    // 原字符串长度  
    var _strLen = pStr.length;

    var _tmpCode;

    var _cutString;

    // 默认情况下，返回的字符串是原字符串的一部分  
    var _cutFlag = "1";

    var _lenCount = 0;

    var _ret = false;

    if (_strLen <= pLen / 2) {
        _cutString = pStr;
        _ret = true;
    }

    if (!_ret) {
        for (var i = 0; i < _strLen; i++) {
            if (isFull(pStr.charAt(i))) {
                _lenCount += 2;
            } else {
                _lenCount += 1;
            }

            if (_lenCount > pLen) {
                _cutString = pStr.substring(0, i);
                _ret = true;
                break;
            } else if (_lenCount == pLen) {
                _cutString = pStr.substring(0, i + 1);
                _ret = true;
                break;
            }
        }
    }

    if (!_ret) {
        _cutString = pStr;
        _ret = true;
    }

    if (_cutString.length == _strLen) {
        _cutFlag = "0";
    }

    return { "cutstring": _cutString, "cutflag": _cutFlag };
}

/* 
 * 判断是否为全角 
 *  
 * pChar:长度为1的字符串 
 * return: true:全角 
 *          false:半角 
 */
function isFull(pChar) {
    if ((pChar.charCodeAt(0) > 128)) {
        return true;
    } else {
        return false;
    }
}
//------------字符串截取------------------------------------


function GetMusicPlatInfo(vcMusicLink) {
    var vcPlat = "音乐";
    var vcLogo = "default.jpg";
    if (vcMusicLink == null)
        return "";
    //if (vcMusicLink.indexOf("qq.com") > 0) {
    //    //QQ音乐的网页地址不能直接打开，需要转换。
    //    //格式为 https://y.qq.com/n/yqq/song/003WFYvJ396Avn.html 。其中003WFYvJ396Avn为media_mid，media_mid在dr.vcLink可以找到
    //}
    if (vcMusicLink.indexOf("qq.com") > 0) { vcPlat = "QQ音乐"; vcLogo = "qqyinyue.jpg"; }
    else if (vcMusicLink.indexOf("163.com") > 0) { vcPlat = "网易云音乐"; vcLogo = "wangyiyun.jpg"; }
    else if (vcMusicLink.indexOf("xiami.com") > 0) { vcPlat = "虾米音乐"; vcLogo = "xiami.jpg"; }
    else if (vcMusicLink.indexOf("baidu.com") > 0) { vcPlat = "百度音乐"; vcLogo = "baiduyinyue.jpg"; }
    else if (vcMusicLink.indexOf("xima.tv") > 0) { vcPlat = "喜马拉雅FM"; vcLogo = "xima.jpg"; }
    else if (vcMusicLink.indexOf("kugou.com") > 0) { vcPlat = "酷狗音乐"; vcLogo = "kugou.jpg"; }
    else if (vcMusicLink.indexOf("kuwo.cn") > 0) { vcPlat = "酷我音乐"; vcLogo = "kuwo.jpg"; }
    else if (vcMusicLink.indexOf("duomi.com") > 0) { vcPlat = "多米音乐"; vcLogo = "duomi.jpg"; }
    else if (vcMusicLink.indexOf("migu.cn") > 0) { vcPlat = "QQ音乐"; vcLogo = "migu.jpg"; }

    var info = {};
    info.vcPlat = vcPlat;
    info.vcLogo = "../../images/applogo/" + vcLogo;

    return info;
}

function GetFileUrl(str) {
    var i = str.lastIndexOf('.');
    var fileType = str.substring(i + 1);
    return fileType;
}


function GetTollTypeName(nType) {
    var vcTypeName = '';
    if (nType == 13) {
        vcTypeName = '群裂变';
    }
    else if (nType == 14) {
        vcTypeName = '群托管';
    }
    else if (nType == 15) {
        vcTypeName = '付费群';
    }
    return vcTypeName;
}

//倒计时结算（按天计算）
function formatDuring(mm) {
    var days = parseInt(mm / (60 * 24));
    var hours = parseInt((mm % (60 * 24)) / 60);
    var minutes = parseInt(mm % (60 * 24) % 60);
    return (days > 0 ? days + "天 " : "") + hours + "小时 " + minutes + "分 ";
}

//倒计时结算（按秒计算）
function formatDuringToSeconds(seconds) {
    var hours = parseInt(seconds / 3600 % 24);
    var minutes = parseInt(seconds / 60 % 60);
    return parseInt(seconds / 86400) + "天" + (hours < 10 ? "0" + hours : hours) + "小时" + (minutes < 10 ? "0" + minutes : minutes) + "分";
}

//检查特殊字符
function checkStr(str) {
    var regx = /['"#$%&\^*》>,.:;"<《？，。！@#￥%……’”：/；]/;
    rs = regx.exec(str);
    if (rs != null) {
        return false;
    }
    else {
        return true;
    }
}

//检查特殊字符
function checkStr1(str) {
    var regx = /[<>]+/;
    rs = regx.exec(str);
    if (rs != null) {
        return false;
    }
    else {
        return true;
    }
}

function checkStrToRegx(str, regx) {
    var rs = regx.exec(str);
    if (rs != null) {
        return false;
    }
    else {
        return true;
    }
}

//判断中文和英文个数
function isByteRangeLength(value, param) {
    var length = value.length;
    for (var i = 0; i < value.length; i++) {
        if (value.charCodeAt(i) > 127) {
            length++;
        }
    }
    return (length >= param[0] && length <= param[1]);
}

function Trim(str, is_global) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (is_global.toLowerCase() == "g") {
        result = result.replace(/\s/g, "");
    }
    return result;
}

//判断数组里是否有相同的值
function arrayRepeat(arr) {
    if (arr instanceof Array) {
        var length = arr.length;
        for (var y = 0; y < length; y++) {
            for (var x = y + 1; x < length; x++) {
                if (arr[y] == arr[x])
                    return true;
            }
        }
    }
    return false;
}

//计算main高度
function getContentHei(el, type) {
    const fullHei = document.documentElement.clientHeight,
        header = document.getElementById('header').offsetHeight,
        topObj = document.getElementById(el);
    if (topObj) {
        const top = topObj.offsetTop;
        if (type) {
            document.getElementById(el).style.height = (fullHei - top - header) + 'px';
        } else {
            document.getElementById(el).style.minHeight = (fullHei - top - header - 20) + 'px';
        }
    }
}
// 固定表头
function handleScroll() {
    document.getElementById("_container").addEventListener('scroll', function () {
        const _c = document.getElementById("_container"),
            table_top = document.querySelector('.fixed-header') ? document.querySelector('.fixed-header').offsetTop : 0,
            table_h = document.querySelector('.el-table__header-wrapper');
        if ((_c.scrollTop - table_top) >= 0) {
            table_h.style.position = 'fixed';
        } else {
            table_h.style.position = 'static';
        }
    });
}

function filterText(text, words) {
    var result = '';
    if (!words || text==null) {
        return result;
    }
    for (var i = 0; i < words.length; i++) {
        console.log(text, words[i]);
        if (text.indexOf(words[i]) > -1) {
            result += words[i] + ',';
        }
    }
    if (result) {
        result = result.slice(0, -1);
    }
    return result;
}

function filterTextShielding(text, words) {
    for (var i = 0; i < words.length; i++) {
        console.log(text, words[i]);
        if (text.indexOf(words[i]) > -1) {
            text = text.replace(words[i], "****");
        }
    }
    return text;
}