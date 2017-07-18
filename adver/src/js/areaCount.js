/* 已在配置文件里全局加载jquery */
require('../css/normalize.css');
require('../css/index.css');
require('../css/laypage.css');
require('../../node_modules/ztree/css/zTreeStyle/zTreeStyle.css');

const url = require('./config');
//加载分页插件
const laypage = require("laypage");
//加载ztree
$.fn.zTree = require("ztree");
// //加载区县
// $.ajax({
//     url: url + "/queryarea.json",
//     success: function(d) {
//         let html = '',
//             area = d.data['北京市'];
//         for (let i = 0; i < area.length; i++) {
//             html += '<option value=' + (i + 1) + '>' + area[i] + '</option>'
//         }
//         $('#area').append(html);
//     }
// });
//加载日期
function getData(num){
    var num1 = num ? num : 0
    $.ajax({
        url: url + "/querydatetype.json",
        data:{
            time:num1
        },
        success: function(d) {
            let html = '',
                timeObj = d.data;
            for (var i in timeObj) {
                html += '<option>' + timeObj[i] + '</option>'
            }
            $('#area').append(html);
        }
    });
};
getData();
//改变日期
$("#time").on("change",function(){
    var num  = $(this).val();
    $('#area').html('');
    getData(num);
})
//加载媒体类型
$.ajax({
    url: url + "/queryMediaType.json",
    success: function(d) {
        let html = '',
            media = d.data;
        for (let i = 0; i < media.length; i++) {
            html += '<div class="selectedVals"><input type="checkbox" value="'+ media[i] +'"><span>'+ media[i] +'</span></div>'
        }
        $('#mediaType').append(html);
    }
});


//加载违法情况
$.ajax({
    url: url + "/querylawlessLevel.json",
    success: function(d) {
        let html = '',
            law = d.data;
        for (let i = 0; i < law.length; i++) {
            html += '<div class="selectedVals"><input type="checkbox" value="'+ law[i] +'"><span>'+ law[i]  +'</span></div>'
        }
        $('#law').append(html);
    }
});

//加载监管单位
let jgdw = [];
$.ajax({
    url: url + "/queryunit.json",
    success: function(d) {
        var setting = {
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onCheck: onCheck
            }
        };

        let zNodes = [],
            data = d.data;

        function onCheck(e, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj("treeJgdw"),
                nodes = treeObj.getCheckedNodes(true),
                v = "";
            jgdw.length = 0; //清空数据
            for (var i = 0; i < nodes.length; i++) {
                v += nodes[i].name + ",";
                //alert(nodes[i].name); //获取选中节点的值
                jgdw.push(nodes[i].name);
                /*if(i){
                    adver.push(nodes[i].name);    
                }*/
            }
        }

        for (let i in data) {
            for (let j = 1; j < data[i].data.length + 1; j++) {
                if (j === 1) {
                    zNodes.push({
                        id: i,
                        pId: i,
                        name: data[i].name
                    }, {
                        id: j + '-1',
                        pId: i,
                        name: data[i].data[j - 1]
                    })
                } else {
                    zNodes.push({
                        id: j + '-1',
                        pId: i,
                        name: data[i].data[j - 1]
                    })
                }
            }
        }

        $.fn.zTree.init($("#treeJgdw"), setting, zNodes);
    }
});



//加载监测单位
let jcdw = [];
$.ajax({
    url: url + "/queryunit.json",
    success: function(d) {
        var setting = {
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onCheck: onCheck
            }
        };

        let zNodes = [],
            data = d.data;

        function onCheck(e, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj("treeJcdw"),
                nodes = treeObj.getCheckedNodes(true),
                v = "";
            jcdw.length = 0; //清空数据
            for (var i = 0; i < nodes.length; i++) {
                v += nodes[i].name + ",";
                //alert(nodes[i].name); //获取选中节点的值
                jcdw.push(nodes[i].name);
                /*if(i){
                    adver.push(nodes[i].name);    
                }*/
            }
        }

        for (let i in data) {
            for (let j = 1; j < data[i].data.length + 1; j++) {
                if (j === 1) {
                    zNodes.push({
                        id: i,
                        pId: i,
                        name: data[i].name
                    }, {
                        id: j + '-1',
                        pId: i,
                        name: data[i].data[j - 1]
                    })
                } else {
                    zNodes.push({
                        id: j + '-1',
                        pId: i,
                        name: data[i].data[j - 1]
                    })
                }
            }
        }

        $.fn.zTree.init($("#treeJcdw"), setting, zNodes);
    }
});



//加载广告类型
let adver = [];
$.ajax({
    url: url + "/queryadclass.json",
    success: function(d) {
        var setting = {
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onCheck: onCheck
            }
        };

        let zNodes = [],
            data = d.data;

        function onCheck(e, treeId, treeNode) {
            var treeObj = $.fn.zTree.getZTreeObj("treeAdver"),
                nodes = treeObj.getCheckedNodes(true),
                v = "";
            adver.length = 0; //清空数据
            for (var i = 0; i < nodes.length; i++) {
                v += nodes[i].name + ",";
                adver.push(nodes[i].name);
            }
        }

        for (let i in data) {
            for (let j = 1; j < data[i].data.length + 1; j++) {
                if (j === 1) {
                    zNodes.push({
                        id: i,
                        pId: i,
                        name: data[i].name
                    }, {
                        id: j + '-1',
                        pId: i,
                        name: data[i].data[j - 1]
                    })
                } else {
                    zNodes.push({
                        id: j + '-1',
                        pId: i,
                        name: data[i].data[j - 1]
                    })
                }
            }
        }

        $.fn.zTree.init($("#treeAdver"), setting, zNodes);
    }
});

