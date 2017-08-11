define(['jquery','cube','mune'], function($,cube,page) {
    var sizeCont = {
        init:function(){
            this.clickBtn();
        },
        // 计算字段公式 验证方法 
        checkJsgs: function($dom,name,exp) {
            //验证普通情况
            var validataResult = {
                "msg":"",
                "state":true
            }
            if(!exp){
                validataResult.msg = "表达式不能为空!";
                validataResult.state = false;
                return validataResult
            } 
            //验证[是否在colunms中有]或【参数】中
            var columnsInExp = exp.match(/\[(.+?)\]/g);//匹配出[]
            var caption = $tagertR.data().caption();
            var columnsFlag = "pass";
            for(var i in columnsInExp){
                for(var j in caption){
                    if("[" +caption[j] + "]" == columnsInExp[i]){
                        columnsFlag = "pass";
                        break; 
                    }
                    columnsFlag = "fail" 
                }
                if(columnsFlag == "fail") break;
            }
            if(columnsFlag == "fail"){
                validataResult.msg = "列表达式有误！!";
                validataResult.state = false;
                return validataResult;
            }
            //验证系统参数。。。。
            // 验证str是否有引号
            $("#showArea .str").each(function(){
                if(!/^'[^'"]+'$/.test($(this).text())){
                    validataResult.msg = "字符要用''引起来!";
                    validataResult.state = false;
                    return validataResult;
                }
            })
            // 关键字验证 普通验证中验了keyWords + 值 + keyWords + 值
            // CASE 表达式 WHEN 值1 THEN 返回值1 WHEN 值2 THEN 返回值2 ELSE 默认返回值
            var keyWordsArr = [];
            $("#showArea .keyWords").each(function(){
                keyWordsArr.push($(this).text().toLowerCase());
            });
            var keyWordsStr = keyWordsArr.join("").toLowerCase();
            if(keyWordsStr.indexOf("case") != -1 && keyWordsStr.indexOf("casewhenthen") == -1){
                validataResult.msg = "case后必须要有when...then...";
                validataResult.state = false;
                return validataResult;
            }


            // 特殊处理 验证log底数 >0 !=1
            try{
                var logExpArr = [].concat(exp.match(/log\(0,[^\)]+/gi))
                .concat(exp.match(/log\(1,[^\)]+/gi))
                .concat(exp.match(/log\(-\d+,[^\)]+/gi));
                if(logExpArr.join("")){
                    return {
                        "msg":"LOG函数底数应大于0且不等于1",
                        "state":false
                    }   
                }
                 
            }catch(e){

            }
            
            //扩展  对于不同公式的验证 取对应class上的值单独验证  每种公式对应一种验证方法 
            var string = ""; 
            var expString = "";
            $("#showArea span:not(.notFetch)",$dom).each(function(idx,item){
                if($(this).hasClass('ysf')){
                    string += $(this).text()
                }else if($(this).hasClass('keyWords')){
                    string += "k"
                }else if($(this).hasClass('illegal')){
                    string +="n"
                }else if($(this).hasClass('now')){
                    string +="b"//b表示允许后边出现空括号  now()
                }else{
                    string += "a"
                }
                expString += $(this).attr("etype");//公式简化处理
            }) 
            // 剔除空白符 
            string = string.replace(/\s/g, '');
            // 剔除b()----a 还原正常情况
            string = string.replace(/b\(\)/gi,'a');
            // 错误情况，空字符串  
            if ("" === string) {
                validataResult = {
                    "msg":"表达式不能为空",
                    "state":false
                }
                return validataResult;
            }
            // 错误情况，非法字符 
            if (string.indexOf("n") != -1) {
                validataResult = {
                    "msg":"含有非法字符",
                    "state":false
                }
                return validataResult;
            }
            // 错误情况，运算符连续 
            if (/[\+\-\*\/]{2,}/.test(string)) {
                validataResult = {
                    "msg":"运算符不能连续",
                    "state":false
                }
                return validataResult;
            }
            // // 错误情况，运算符连续 ,关键字不能连续 
            // if (/[k]{2,}/.test(string)) {
            //     validataResult = {
            //         "msg":"关键字不能连续",
            //         "state":false
            //     }
            //     return validataResult;
            // }
            // 错误情况，运算符结束  
            if (/[\+\-\*\/]/.test(string.substr(string.length - 1, 1))) {
                validataResult = {
                    "msg":"不能以运算符结束",
                    "state":false
                }
                return validataResult;
            }
            // 错误情况，运算符*/开头  
            if (/[\+\*\/]/.test(string.substr(0, 1))) {
                validataResult = {
                    "msg":"不能以运算符开头",
                    "state":false
                }
                return validataResult;
            }
            // 错误情况,变量连续  
            if (/[\a]{2,}/.test(string)) {
                validataResult = {
                    "msg":"变量不能连续",
                    "state":false
                }
                return validataResult;
            }
            // 空括号  
            if (string.indexOf("()") != -1) {
                validataResult = {
                    "msg":"()不能为空",
                    "state":false
                }
                return validataResult;
            }
            // 错误情况，括号不配对  
            var stack = [];
            for (var i = 0, item; i < string.length; i++) {
                item = string.charAt(i);
                if ('(' === item) {
                    stack.push('(');
                } else if (')' === item) {
                    if (stack.length > 0) {
                        stack.pop();
                    } else {
                        validataResult = {
                            "msg":"()不配对",
                            "state":false
                        }
                        return validataResult;
                    }
                }
            }
            if (0 !== stack.length) {
                validataResult = {
                    "msg":"()不配对",
                    "state":false
                }
                return validataResult;
            }
            // 错误情况，(后面是运算符   
            if (/\([\+\*\/]/.test(string)) {
                validataResult = {
                    "msg":"(后面不能是运算符",
                    "state":false
                }
                return validataResult;
            }
            // 错误情况，)前面是运算符  
            if (/[\+\-\*\/]\)/.test(string)) {
                validataResult = {
                    "msg":")前面不能是运算符",
                    "state":false
                }
                return validataResult;
            }
            // 错误情况，(前面不是运算符  
            if (/[^\+\-\*\/k]\(/i.test(string)) {
                validataResult = {
                    "msg":"(前面不是运算符",
                    "state":false
                }
                return validataResult;
            }
            // 错误情况，)后面不是运算符  
            if (/\)[^\+\-\*\/\|\)]/.test(string)) {
                validataResult = {
                    "msg":")后面不是运算符 ",
                    "state":false
                }
                return validataResult;
            }
            // 单个简单公式的验
            // expString   string  
            // c:sysParam  n:number ysf:ysf m:hasMesured:dimention  l:logicKeyWords 
            // e:expKeyWords    j:jhKeyWords    s:string    f:illegal
            // t:t(n,n)......power log 
            // 聚合函数只能聚合度量
            // "j(d)+j(m)"
            var jhArr = expString.match(/(j\([^j\)]+\))/gi);
            for(var i in jhArr){
                if(jhArr[i].match(/\-?[nds]/g)) return {
                    "msg":"聚合函数只能聚合度量",
                    "state":false
                }
            }
            // T1 ABS CEIL FLOOR
            var T1 = expString.match(/(T1\([^T1\)]+\))/gi);
            for(var i in T1){
                if(!/T1\(\-?[nm]\)/gi.test(T1[i])) return {
                    "msg":"ABS,CEIL,FLOOR函数只能写成ABS(数字)的形式",
                    "state":false
                }
            }
            //T2 power LOG ROUND格式验证
            var T2 = expString.match(/(T2\([^T2\)]+\))/gi);
            for(var i in T2){
                if(!/T2\(\-?[nm],\-?[nm]\)/gi.test(T2[i])) return {
                    "msg":"POWER,LOG,ROUND函数只能写成POWER(数字,数字)的形式",
                    "state":false
                }
            }
            // T3 SUBSTR('字符串','开始位置','截取长度')
            var T3 = expString.match(/(T3\([^T3\)]+\))/gi);
            for(var i in T3){
                if(!/T3\([sd],\-?[nm](,\-?[nm])?\)/gi.test(T3[i])) return {
                    "msg":"SUBSTR函数只能写成SUBSTR(字符串,数字,数字)或SUBSTR(字符串,数字)的形式",
                    "state":false
                }
            }
            // T4 REPLACE('字符串','子串','替换串')
            var T4 = expString.match(/(T4\([^T4\)]+\))/gi);
            for(var i in T4){
                if(!/T4\([sd],[sd],[sd]\)/gi.test(T4[i])) return {
                    "msg":"REPLACE函数只能写成REPLACE(字符串,子串,替换串)的形式",
                    "state":false
                }
            }
            // T5 LENGTH LOWER UPPER  LENGTH('字符串')
            var T5 = expString.match(/(T5\([^T5\)]+\))/gi);
            for(var i in T5){
                if(!/T5\([sd]\)/gi.test(T5[i])) return {
                    "msg":"LENGTH,LOWER,UPPER函数只能写成LENGTH(字符串)的形式",
                    "state":false
                }
            }
            // T6 TRY_CAST TRY_CAST('表达式' AS INTEGER)
            var T6 = expString.match(/(T6\([^T6\)]+\))/gi);
            for(var i in T6){
                if(!/T6\(([sd])|(\-?[mn])ee\)/gi.test(T6[i])) return {
                    "msg":"TRY_CAST函数只能写成TRY_CAST(字符/数字 AS INTEGER/VARCHAR/DOUBLE)的形式",
                    "state":false
                }
            }
            // X1 DATE_FORMAT(now(),'%Y-%m-%d')  FORMAT(now(),'%Y/%m/%d %T')
            // "X1(now(),%Y-%m-%d)+T7(now(),%Y/%m/%d %T)"
            var X1 = expString.match(/(X1\(now\(\)[^X1\)]+\))/gi);
            for(var i in X1){
                if(!/X1\(now\(\),%Y[\-\/]%m[\-\/]%d(%T)?\)/gi.test(X1[i].replace(/\s/gi,""))) return {
                        "msg":"DATE_FORMAT函数格式不对",
                        "state":false
                    }
            }
            //X2 DATA_PARSE('2017-02-14','%Y-%m-%d') DATE_PARSE('2017/02/14 18:30:15','%Y/%m/%d %T')
            // "X2(2017-02-14,%Y-%m-%d)+X8(2017/02/14 18:30:15,%Y/%m/%d %T)"
            var X2 = expString.match(/X2\([^X\)]+\)/gi);
            for(var i in X2){
                if(!/X2\(\d{4}[\/-]\d{2}[\/-]\d{2}(\d{2}:\d{2}:\d{2})?,%Y[\-\/]%m[\-\/]%d(%T)?/gi.test(X2[i].replace(/\s/gi,""))) return {
                    "msg":"DATA_PARSE函数格式不对",
                    "state":false
                }
            }
            // T7 IF(2=2,1,0)  
            return validataResult;
        },
        validatorName:function(name){//必验证  独立出来
            var validataResult = {
                "msg":"",
                "state":true
            };
            if(!name){
                validataResult.msg = "名称不能为空!";
                validataResult.state = false;
                return validataResult;
            }
            if (!/^([\u4e00-\u9fa5]+|[a-zA-Z0-9_]+)+$/.test(name)) {
                validataResult.msg = "名称中只能包含中英文、数字和下划线!";
                validataResult.state = false;
                return validataResult;
            }  
            var caption = $tagertR.data().caption();
            var currentEditCalName = $(".calName input").attr("currentEdit");
            // if(currentEditCalName){//修改时，可以不修改名称
            //     caption = caption.join().replace(currentEditCalName,"").split(",");
            // }
            for(var i in caption){
                //验证名称是否重复
                if(caption[i] == currentEditCalName) caption[i] = "";
                if(name == caption[i]){
                    validataResult.msg = "名称已存在，请修改！!";
                    validataResult.state = false;
                    return validataResult;
                }
            }
            return validataResult;
        },
        validatorCal:function(exp){//验证公式内部计算值
            function getBracketsStrByLevel(str){
                var l = [];
                var r = [];
                for(var i in str){
                    if(str[i] == "("){
                        l.push(i-0)
                    }
                    if(str[i] == ")"){
                        r.push(i-0)
                    }
                }
                l = l.reverse()
                // 括号配对
                var bracketIdxArr = [];
                var levelStr = "";
                for(var j in l){
                    for(var k in r){
                        if(r[k] > l[j]){
                            levelStr = str.substring(0,l[j] + 1);
                            bracketIdxArr.push({
                                idx:[l[j],r[k]],
                                level:levelStr.match(/\(/g).length - (levelStr.match(/\)/g) ? levelStr.match(/\)/g).length : 0),//括号层级
                                str:str.substring(l[j]+1,r[k])
                            });
                            console.log(str.substring(l[j]+1,r[k]))
                            r.splice(k,1,-1)
                            break   
                        }
                    }
                }
                bracketIdxArr.push({
                    idx:[l[j],r[k]],
                    level:0,//括号层级
                    str:str.substring(0)
                })
                bracketIdxArr = bracketIdxArr.sort(function(a,b){
                    return b.level - a.level
                })
                // 将同一层的放到一个数组
                var resultArr = [];
                var obj = {}
                $.each(bracketIdxArr,function(){
                    if(obj[this.level] == null){
                        obj[this.level] = resultArr.push(this)
                    }else{
                        resultArr[resultArr.length - 1].str = resultArr[resultArr.length - 1].str + "," + this.str
                    }
                })
                return resultArr
            }
            
            var expArr = getBracketsStrByLevel(exp);
            for(var i in expArr){
                // var thisLevelExp = this.str;
                var thisLevelExpArr = expArr[i].str.split(",");
                $.each(thisLevelExpArr,function(idx){
                    var thisExpStr = this  //当前表达式  去替换上一层的
                    // var thisLevelCalType = fn(this)  //  fn(this)应返回计算结果类型
                    // 正则替换 (thisExpStr)
                    // expArr[i + 1].str = expArr[i + 1].str.replace(thisExpStr,thisLevelCalType) // expArr[i + 1] 不能超出数组长度
                })
            }
            
            function fn(str){
                // "j(m+m)-(j(m)+j(m))-n+T6(see)-T5(s)+T6(see)"
                // m+m-j(m) || 3
                //j(m) ||  * / + -  
                // d m s n
                var result = {
                    msg:"",
                    state:true
                }
                // 优先匹配出关键字代表 直接替换成结果   在之前已经验证过了


                if(str.indexOf("||") != -1){
                    switch (true){
                        case /[mn]/.test(str):
                            result = {
                                msg:"||不能与非字符运算",
                                state:false    
                            }
                            return result
                        break
                    }
                }
            }
            // .................循环每一层（循环中将当前式子转换成一个值类型，去替换上一(多个值循环)层的每一个匹配的字符）  
            // fn(ysf){
            //     switch(ysf){
            //         case * :
            //     }
            // }

            // 循环expArr一个一个替换
            // h聚合后的结果
            //一、 (j(m)-j(m) + j(m))/j(m) AS VARCHAR    1.取j(m)    2.验证j(m)j(m)j(m)通过后替换为h+h+h 3.h+h+h验证后替换为h + h
            // 4.h+h验证后替换为h 直到表达式中没有运算符为止，将没有运算符的子串替换到母串中 
            //二、 (h)/j(m) AS VARCHAR
            // (SUM(   m    )-SUM(  m   ))/SUM([数量]) AS VARCHAR
            // (      j      -      j    )/SUM([数量]) AS VARCHAR
            // (             j           )/SUM([数量]) AS VARCHAR
            // (             j           )/SUM([数量]) AS VARCHAR
            
        },
        validator:function(name,exp){//验证特殊情况 深度验证
            var validataResult = {
                "msg":"",
                "state":true
            };
            // if(!exp){
            //     validataResult.msg = "表达式不能为空!";
            //     validataResult.state = false;
            //     return validataResult
            // } 
            // //验证[是否在colunms中有]或【参数】中
            // var columnsInExp = exp.match(/\[(.+?)\]/g);//匹配出[]
            // var caption = $tagertR.data().caption();
            // var columnsFlag = "pass";
            // for(var i in columnsInExp){
            //     for(var j in caption){
            //         if("[" +caption[j] + "]" == columnsInExp[i]){
            //             columnsFlag = "pass";
            //             break; 
            //         }
            //         columnsFlag = "fail" 
            //     }
            //     if(columnsFlag == "fail") break;
            // }
            // if(columnsFlag == "fail"){
            //     validataResult.msg = "列表达式有误！!";
            //     validataResult.state = false;
            //     return validataResult;
            // }
            // // function testDimention(arr){//检测是否有维度
            // //     var hasDimention = false;
            // //     for(var i in columnsInExp){
            // //         $.each(arr,function(idx,val){
            // //             if("[" + val + "]" == columnsInExp[i]){
            // //                 hasDimention = true;
            // //                 return false;
            // //             }
            // //         });
            // //     }
            // //     return hasDimention
            // // }
            // // function testMesure(arr){//检测是否有度量
            // //     var hasMesure = false;
            // //     for(var i in columnsInExp){
            // //         $.each(arr,function(idx,val){
            // //             if("[" + val + "]" == columnsInExp[i]){
            // //                 hasMesure = true;
            // //                 return false;
            // //             }
            // //         });
            // //     }
            // //     return hasMesure
            // // }
            // //验证[是否在colunms中有]  end
            // // 验证列中是否同时存在dimention与mesure
            
            // // var dimentionArr = $("#js_insertDimension li").map(function(){//caption
            // //     return $(this).text();
            // // });
            // // var measureArr = $("#js_insertMeasure li").map(function(){//caption
            // //     return $(this).text();
            // // });
            // // function isDimentionOrMesure(str){

            // // }
            // //验证系统参数。。。。
            // // 验证str是否有引号
            // $("#showArea .str").each(function(){
            //     if(!/^'[^'"]+'$/.test($(this).text())){
            //         validataResult.msg = "字符要用''引起来!";
            //         validataResult.state = false;
            //         return validataResult;
            //     }
            // })
            // // 关键字验证 普通验证中验了keyWords + 值 + keyWords + 值
            // // IF 条件 THEN 返回值1 ELSE 返回值2
            // // CASE 表达式 WHEN 值1 THEN 返回值1 WHEN 值2 THEN 返回值2 ELSE 默认返回值
            // var keyWordsArr = [];
            // $("#showArea .keyWords").each(function(){
            //     keyWordsArr.push($(this).text().toLowerCase());
            // });
            // var keyWordsStr = keyWordsArr.join("").toLowerCase();
            // if(keyWordsStr.indexOf("if") != -1 && keyWordsStr.indexOf("ifthen") == -1){
            //     validataResult.msg = "if后必须要有then...";
            //     validataResult.state = false;
            //     return validataResult;
            // }
            // if(keyWordsStr.indexOf("case") != -1 && keyWordsStr.indexOf("casewhenthen") == -1){
            //     validataResult.msg = "case后必须要有when...then...";
            //     validataResult.state = false;
            //     return validataResult;
            // }
            // //扩展  对于不同公式的验证 取对应class上的值单独验证  每种公式对应一种验证方法 

            return validataResult;
        },
        changeToRealFormula:function(formula){
            var columnsData =  $tagertR.data().dimensions ? $tagertR.data().dimensions().columns : [];
            var columnsInExp = formula.match(/\[(.+?)\]/g);//匹配出[]
            var prefixTableName = '';
            var realFormula = formula;
            var dataTypeArr = [];
            var dimensionOrMesureArr = [];
            for(var i in columnsInExp){
                for(var j in columnsData){
                    if("[" +columnsData[j].name + "]" == columnsInExp[i]){
                        dataTypeArr.push(columnsData[j].dataType);
                        dimensionOrMesureArr.push(columnsData[j].type);
                        prefixTableName = columnsData[j].sourceTablePrefix + "_" + columnsData[j].sourceTable + "_" + columnsData[j].columnName;
                        var reg =new RegExp("(\\["+columnsInExp[i].substring(1,columnsInExp[i].length-1)+"\\])","g"); // re为/^\d+bl$/gim
                        realFormula = realFormula.replace(reg, "["+prefixTableName+"]");
                    }
                }
            }
            return {
                "dataTypeArr":dataTypeArr,
                "realFormula":realFormula,
                "dimensionOrMesureArr":dimensionOrMesureArr
            }
        },
        // 修改其它列时更新计算配置中涉及的字段名
        updateCalculateWhenRename:function(oldName,newName){
            var calDataArr = $(".search-fitter", $tagertR).find("li.create-size").data().sizeData().look;
            var currentFormula = "";
            $.each(calDataArr,function(){
                currentFormula = this.formula;
                var reg =new RegExp("(\\["+oldName+"\\])","g"); 
                this.formula = currentFormula.replace(reg, "["+newName+"]")
            })
        },
        // 删除计算字段  区别删表时的连带自动删除
        delCalculation:function(delName){
            var calDataArr = $(".search-fitter", $tagertR).find("li.create-size").data().sizeData().look;
            $.each(calDataArr,function(idx){
                if(this.name == delName){
                    calDataArr.splice(idx,1);
                    return false
                }
            })
            //回显时，，删除$opendata中数据
            if($tagertR.data().$openData && $tagertR.data().$openData().calDimensionMeasures != undefined && $tagertR.data().$openData().calDimensionMeasures!=""){
                var sizeList = $tagertR.data().$openData().calDimensionMeasures;
                $.each(sizeList,function(idx){
                    if(this.name == delName){
                        sizeList.splice(idx,1);
                        return false
                    }
                })
            }
            $tagertR.find(".search-table1").click();
        },
        modifiCalName:function(oldName,newName){//修改计算字段中注释名
            var calArr = $(".search-fitter", $tagertR).find("li.create-size").data().sizeData().look;
            $.each(calArr,function(){
                if(this.name == oldName){
                    this.name = newName;
                }
            }) 
        },
        getContentType:function(actualFormula){//获取 公式类型
            var hasPar = actualFormula.indexOf("{$department}") != -1 || actualFormula.indexOf("{$user}") != -1 || actualFormula.indexOf("{$area}") != -1;
            var keyWords = ["SUM(","sum(","AVG(","avg(","COUNT(","count(","MIN(","min(","COUNTD(","countd(","MAX(","max(","STDDEV_POP(","stddev_pop(","STDDEV_SAMP(","stddev_samp(","VAR_POP(","var_pop(","VAR_SAMP(","var_samp("];
            var hasJX = false;
            $.each(keyWords,function(){
                if(actualFormula.indexOf(this) != -1){
                    hasJX = true;
                    return
                }
            });
            if(hasPar && !hasJX){//只有系统参数
                return "2"
            } 
            if(!hasPar && hasJX){
                return "1"
            }
            if(hasPar && hasJX){
                return "1,2"
            }
            return "0"
        },
        getDataType:function(actualFormula,$dom){//获取数据类型  预判断  $dom是类型选择
            var result = this.changeToRealFormula(actualFormula);
            var dataTypeStr = result.dataTypeArr.join("");
            var dimensionOrMesureStr = result.dimensionOrMesureArr.join("");
            if($dom.attr("userCtrl") == "true"){//用户选择的
                if($dom.text() == "度量") return "integer"
                if(dataTypeStr.indexOf("timestamp") != -1){
                    return "timestamp"
                }
                return "varchar"
            }else{//用户没有选择
                if(dimensionOrMesureStr.indexOf("dimension") == -1){//没有维度，为mesure
                    return "integer"
                }else{
                    if(dataTypeStr.indexOf("timestamp") != -1){
                        return "timestamp"
                    }
                    return "varchar"
                }
            }
            
            
        },
        alertCalFn:function(option){//打开配置页面
            var _this = this;
            var cubeId = $tagertR.data().$openData() != "" ? $tagertR.data().$openData().cubeId : "";
            var $that = $(".search-fitter", $tagertR).find("li.create-size");
            var saveDat = [];
            var lookDat = [];
            if ($(".type1").find("div[darg]").length == 0) {
                dac.alert("没有表间关系不能添加计算字段!");
                return;
            }
            $that.alert({
                title: "新建计算字段",
                url: "/alertHtml/alert-calculation.html",
                btnAlign: "center",
                data: option,
                // submitAction:$$("/measureAndDimension/createCalculateMeasure.json"),
                onSubmit: function(form) {
                    // alert("submitAction")
                    var actualFormula = $("#editArea",form).val();
                    var formulaName = $(".calName input",form).val();
                    var lookDat = [];
                    // var realFormula = _this.changeToRealFormula(actualFormula)
                    // 验证格式的合法性
                    // console.log(realFormula)
                    var validatorName = _this.validatorName(formulaName);
                    if(!validatorName.state){
                        dac.alert(validatorName.msg);
                        return false;
                    }
                    var normalValidateResult = _this.checkJsgs(form,formulaName,actualFormula);
                    // 深度验证 验证每个公式内部的合法性
                    // var deepValidataResult = _this.validator(formulaName,actualFormula);
                    // _this.validatorCal(actualFormula);
                    //验证失败是否交功能
                    if(!normalValidateResult.state){
                        dac.confirm(normalValidateResult.msg + "您确定要提交吗？",function(){
                            submitCal()
                        },function(){
                            // return false
                        })
                        // return false;
                    }else{
                        submitCal()
                    }
                    function submitCal(){
                        var calFieldType = _this.getContentType(actualFormula);
                        var dataType = _this.getDataType(actualFormula,$("#dimensionOrmesure",form));
                        var dimensionOrMesure = "";
                        if($("#dimensionOrmesure").attr("userctrl")){//用户选择了就以用户选择为准  没有选择，以预判断为准
                           dimensionOrMesure = $(".type").find(".toggleList span").text() == "维度" ? "dimension" : "measure"; 
                        }else{
                           dimensionOrMesure = dataType == "integer" ? "measure" : "dimension";
                        }
                        // return false;
                        lookDat.push({
                            "name": formulaName,
                            "formula": actualFormula,
                            "type":dimensionOrMesure,
                            "measureType":3,
                            "calFieldType":calFieldType,
                            "dataType":dataType,
                            "visible": "1"
                        });
                        //累加合并已有计算字段
                        // 修改时，删除之前老的字段
                        if(option.state == "edit"){//编辑时
                            var modifiArr = $that.data().sizeData().look;
                            $.each(modifiArr,function(idx){//修改字段名
                                if(this.name == option.calName){
                                   $that.data().sizeData().look.splice(idx,1);
                                   return false
                                }
                            })
                        }
                        if ($that.data().sizeData && $that.data().sizeData() != "") {
                            //saveDat 可否删除  暂未发现使用处
                            // try{saveDat = $that.data().sizeData().save.concat(saveDat)}catch(e){saveDat = []}
                            lookDat = $that.data().sizeData().look.concat(lookDat);
                        }

                        //回显合并已有计算字段 //Arry[0].formula   $tagertR.data().$openData().calDimensionMeasures是模型上的计算字段
                        if($tagertR.data().$openData && $tagertR.data().$openData().calDimensionMeasures != undefined && $tagertR.data().$openData().calDimensionMeasures!=""){
                            var sizeList = $tagertR.data().$openData().calDimensionMeasures;
                            //编辑时删除旧字段
                            $.each(sizeList,function(idx){//修改字段名
                                if(this.name == option.calName){
                                   $that.data().sizeData().look.splice(idx,1);
                                   return false
                                }
                            })
                            for(var i in sizeList){
                                var sizeFlag = true;
                                for(var j in lookDat){
                                    if(sizeList[i].formula == lookDat[j].formula || sizeList[i].name == lookDat[j].name){
                                        sizeFlag = false;
                                    }
                                }
                                if(sizeFlag) lookDat.push({
                                    "name": sizeList[i].name,
                                    "formula": sizeList[i].formula,
                                    "type":sizeList[i].type,
                                    "measureType":sizeList[i].measureType,
                                    "calFieldType":sizeList[i].calFieldType,
                                    "dataType":sizeList[i].dataType,
                                    "visible": sizeList[i].visible
                                })
                            }
                        }
                        $that.data({
                            sizeData: function() {
                                return {
                                    // 'save': saveDat,
                                    'look': lookDat
                                };
                            }
                        });
                        form.parents(".alert-container").remove();
                        console.log($(".search-fitter", $tagertR).find("li.create-size").data().sizeData())
                        $tagertR.find(".search-table1").click();
                    }




                    return false;




                },
                callBack: function(d, e, form) {//关闭后执行？
                    // form.parents(".alert-container").remove();
                    // // $(".validator-msg").hide()
                    // $tagertR.find(".search-table1").click();
                },
                htmlInit:function(){
                    // dacAlert.prototype.setNewCenter()
                },
                onCancel:function(){
                    // $(".validator-msg").hide() 
                },
                onClose:function(){
                    // $(".validator-msg").hide() 
                }
            });
        },
        clickBtn:function(){
            var _this = this;
            /* 创建计算配置点击事件 */
            $(".search-fitter", $tagertR).find("li.create-size").off("click").on("click", function() {
                var option = {
                    page: "create",
                };
                _this.alertCalFn(option)
            });
        }
    };
    return sizeCont;
});