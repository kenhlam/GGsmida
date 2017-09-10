define(['jquery','cube','mune'], function($,cube,page) {
    var sizeCont = {
        init:function(){
            this.clickBtn();
        },
        // 计算字段公式 验证方法 
        checkJsgs: function($dom,name,exp) {
            //验证普通情况
            var that = this;
            var validataResult = {
                "msg":"",
                "state":true
            }
            if(!exp){
                validataResult.msg = $i18n("js_calculation_js_1");
                validataResult.state = false;
                return validataResult
            } 
            //验证[是否在colunms中有]或【参数】中
            var columnsInExp = exp.match(/\[(.+?)\]/g);
            //匹配出[]
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
                validataResult.msg = $i18n("js_calculation_js_2");
                validataResult.state = false;
                return validataResult;
            }
            //验证系统参数。。。。
            // 验证str是否有引号
            $("#showArea .str").each(function(){
                if(!/^'[^'"]*'$/.test($(this).text())){
                    validataResult.msg = $i18n('js_calculation_js_3')+"\'\'" + $i18n('js_calculation_js_4') + "!";
                    validataResult.state = false;
                    return validataResult;
                }
            })
            var keyWordsArr = [];
            $("#showArea .keyWords").each(function(){
                keyWordsArr.push($(this).text().toLowerCase());
            });
            var keyWordsStr = keyWordsArr.join("").toLowerCase();
            if(keyWordsStr.indexOf("case") != -1 && (keyWordsStr.indexOf("when") == -1 || 
                                                     keyWordsStr.indexOf("then") == -1 || 
                                                     keyWordsStr.indexOf("else") == -1)){
                validataResult.msg = $i18n("js_calculation_js_5");
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
                        "msg":$i18n("js_calculation_js_6"),
                        "state":false
                    }   
                }
            }catch(e){

            }
            //扩展  对于不同公式的验证 取对应class上的值单独验证  每种公式对应一种验证方法 
            var string = ""; 
            var expString = "";
            // var dtypeString = "";
            $("#showArea span:not(.notFetch)",$dom).each(function(idx,item){
                if($(this).hasClass('ysf')){
                    string += $(this).text()
                }else if($(this).hasClass('keyWords')){
                    string += "k"
                }else if($(this).hasClass('illegal')){
                    string +="n"
                }else if($(this).hasClass('now')){
                    string +="b"
                    //b表示允许后边出现空括号  now()
                }else{
                    string += "a"
                }
                if($(this).attr("dataelse")){
                //为了验证null then else特殊化处理u h g
                    expString += $(this).attr("dataelse");
                    //公式简化处理
                }else{
                    expString += $(this).attr("etype");
                    //公式简化处理
                }
                // // 取dtype
                // if($(this).attr("dtype")){
                //     dtypeString += $(this).attr("dtype");
                // }
            }) 
            // 剔除空白符 
            string = string.replace(/\s/g, '');
            // 剔除b()----a 还原正常情况
            string = string.replace(/b\(\)/gi,'a');
            // 错误情况，空字符串  
            if ("" === string) {
                validataResult = {
                    "msg":$i18n("js_calculation_js_7"),
                    "state":false
                }
                return validataResult;
            }
            // 错误情况，非法字符 
            if (string.indexOf("n") != -1) {
                validataResult = {
                    "msg":$i18n("js_calculation_js_8"),
                    "state":false
                }
                return validataResult;
            }
            // 错误情况，运算符连续 
            if (/[\+\-\*\/]{2,}/.test(string)) {
                validataResult = {
                    "msg":$i18n("js_calculation_js_9"),
                    "state":false
                }
                return validataResult;
            }
            // 错误情况，运算符结束  
            if (/[\+\-\*\/]/.test(string.substr(string.length - 1, 1))) {
                validataResult = {
                    "msg":$i18n("js_calculation_js_10"),
                    "state":false
                }
                return validataResult;
            }
            // 错误情况，运算符*/开头  
            if (/[\+\*\/]/.test(string.substr(0, 1))) {
                validataResult = {
                    "msg":$i18n("js_calculation_js_11"),
                    "state":false
                }
                return validataResult;
            }
            // 错误情况,变量连续  
            if (/[\a]{2,}/.test(string)) {
                validataResult = {
                    "msg":$i18n("js_calculation_js_12"),
                    "state":false
                }
                return validataResult;
            }
            // 空括号  
            if (string.indexOf("()") != -1) {
                validataResult = {
                    "msg":$i18n("js_calculation_js_13"),
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
                            "msg":$i18n("js_calculation_js_14"),
                            "state":false
                        }
                        return validataResult;
                    }
                }
            }
            if (0 !== stack.length) {
                validataResult = {
                    "msg":$i18n("js_calculation_js_14"),
                    "state":false
                }
                return validataResult;
            }
            // 错误情况，(后面是运算符   
            if (/\([\+\*\/>=<!\|]/.test(string)) {
                validataResult = {
                    "msg":$i18n("js_calculation_js_15"),
                    "state":false
                }
                return validataResult;
            }
            // 错误情况，)前面是运算符  
            if (/[\+\*\/>=<!\|]\)/.test(string)) {
                validataResult = {
                    "msg":$i18n("js_calculation_js_16"),
                    "state":false
                }
                return validataResult;
            }
            // 错误情况，(前面不是运算符或关键字 
            if (/[^\+\*\/>=<!\|k\(\-]\(/i.test(string)) {
                validataResult = {
                    "msg":$i18n("js_calculation_js_17"),
                    "state":false
                }
                return validataResult;
            }
            // 错误情况，)后面不是运算符  
            if (/\)[^\+\-\*\/\|\)>=<!k]/.test(string)) {
                validataResult = {
                    "msg":$i18n("js_calculation_js_18"),
                    "state":false
                }
                return validataResult;
            }
            // 替换最小单位
            
            // 单个简单公式的验
            // expString   string  
            // c:sysParam  n:number ysf:ysf m:hasMesured:dimention  l:logicKeyWords 
            // e:expKeyWords    j:jhKeyWords    s:string    f:illegal g:else  h:then  u:null
            // t:t(n,n)......power log 
            // 聚合函数只能聚合度量  数字
            // 表达式简化后的验证
            expString = that.replaceExp(expString);
            // 以公式关键字结尾1+sum n+j  [1-9]
            if(/.*[1-9j]$/gi.test(expString)) return{
                "msg":$i18n("js_calculation_js_42"),
                "state":false
            }
            if(/[msdnb][msdnb]/gi.test(expString)) return{
                "msg":$i18n("js_calculation_js_41"),
                "state":false
            }
            if(expString.indexOf('js') != -1) return {
            //j(s)
                "msg":$i18n("js_calculation_js_19"),
                "state":false
            }
            if(expString.indexOf('T1s') != -1) return {
            //T1(s)
                "msg":$i18n("js_calculation_js_20"),
                "state":false
            }
            if(expString.indexOf('T5n') != -1) return {
            //T1(s)
                "msg":$i18n("js_calculation_js_24"),
                "state":false
            }
            if(expString.indexOf('T7n') != -1) return {
            //T1(s)
                "msg":$i18n("js_calculation_js_24"),
                "state":false
            }
            // if(expString.indexOf('T2s') != -1) return {//T1(s)
            //     "msg":$i18n("js_calculation_js_20"),
            //     "state":false
            // }
            // // 目前任何运算符(case s when 1 then s会出问题)都不能混合字符和数字运算 注意字符与数字转换的公式 varchar double integer length 
            if(/[nm]\s*[\+\-\*\/]\s*[sd]/gi.test(expString) || /[sd]\s*[\+\-\*\/]\s*[mn]/gi.test(expString)) return {
                //j(s)
                "msg":$i18n("js_calculation_js_39"),
                //运算符前后类型不同不能运算
                "state":false
            }
            if(/[sdmnb]\s*[\+\-\*\/\|]\|?\s*b/gi.test(expString) || /b\s*[\+\-\*\/]\s*[sdmnb]/gi.test(expString)) return {
                //j(s)
                "msg":$i18n("js_calculation_js_43"),
                //运算符前后类型不同不能运算
                "state":false
            }
            if(/[nm]\|\|[sd]/gi.test(expString) || /[sd]\|\|[mn]/gi.test(expString)
                || /b\|\|[mnsd]/gi.test(expString) || /[msdn]\|\|b/gi.test(expString)) return{
                // s||n  n||s
                "msg":$i18n("js_calculation_js_39"),
                //运算符前后类型不同不能运算
                "state":false
            }
            // "j(d)+j(m)"
            // var jhArr = expString.match(/(j\([^j\)\+\-\*\/]+\))/gi);
            var jhArr = expString.match(/(j\([^j\)]+\))/gi);
            for(var i in jhArr){
                if(jhArr[i].match(/\[ds]/g)) return {
                    "msg":$i18n("js_calculation_js_19"),
                    "state":false
                }
            }
            // T1 ABS CEIL FLOOR
            var T1 = expString.match(/(T1\([^1\)]+\))/gi);
            for(var i in T1){
                if(!/T1\(\-?[nm]\)/gi.test(T1[i])) return {
                    "msg":$i18n("js_calculation_js_20"),
                    "state":false
                }
            }
            //T2 power LOG ROUND格式验证  
            var T2 = expString.match(/(T2\([^2\)]+\))/gi);
            for(var i in T2){
                if(!/T2\(\-?[nm],\-?[nm]\)/gi.test(T2[i])) return {
                    "msg":$i18n("js_calculation_js_21"),
                    "state":false
                }
            }
            // T3 SUBSTR('字符串','开始位置','截取长度')
            var T3 = expString.match(/(T3\([^3\)]+\))/gi);
            for(var i in T3){
                if(!/T3\([sd],\-?[nm](,\-?[nm])?\)/gi.test(T3[i])) return {
                    "msg":$i18n("js_calculation_js_22"),
                    "state":false
                }
            }
            // T4 REPLACE('字符串','子串','替换串')
            var T4 = expString.match(/(T4\([^4\)]+\))/gi);
            for(var i in T4){
                if(!/T4\([sd],[sd],[sd]\)/gi.test(T4[i])) return {
                    "msg":$i18n("js_calculation_js_23"),
                    "state":false
                }
            }
            // T5 LOWER UPPER  LOWER('字符串')
            var T5 = expString.match(/(T5\([^5\)]+\))/gi);
            for(var i in T5){
                if(!/T5\([sd]\)/gi.test(T5[i])) return {
                    "msg":$i18n("js_calculation_js_24"),
                    "state":false
                }
            }
            // T6 TRY_CAST TRY_CAST('表达式' AS INTEGER) DOUBLE
            var T6 = expString.match(/(T6\([^6\)]+\))/gi);
            for(var i in T6){
                if(!/T6\(-?[sdmn]ll\)/gi.test(T6[i])) return {
                    "msg":$i18n("js_calculation_js_25"),
                    "state":false
                }
            }
            
            // T7 LENGTH LENGTH('字符串')
            var T7 = expString.match(/(T7\([^T7\)]+\))/gi);
            for(var i in T7){
                if(!/T7\([sd]\)/gi.test(T7[i])) return {
                    "msg":$i18n("js_calculation_js_24"),
                    "state":false
                }
            }
            // X1 DATE_FORMAT(now(),'%Y-%m-%d')  FORMAT(now(),'%Y/%m/%d %T')
            // "X1(now(),%Y-%m-%d)+T7(now(),%Y/%m/%d %T)"
            var X8 = expString.match(/(X8\(now\(\)[^8\)]+\))/gi);
            for(var i in X8){
                if(!/X8\(now\(\),%Y[\-\/]%m[\-\/]%d(%T)?\)/gi.test(X8[i].replace(/\s/gi,""))) return {
                        "msg":$i18n("js_calculation_js_26"),
                        "state":false
                    }
            }
            //X2 DATA_PARSE('2017-02-14','%Y-%m-%d') DATE_PARSE('2017/02/14 18:30:15','%Y/%m/%d %T')
            // "X2(2017-02-14,%Y-%m-%d)+X8(2017/02/14 18:30:15,%Y/%m/%d %T)"
            var X9 = expString.match(/X9\([^9\)]+\)/gi);
            for(var i in X9){
                if(!/X9\(\d{4}[\/-]\d{2}[\/-]\d{2}(\d{2}:\d{2}:\d{2})?,%Y[\-\/]%m[\-\/]%d(%T)?\)/gi.test(X9[i].replace(/\s/gi,""))) return {
                    "msg":$i18n("js_calculation_js_27"),
                    "state":false
                }
            }
            // nullExp 取null,1,2)的结构验证  if(1 is null 1,2) 
            var nullExp = expString.match(/(u[^\)]+\))/gi);
            // "f(slu,s,n)"
            for(var i in nullExp){
                // if(!/.+[sd],[sd]/gi.test(nullExp[i]) && !/.+[mn],[mn]/gi.test(nullExp[i])) return {
                if(!/^u,[sd],[sd]\)$/gi.test(nullExp[i]) && !/^u,[mn],[mn]\)$/gi.test(nullExp[i]) && !/^u,b,b\)$/gi.test(nullExp[i])) return {
                    "msg":$i18n("js_calculation_js_38"),
                    // "msg":"(IF..IS NULL..)表达式错误!",
                    "state":false
                }
            }
            // var ifExpArr = expString.match(/l\([dmsn][\+\-\*\/><=!\|]+[msdn],[msdn],[msdn]\)/gi);
            var ifExpArr = expString.match(/f\([^\)f]+\)/gi);
            //取l(n=n,n,n) if(2>=4,1,2)
            for(var i in ifExpArr){
                if(!/f\([^,]+,[sd],[sd]\)/gi.test(ifExpArr[i]) && !/f\([^,]+,[mn],[mn]\)/gi.test(ifExpArr[i]) && !/f\([^,]+,b,b\)/gi.test(ifExpArr[i])) return {
                    "msg":$i18n("js_calculation_js_44"),
                    "state":false
                }
            }
            // expString.match(/(h[msdnlh]+g[msdn])/gi)
            var caseExp = expString.match(/(h[msdnlhb]+g[msdnb])/gi);
            //取 then .....else 1 中间  验证h后与g后是否一至["hslnhsgm", "hslnhsgm", "hslnhsgm"]
            // hslnhsgm
            for(var i in caseExp){
            //验证h g后边类型一至
                if(!/^(h[mn][^h]*)+g[mn]/gi.test(caseExp[i]) && !/^(h[sd][^h]*)+g[sd]/gi.test(caseExp[i]) && !/^(hb[^h]*)+gb/gi.test(caseExp[i])) return {
                    // "msg":$i18n("js_calculation_js_38"),
                    "msg":$i18n("js_calculation_js_41"),
                    "state":false
                }
            }
            // 目前任何运算符(case s when 1 then s会出问题)都不能混合字符和数字运算 注意字符与数字转换的公式 varchar double integer length 
            // dtypeString//将聚合函数替换//时间类型替换为S//数字类型替换成M
            // var calType = dtypeString.replace(/j\([^\)j]+\)/gi,"M").replace(/T\([^\)T]+\)/gi,"S").replace(/I\([^\)j]+\)/gi,"M");
            // if(/[mn]/gi.test(calType) && /[sd]/gi.test(calType)) return {
            //     "msg":"运算符前后类型不同不能运算",
            //     "state":false
            // }
            // 验证组合类型
            return validataResult;
        },
        replaceExp:function(str){
            var that = this;
            var n = "n";
            var s = "s";
            var x = "x";
            var b = "b";
            // 后端功能限制  时间当成字符处理
            var result = "";    
            // not  ---------  !
            var ysfReg = str.replace(/!\s*[msdnb]/gi,b)
                            // !false----  b  优先级高于运算符
                            .replace(/b\s*o\s*b/gi,b)
                            // and or
                            .replace(/[sd]\s*[\+\-\*\/]\s*[sd](\s*[\+\-\*\/]\s*[sd]\s*)*/gi,s) 
                            //运算符简化 s s 
                            .replace(/[nm]\s*[\+\-\*\/]\s*[nm](\s*[\+\-\*\/]\s*[nm]\s*)*/gi,n) 
                            //运算符简化 n n
                            .replace(/[sd]\s*\|\|\s*[sd](\s*\|\|\s*[sd]\s*)*/gi,s)
                            // s || s ||只能运算字符与字符 
                            .replace(/true/gi,b).replace(/false/gi,b)
                            .replace(/[nsdm]\s*[>=<]\s*[nsdm](\s*[>=<]\s*[nsdm]\s*)*/gi,b)
                            .replace(/[nsdm]\s*[><!]=\s*[nsdm](\s*[><!]=\s*[nsdm]\s*)*/gi,b)
                            // = > < >= <= !=
                            .replace(/\s/gi,"") 

            var newExp =  ysfReg.replace(/j\([mn]\)/gi,n) 
                                    //j(n)
                                   .replace(/T1\(\-?[nm]\)/gi,n) 
                                   // T1(n)
                                   .replace(/T2\(\-?[nm],\-?[nm]\)/gi,n) 
                                   //T2(n,n)
                                   .replace(/T3\([sd],\-?[nm](,\-?[nm])?\)/gi,s) 
                                   //T3(s,n,n) T3(s,n) 
                                   .replace(/T4\([sd],[sd],[sd]\)/gi,s) 
                                   //T4(s,s,s)
                                   .replace(/T5\([sd]\)/gi,s)      
                                   //T5(s)  
                                   .replace(/T6\(-?[sdmn]ll\)/gi,n) 
                                   // TRY_CAST TRY_CAST('表达式' AS INTEGER/DOULE)
                                   .replace(/T6\(-?[sdmn]lv\)/gi,s)
                                   // try_cast as varchar
                                   .replace(/T7\([sd]\)/gi,n) 
                                   //length  T7(s)
                                   .replace(/X8\(now\(\),%Y[\-\/]%m[\-\/]%d(%T)?\)/gi,s)
                                   .replace(/X9\(\d{4}[\/-]\d{2}[\/-]\d{2}(\d{2}:\d{2}:\d{2})?,%Y[\-\/]%m[\-\/]%d(%T)?\)/gi,s)
                                   .replace(/l[msdnb]l[msdnb](h[mn][^h]*)+g[mn]l/gi,n)  
                                   //case 返回n lmlnhslnhsgdl  lmlnsl
                                   .replace(/l[msdnb]l[msdnb](h[sd][^h]*)+g[sd]l/gi,s)  
                                   //case返回s 
                                   .replace(/l[msdnb]l[msdnb](hb[^h]*)+gbl/gi,b)  
                                   //case返回b
                                   // .replace(/f\([dmsn][\+\-\*\/><=!\|]+[msdn],[ds],[ds]\)/gi,s)
                                   .replace(/f\([dmsnb],[ds],[ds]\)/gi,s)
                                   //  if s 
                                   // .replace(/f\([dmsn][\+\-\*\/><=!\|]+[msdn],[mn],[mn]\)/gi,n)
                                   .replace(/f\([dmsnb],[mn],[mn]\)/gi,n)
                                   // if  n
                                   .replace(/f\([dmsnb],b,b\)/gi,b)
                                   // if  b
                                   .replace(/f\([dsmnb]lu,[ds],[ds]\)/gi,s)
                                   // "f(dlu,s,s)" if  is null   s
                                   .replace(/f\([dsnmb]lu,[nm],[nm]\)/gi,n)
                                   // "f(dlu,s,s)" if  is null   n
                                   .replace(/f\([dsnmb]lu,b,b\)/gi,b)
                                   // "f(dlu,s,s)" if  is null   b
                                   .replace(/\([sd]\)/gi,s)
                                   .replace(/\([mn]\)/gi,n)
                                   .replace(/\(b\)/gi,b);
                                    
            if(newExp == str){
                result = newExp
            }else{
                result = that.replaceExp(newExp)
            }
            return result
        },
        validatorName:function(name){
            //必验证  独立出来
            var validataResult = {
                "msg":"",
                "state":true
            };
            if(!name){
                validataResult.msg = $i18n("js_calculation_js_28");
                validataResult.state = false;
                return validataResult;
            }
            if (!/^([\u4e00-\u9fa5]+|[a-zA-Z0-9_]+)+$/.test(name)) {
                validataResult.msg = $i18n("js_calculation_js_29");
                validataResult.state = false;
                return validataResult;
            }
            if(name.length>50){
                validataResult.msg = $i18n("js_calculation_js_40");
                validataResult.state = false;
                return validataResult;
            }  
            var caption = $tagertR.data().caption();
            var currentEditCalName = $(".calName input").attr("currentEdit");
            //修改的时候才会有currentEditCalName
            for(var i in caption){
                //验证名称是否重复
                if(caption[i] == currentEditCalName) caption[i] = "";
                if(name == caption[i]){
                    validataResult.msg = $i18n("js_calculation_js_30");
                    validataResult.state = false;
                    return validataResult;
                }
            }
            return validataResult;
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
        modifiCalName:function(oldName,newName){
        //修改计算字段中注释名
            var calArr = $(".search-fitter", $tagertR).find("li.create-size").data().sizeData().look;
            $.each(calArr,function(){
                if(this.name == oldName){
                    this.name = newName;
                }
            }) 
        },
        getContentType:function(actualFormula){
        //获取 公式类型
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
        getDataType:function(actualFormula,$dom){
            //获取数据类型  预判断  $dom是类型选择
            // 根据函数判断 
            // 1、只有时间函数------------------timestamp
            // 2、只有返回mesure类型函数----------------integer
            // 3、无任何函数：只有时间维度---timestamp  只有度量和数字----integer
            // 4、其余所有情况（默认）-----------------varchar
            // dtype  S---字符 N数字  T时间表达式 try cast----E(检测是否有varchar)特殊表达式  I数字表达式 P字符表达式 J聚合表达式 
            // L逻辑关键字  D---dimension  M--mesure  运算符取本身
            // var that = this;
            // var string = "";
            // var logicStr = "";
            // var expWords = "";
            // $("#showArea span:not(.notFetch)").each(function(idx,item){
            //     if($(this).attr("dtype")){
            //         string += $(this).attr("dtype");
            //         //公式简化处理
            //     }
            //     if($(this).hasClass('logicKeyWords')){
            //         logicStr += $(this).text().toUpperCase()
            //     }
            //     if($(this).hasClass('expKeyWords')){
            //         expWords += $(this).text().toUpperCase();
            //     }
            // }) 

            // if($dom.attr("userCtrl") == "true"){
            //     if($dom.text() == $i18n("js_calculation_js_32")) return "integer";
            //     var isTime = string.replace(/T\(\(\),S\)/gi,"").replace(/T\(S,S\)/,"");
            //     if(!/[sneipjdm]/gi.test(isTime) && string){
            //     //只有时间函数
            //         console.log("timestamp")
            //         return "timestamp";
            //     }
            //     return "varchar"
            // }else{
            //     debugger
            //     // 判断是否是时间类型
            //     var isTime = string.replace(/T\(\(\),S\)/gi,"").replace(/T\(S,S\)/,"");
            //     if(!/[sneipjdm]/gi.test(isTime) && string){
            //     //只有时间函数
            //         console.log("timestamp")
            //         return "timestamp";
            //     }
            //     var notMesureExp = ["SUBSTR","UPPER","LOWER","DATE_FORMAT","DATE_PARSE","VARCHAR","REPLACE"];
            //     for(var i in notMesureExp){
            //         if(expWords.indexOf(notMesureExp[i]) != -1){
            //         //含有字符或时间函数
            //             console.log("varchar")
            //             return "varchar";
            //         }
            //     }

            //     // 判断是否是度量E(SLL)
            //     var dTypeStr =  string.replace(/I\([^\)I]+\)/gi,"").replace(/E\([^E\)]+\)/gi,"");
            //     if(!/[spd]/gi.test(dTypeStr) && logicStr.indexOf("VARCHAR") == -1 && string){
            //         console.log("integer")
            //         return "integer";
            //     }
            //     console.log("varchar")
            //     return "varchar";
            // }
            var that = this;
            var expString = "";
            var string = "";
            $("#showArea span:not(.notFetch)").each(function(idx,item){
                if($(this).attr("dataelse")){
                //为了验证null then else特殊化处理u h g
                    expString += $(this).attr("dataelse");
                    //公式简化处理
                }else if($(this).attr("etype")){
                    expString += $(this).attr("etype");
                    //公式简化处理
                }
                if($(this).attr("dtype")){
                    string += $(this).attr("dtype");
                    //公式简化处理
                }
            }) 
            expString = that.replaceExp(expString);
            var isTime = string.replace(/T\(\(\),S\)/gi,"").replace(/T\(S,S\)/gi,"");
            if($dom.attr("userCtrl") == "true"){
                if($dom.text() == $i18n("js_calculation_js_32")) return "integer";
                if(!/[sneipjdm]/gi.test(isTime) && string){
                    //只有时间函数
                    console.log("timestamp")
                    return "timestamp";
                }
                return "varchar"
            }else{
                if(!/[sneipjdm]/gi.test(isTime) && string){
                    //只有时间函数
                    console.log("timestamp")
                    return "timestamp";
                }
                if(!/[sdb]/gi.test(expString)){
                    console.log("integer")
                    return "integer";
                }                 
                console.log("varchar")
                return "varchar"
            }
        },
        showErrMsg:function(obj){
            if(obj.state){
                $("#showArea,#editArea").css("border-color","#cdd0e3");
                $("#errMsg").text("").attr("title","");
            }else{
                $("#showArea,#editArea").css("border-color","f00");
                $("#errMsg").text(obj.msg);
                $("#errMsg").attr("title",obj.msg);
            }
        },
        alertCalFn:function(option){
        //打开配置页面
            var _this = this;
            var cubeId = $tagertR.data().$openData() != "" ? $tagertR.data().$openData().cubeId : "";
            var $that = $(".search-fitter", $tagertR).find("li.create-size");
            var saveDat = [];
            var lookDat = [];
            if ($(".type1").find("div[darg]").length == 0) {
                dac.alert($i18n("js_calculation_js_33"));
                return;
            }
            $that.alert({
                title: $i18n("js_calculation_js_34"),
                url: "/alertHtml/alert-calculation.html",
                btnAlign: "center",
                data: option,
                onSubmit: function(form) {
                    var actualFormula = $("#editArea",form).val();
                    var formulaName = $(".calName input",form).val();
                    var lookDat = [];
                    var validatorName = _this.validatorName(formulaName);
                    if(!validatorName.state){
                        dac.alert(validatorName.msg);
                        return false;
                    }
                    var normalValidateResult = _this.checkJsgs(form,formulaName,actualFormula);
                    //验证失败是否交功能
                    _this.showErrMsg(normalValidateResult);
                    if(!normalValidateResult.state){
                        dac.confirm(normalValidateResult.msg + $i18n("js_calculation_js_35"),function(){
                            submitCal()
                        },function(){
                        })
                    }else{
                        submitCal()
                    }
                    function submitCal(){
                        var calFieldType = _this.getContentType(actualFormula);
                        var dataType = _this.getDataType(actualFormula,$("#dimensionOrmesure",form));
                        var dimensionOrMesure = "";
                        if($("#dimensionOrmesure").attr("userctrl")){
                            //用户选择了就以用户选择为准  没有选择，以预判断为准
                            dimensionOrMesure = $(".type").find(".toggleList span").text() == $i18n("js_calculation_js_36") ? "dimension" : "measure"; 
                        }else{
                            dimensionOrMesure = dataType == "integer" ? "measure" : "dimension";
                        }
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
                            $.each(modifiArr,function(idx){
                                //修改字段名
                                if(this.name == option.calName){
                                   $that.data().sizeData().look.splice(idx,1);
                                   return false
                                }
                            })
                        }
                        if ($that.data().sizeData && $that.data().sizeData() != "") {
                            lookDat = $that.data().sizeData().look.concat(lookDat);
                        }

                        //回显合并已有计算字段 //Arry[0].formula   $tagertR.data().$openData().calDimensionMeasures是模型上的计算字段
                        if($tagertR.data().$openData && $tagertR.data().$openData().calDimensionMeasures != undefined && $tagertR.data().$openData().calDimensionMeasures!=""){
                            var sizeList = $tagertR.data().$openData().calDimensionMeasures;
                            //编辑时删除旧字段
                            $.each(sizeList,function(idx){
                            //修改字段名
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
                                    'look': lookDat
                                };
                            }
                        });
                        form.parents(".alert-container").remove();
                        console.log($(".search-fitter", $tagertR).find("li.create-size").data().sizeData())
                        $tagertR.find(".search-table1").click();
                    }
                },
                callBack: function(d, e, form) {
                },
                htmlInit:function(){
                },
                onCancel:function(){
                },
                onClose:function(){
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
