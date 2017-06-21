//自定义加法，修正小数相加精度问题
function addNum(num1, num2) {
    var sq1, sq2, m;
    try { sq1 = num1.toString().split(".")[1].length; } catch (e) { sq1 = 0; }
    try { sq2 = num2.toString().split(".")[1].length; } catch (e) { sq2 = 0; }

    m = Math.pow(10, Math.max(sq1, sq2));
    return (num1 * m + num2 * m) / m;
}
//获取指定url参数的值
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    //unescape  相当于decodeURI() 和 decodeURIComponent() 取而代之。
    if (r != null) return unescape(r[2]); return null;
}
//获取对象的GUID属性
function getGuid(obj) {
    if (obj.hasOwnProperty("GUID")) {
        return obj["GUID"];
    }
    return "";
}
//IE没有trim
String.prototype.trim = function () {
    // 用正则表达式将前后空格  
    // 用空字符串替代。  
    return this.replace(/(^\s*)|(\s*$)/g, "");
}
//0|[]|{}|""这些都返回false
function isNotEmpty(obj) {
    if (typeof (obj) == "undefined" || null == obj) {
        return false;
    }
    if (typeof (obj) == "function") {
        return true;
    }
    if (obj.constructor == Number) {
        if (obj) {
            return true;
        } else {
            return false;
        }
    } else if (typeof (obj) == "string") {
        if (obj != "") {
            return true;
        } else {
            return false;
        }
    } else {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                return true;
            }
        }
        return false;
    }
};

//复制对象(obj array string num)
function copy_obj(obj) {
    if (obj.constructor == Array) {
        var new_obj_list = [];
        for (var i = 0; i < obj.length; i++) {
            var item = obj[i];
            new_obj_list.push(copy_obj(item));
        }
        return new_obj_list;
    } else if (obj.constructor == Number || obj.constructor == String) {
        var num = obj;
        return num;
    } else {
        return $.extend(true, {}, obj);
    }
};


//给定一个dom元素，得到与它最近的指定类型的parent元素(jquery类型) obj='.class'  obj = '#id' parent_type = div a i b ...
function get_parent(obj, parent_type) {
    var $parent = $(obj).parent();
    while ($parent.length > 0 && $parent[0].nodeName != parent_type.toUpperCase()) {
        $parent = $parent.parent();
    }
    return $parent;
}


//兼容IE8没有indexOf 方法的
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*, from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
             ? Math.ceil(from)
             : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt)
                return from;
        }
        return -1;
    };
}

function transferredJquerySpecialChars(strs) {
    //转义jquery选择器的特殊字符
    var jquerySpecialChars = [" ", "~", "`", "@", "#", "%", "&", "=", "'", "\"",
        ":", ";", "<", ">", ",", "/"
    ];
    for (var i = 0; i < jquerySpecialChars.length; i++) {
        strs = strs.replace(new RegExp(jquerySpecialChars[i],
            "g"), "\\" + jquerySpecialChars[i]);
    }
    return strs;
}
function delSpecialChar (strs) {
    //删除特殊字符
    return strs.replace(/[<|>|{|}|(|)]/g, "");
}