//查询
$('#query').on('click', function() {

    var mediaType = [], law = [];
    function featchVal(id){
        var dom = $("#" + id).find('input:checked')
        var result = [];
        dom.each(function(){
            result.push($(this).val())
        })
        return result
    }
    mediaType = featchVal('mediaType');
    law = featchVal('law');
    $.ajax({
        url: url + "/queryData.json",
        data: {
            name: 1,
            keyword: $.trim($('#keyword').val()),
            time: $("#time").find("option:selected").val(),
            begin: 0, //开始
            end: null, //传数字n代表请求前n条数据，传null表示所有数据
            beginTime: $('#start').val(), //开始时间
            endTime: $('#end').val(), //结束时间
            fmediatype: mediaType.join(","), //媒体类型
            flawlesslevel: law.join(","), //违法情况
            fadclass: adver.join(',') ,//广告类别
            jcdw: jcdw.join(','), //监测单位
            jgdw: jgdw.join(',') //监管单位
        },
        beforeSend: function() {
            $('#loading').show();
            $('#data').css('min-height', '600px');
        },
        success: function(d) {
            $('#loading').hide();
            $('#data').css('min-height', 'auto');
            var data = d.data.list;
            var nums = 30; //每页出现的数量
            var thisDate = function(curr) {
                //此处只是演示，实际场景通常是返回已经当前页已经分组好的数据
                var last = curr * nums - 1;
                var str = '\
                    <table class="tab" id="tab">\
                        <thead>\
                            <tr>\
                                <th>行号</th>\
                                <th>地区名称</th>\
                                <th>时间</th>\
                                <th>广告次数</th>\
                                <th>次数占比</th>\
                                <th>同期广告次数</th>\
                                <th>同期增长</th>\
                                <th>同期增长率</th>\
                                <th>上期广告次数</th>\
                                <th>环比增长</th>\
                                <th>环比增长率</th>\
                                <th>广告时长</th>\
                                <th>时长占比</th>\
                                <th>同期广告时长</th>\
                                <th>同比增长</th>\
                                <th>同比增长率</th>\
                                <th>上期广告时长</th>\
                                <th>环比增长</th>\
                                <th>环比增长率</th>\
                                <th>广告金额</th>\
                                <th>金额占比</th>\
                                <th>同期广告金额</th>\
                                <th>同期增长</th>\
                                <th>同期增长率</th>\
                                <th>上期广告金额</th>\
                                <th>环比增长</th>\
                                <th>环比增长率</th>\
                            </tr>\
                        </thead>\
                        <tbody>';
                last = last >= data.length ? (data.length - 1) : last;
                for (var i = (curr * nums - nums); i <= last; i++) {
                    str += '<tr>\
                        <td>' + (i + 1) + '</td>\
                        <td>' + data[i].name + '</td>\
                        <td>' + data[i].date + '</td>\
                        <td>' + data[i].times + '</td>\
                        <td>' + (data[i].pertimes) / 1000000 + '%</td>\
                        <td>' + data[i].uptimes + ' </td>\
                        <td>' + data[i].uptimesincrease + '</td>\
                        <td>' + (data[i].peruptimesincrease) / 1000000 + '%</td>\
                        <td>' + data[i].lasttimes + '</td>\
                        <td>' + data[i].lasttimesincrease + '</td>\
                        <td>' + (data[i].perlasttimesincrease) / 1000000 + '%</td>\
                        <td>' + data[i].usetime + '</td>\
                        <td>' + (data[i].perusetime) / 1000000 + '%</td>\
                        <td>' + data[i].upusetime + '</td>\
                        <td>' + data[i].upusetimeincrease + '</td>\
                        <td>' + (data[i].perupusetimeincrease) / 1000000 + '%</td>\
                        <td>' + data[i].lastusetime + '</td>\
                        <td>' + data[i].lastusetimeincrease + '</td>\
                        <td>' + (data[i].perlastusetimeincrease) / 1000000 + '%</td>\
                        <td>' + data[i].money + '</td>\
                        <td>' + (data[i].permoney) / 1000000 + '%</td>\
                        <td>' + data[i].upmoney + '</td>\
                        <td>' + data[i].upmoneyincrease + '</td>\
                        <td>' + (data[i].perupmoneyincrease) / 1000000 + '%</td>\
                        <td>' + data[i].lastmoney + '</td>\
                        <td>' + data[i].lastmoneyincrease + '</td>\
                        <td>' + (data[i].perlastmoneyincrease) / 1000000 + '%</td>\
                    </tr>';
                }
                str += '</tbody></table>';
                return str;
            };

            laypage({
                cont: 'page',
                pages: Math.ceil(data.length / nums), //得到总页数
                jump: function(obj) {
                    $('#data').html(thisDate(obj.curr));
                }
            });
        }
    })
});