define(['jquery','cube','mune'], function($,cube,page) {
    var sizeCont = {
    	init:function(){
            this.clickBtn();
    	},
        // 计算字段公式 验证方法 
        checkJsgs: function($dom) {
            //验证普通情况
            var result = {
                "msg":"",
                "state":true
            }
            var string = ""; 
            $("#showArea span:not(.notFetch)",$dom).each(function(idx,item){
                if($(this).hasClass('ysf')){
                    string += $(this).text()
                }else if($(this).hasClass('keyWords')){
                    string += "k"
                }else{
                    string += "a"
                }
            }) 
            // 剔除空白符  
            string = string.replace(/\s/g, '');
            // 错误情况，空字符串  
            if ("" === string) {
                result = {
                    "msg":"表达式不能为空",
                    "state":false
                }
                return result;
            }
            // 错误情况，运算符连续 ,关键字不能连续 
            if (/[\+\-\*\/k]{2,}/.test(string)) {
                result = {
                    "msg":"运算符或关键字不能连续",
                    "state":false
                }
                return result;
            }
            // 错误情况，运算符结束  
            if (/[\+\-\*\/]/.test(string.substr(string.length - 1, 1))) {
                result = {
                    "msg":"不能以运算符结束",
                    "state":false
                }
                return result;
            }
            // 错误情况，运算符*/开头  
            if (/[\+\-\*\/]/.test(string.substr(0, 1))) {
                result = {
                    "msg":"不能以运算符开头",
                    "state":false
                }
                return result;
            }
            // 错误情况,变量连续  
            if (/[\a]{2,}/.test(string)) {
                result = {
                    "msg":"变量不能连续",
                    "state":false
                }
                return result;
            }
            // 空括号  
            if (string.indexOf("()") != -1) {
                result = {
                    "msg":"()不能为空",
                    "state":false
                }
                return result;
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
                        result = {
                            "msg":"()不配对",
                            "state":false
                        }
                        return result;
                    }
                }
            }
            if (0 !== stack.length) {
                result = {
                    "msg":"()不配对",
                    "state":false
                }
                return result;
            }
            // 错误情况，(后面是运算符   
            if (/\([\+\-\*\/]/.test(string)) {
                result = {
                    "msg":"(后面不能是运算符",
                    "state":false
                }
                return result;
            }
            // 错误情况，)前面是运算符  
            if (/[\+\-\*\/]\)/.test(string)) {
                result = {
                    "msg":")前面不能是运算符",
                    "state":false
                }
                return result;
            }
            // 错误情况，(前面不是运算符  
            if (/[^\+\-\*\/]\(/.test(string)) {
                result = {
                    "msg":"(前面不是运算符",
                    "state":false
                }
                return result;
            }
            // 错误情况，)后面不是运算符  
            if (/\)[^\+\-\*\/]/.test(string)) {
                result = {
                    "msg":")后面不是运算符 ",
                    "state":false
                }
                return result;
            }
            return result;
        },
        validator:function(name,exp){//验证特殊情况 深度验证
            debugger
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
            if(!exp){
                validataResult.msg = "表达式不能为空!";
                validataResult.state = false;
                return validataResult
            } 
            var columnsData =  $tagertR.data().dimensions ? $tagertR.data().dimensions().columns : [];
            var columnsInExp = exp.match(/\[(.+?)\]/g);//匹配出[]
            for(var i in columnsData){
                //验证名称是否重复
                if(name == columnsData[i].name){
                    validataResult.msg = "名称已存在，请修改！!";
                    validataResult.state = false;
                    return validataResult;
                }
            }
            //验证[是否在colunms中有]
            var columnsFlag = "pass";
            for(var i in columnsInExp){
                for(var j in columnsData){
                    if("[" +columnsData[j].name + "]" == columnsInExp[i]){
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
            //验证[是否在colunms中有]  end

            // 验证str是否有引号
            $("#showArea .str").each(function(){
                if(!/^'[^'"]+'$/.test($(this).text())){
                    validataResult.msg = "字符要用''引起来!";
                    validataResult.state = false;
                    return validataResult;
                }
            })
            // 关键字验证 普通验证中验了keyWords + 值 + keyWords + 值
            // IF 条件 THEN 返回值1 ELSE 返回值2
            // CASE 表达式 WHEN 值1 THEN 返回值1 WHEN 值2 THEN 返回值2 ELSE 默认返回值
            var keyWordsArr = [];
            $("#showArea .keyWords").each(function(){
                keyWordsArr.push($(this).text().toLowerCase());
            });
            var keyWordsStr = keyWordsArr.join("").toLowerCase();
            if(keyWordsStr.indexOf("if") != -1 && keyWordsStr.indexOf("ifthen") == -1){
                validataResult.msg = "if后必须要有then...";
                validataResult.state = false;
                return validataResult;
            }
            if(keyWordsStr.indexOf("case") != -1 && keyWordsStr.indexOf("casewhenthen") == -1){
                validataResult.msg = "case后必须要有when...then...";
                validataResult.state = false;
                return validataResult;
            }
            //扩展  对于不同公式的验证 取对应class上的值单独验证  每种公式对应一种验证方法 

            return validataResult;
        },
        changeToRealFormula:function(formula){
            var columnsData =  $tagertR.data().dimensions ? $tagertR.data().dimensions().columns : [];
            var columnsInExp = formula.match(/\[(.+?)\]/g);//匹配出[]
            debugger
            console.log(columnsInExp)
            for(var i in columnsInExp){
                for(var j in columnsData){
                    if("[" +columnsData[j].name + "]" == columnsInExp[i]){
                        
                    }
                }
            }
            
        },
    	clickBtn:function(){
    		var _this = this;
		    /* 创建计算配置点击事件 */
            $(".search-fitter", $tagertR).find("li.create-size").off("click").on("click", function() {
                var dataJSon;
                var cubeId = $tagertR.data().$openData() != "" ? $tagertR.data().$openData().cubeId : "";
                var $that = $(this);
                dataJSon = {
                    page: "create",
                    haha:"edit"//模拟编辑
                };
                var saveDat = [];
                var lookDat = [];
                if ($(".type1").find("div[darg]").length == 0) {
                    dac.alert("没有表间关系不能添加计算字段!");
                    return;
                }
                $(this).alert({
                    title: "新建计算字段",
                    url: "/alertHtml/alert-calculation.html",
                    btnAlign: "center",
                    data: dataJSon,
                    // submitAction:$$("/measureAndDimension/createCalculateMeasure.json"),
                    onSubmit: function(form) {
                        // alert("submitAction")
                        var actualFormula = $("#editArea",form).val();
                        var formulaName = $(".calName input",form).val();
                        var lookDat = [];
                        _this.changeToRealFormula(actualFormula)
                        // 验证格式的合法性
                        var normalValidateResult = _this.checkJsgs(form);
                        // if(!normalValidateResult) return false;
                        console.log(normalValidateResult.state)
                        console.log(normalValidateResult.msg)
                        // 深度验证 验证每个公式内部的合法性
                        var deepValidataResult = _this.validator(formulaName,actualFormula);
                        console.log(deepValidataResult)
                        if(!deepValidataResult.state){
                            dac.alert(deepValidataResult.msg)
                            return false;
                        } 
                        //测试验证 阻止关闭保存
                        // return false;
                        // 数据保存思路   realFormula从div取，取时检测替换列名或验证时加上
                        // 外部修改列时，修改配置中的列名
                        lookDat.push({
                            name: formulaName,
                            formula: actualFormula,
                            // realFormula:
                            visible: "1"
                            //cacluateSchema:
                        });
                        // 累加合并已有计算字段
                        if ($that.data().sizeData && $that.data().sizeData() != "") {
                            //saveDat 可否删除  暂未发现使用处
                            try{saveDat = $that.data().sizeData().save.concat(saveDat)}catch(e){saveDat = []}
                            lookDat = $that.data().sizeData().look.concat(lookDat);
                        }
                        //回显合并已有计算字段 //Arry[0].formula   $tagertR.data().$openData().calDimensionMeasures是模型上的计算字段
                        if($tagertR.data().$openData && $tagertR.data().$openData().calDimensionMeasures != undefined && $tagertR.data().$openData().calDimensionMeasures!=""){
                            var sizeList = $tagertR.data().$openData().calDimensionMeasures;
                            for(var i in sizeList){
                                var sizeFlag = true;
                                for(var j in lookDat){
                                    if(sizeList[i].formula == lookDat[j].formula){
                                        sizeFlag = false;
                                    }
                                }
                                if(sizeFlag) lookDat.push({
                                    name: sizeList[i].name,
                                    formula: sizeList[i].formula,
                                    visible: sizeList[i].visible
                                })
                            }
                        }
                        $that.data({
                            sizeData: function() {
                                return {
                                    'save': saveDat,
                                    'look': lookDat
                                };
                            }
                        });
                        form.parents(".alert-container").remove();
                        // $(".validator-msg").hide()
                        // $tagertR.find(".search-table1").click();




                        return false;




                        // 以下是老代码不用的
                        var actualFormula = form.find("#actualFormula").val().replace(/(TRY_CAST\(|AS \$REAL\$\))/gi,''),
                        //var actualFormula = form.find("#actualFormula").val(),
                            value = "";
                        if (actualFormula == "") {
                            dac.alert("计算公式不能为空");
                            return false;
                        }
                        //actualFormula = actualFormula.split("#$#");
                        var obj = "";
                        var creatName = form.find("#columnsAlias").val();
                        var columnsData =  $tagertR.data().dimensions ? $tagertR.data().dimensions().columns : [];
                        for(var i in columnsData){
                            if(creatName == columnsData[i].name){
                                dac.alert("名称已存在，请修改！");
                                return false;
                            }
                        }
                        // for (var i = 1; i < actualFormula.length; i++) {
                        //     if (actualFormula[i].indexOf(".") > 0) {
                        //         value += "a";
                        //         obj += "" + i;
                        //     } else {
                        //         value += actualFormula[i];
                        //     }
                        // }
                        $("#jsgs .c-text1").each(function(idx,item){
                            if($(this).parent().hasClass('ysf')){
                                value += $(this).text()
                            }else{
                                value += "a"
                            }
                        })  
                        //value = actualFormula.join("");
                        if (_this.checkJsgs(value, obj) == false || form.find("span.c-text").length < 2) {
                            dac.alert("计算公式有误");
                            return false;
                        } else {
                            saveDat.push({
                                name: form.find("input[name=caption]").val(),
                                formula: form.find("#actualFormula").val(),
                                measureType: 2,
                                alias: form.find("input[name=caption]").val()
                            });
                            lookDat.push({
                                name: form.find("input[name=caption]").val(),
                                formula: form.find("#actualFormula").val(),
                                visible: "1"
                                //cacluateSchema:

                            });
                            // 累加合并已有计算字段
                            if ($that.data().sizeData && $that.data().sizeData() != "") {
                                //saveDat 可否删除  暂未发现使用处
                                try{saveDat = $that.data().sizeData().save.concat(saveDat)}catch(e){saveDat = []}
                                lookDat = $that.data().sizeData().look.concat(lookDat);
                            }
                            //回显合并已有计算字段 //Arry[0].formula   $tagertR.data().$openData().calDimensionMeasures是模型上的计算字段
                            if($tagertR.data().$openData && $tagertR.data().$openData().calDimensionMeasures != undefined && $tagertR.data().$openData().calDimensionMeasures!=""){
                                var sizeList = $tagertR.data().$openData().calDimensionMeasures;
                                for(var i in sizeList){
                                    var sizeFlag = true;
                                    for(var j in lookDat){
                                        if(sizeList[i].formula == lookDat[j].formula){
                                            sizeFlag = false;
                                        }
                                    }
                                    if(sizeFlag) lookDat.push({
                                        name: sizeList[i].name,
                                        formula: sizeList[i].formula,
                                        visible: sizeList[i].visible
                                    })
                                }
                            }
                            $that.data({
                                sizeData: function() {
                                    return {
                                        'save': saveDat,
                                        'look': lookDat
                                    };
                                }
                            });
                            form.parents(".alert-container").remove();
                            // $(".validator-msg").hide()
                            $tagertR.find(".search-table1").click();
                            return false;
                        }
                    },
                    callBack: function(d, e, form) {//关闭后执行？
                        // form.parents(".alert-container").remove();
                        // // $(".validator-msg").hide()
                        // $tagertR.find(".search-table1").click();
                    },
                    onCancel:function(){
                        // $(".validator-msg").hide() 
                    },
                    onClose:function(){
                        // $(".validator-msg").hide() 
                    }
                });
            });
    	},
        //  修改计算字段
        editJszd:function(){
            // $tagert.find("table.table-thead").find(".area").find("span.jsdl").off("click").on("click",function(){
                //  $(this).alert({
                //         title:"修改计算配置",
                //            url:"/alertHtml/alert-size.html",
                //            btnAlign : "center",
                //            data:{
                //              page:"update",
                //              data:$dataList.data().getPageData(),
                //              id: $(this).parent().parent().attr("data-id")
                //            },
                //            submitAction:$$("/measureAndDimension/updateCalculateMeasure.json"),
                //            onSubmit:function(form){

                //              var actualFormula=form.find("#actualFormula").val(),value="";
                //              if(actualFormula==""){
                //                  dac.alert("计算公式不能为空");
                //                  return false;
                //              };
                //              actualFormula=actualFormula.split("#$#");
                //              var obj="";
                //              for(var i=1;i<actualFormula.length;i++){
                //              if(actualFormula[i].indexOf(".")>0){
                //                  value+="a";
                //                  obj+=""+i;
                //              }else{
                //                  value+=actualFormula[i];
                //              }
                //          }

                //             if(self.prototype.checkJsgs(value,obj)==false){
                //              dac.alert("计算公式有误");
                //              return false;
                //             }else{
                //              return true;
                //             }

                //            },
                //            callBack:function(d,e,form){
                //             if(d.data.returnCode=="20000"){
                //                 if(d.data.result==true){
                //                    form.parents(".alert-container").remove();
                //                       dac.alert("修改成功!");
                //                       $tagert.find(".search-table1").click();
                //                 }

                //                  }else{
                //                       dac.alert("修改失败!");
                //                  }
                //            }

                //        });
                // });
        }
    };
    return sizeCont;
});