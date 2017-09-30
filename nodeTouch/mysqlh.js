var mysql  = require('mysql');  //调用MySQL模块
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
// app.use(express.bodyParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extened:true}))
app.use(express.static('./'))
app.listen(8089)
// 连接mysql必须要安装此支持程序，坑啊
// npm install node-mysql
//创建一个connection
var connection = mysql.createConnection({    

    host:'10.0.6.230',       //主机
    user:'root',            //MySQL认证用户名
    password:'MYSQL',
    port:3306,
    database:'mysql'
});
// //创建一个connection
connection.connect(function(err){

    if(err){       
        console.log('[query] - :'+err);

        return;

    }

    console.log('[connection connect]  succeed!');

}); 

// connection.query('SELECT * FROM tjh.calTest', function(err, rows, fields) {
//     // if (err) throw err;
//     console.log('The solution is: ', JSON.stringify(rows));
// });
// //关闭连接
// // connection.end();
// app.get("/getNameJson",function(req,res){

// })
app.post("/sql",function(req,res){
    var sql = req.body.sqlVal ? req.body.sqlVal : "";
    connection.query(sql,function(err,rows,fields){
        if(err) throw err
        var cols = [];
        for(var i = 0 ; i < fields.length ; i ++){
            cols.push(fields[i].name);
        }
        for(var i = 0 , data = []; i < rows.length ; i ++){
            
            var l = [];
            for(var j in rows[i]){
               l.push(rows[i][j])
            }
            data[i] = l;
        }
        var result = {
            cols:cols,
            data:data
        }
        res.header("Content-Type", "application/json");
        res.end(JSON.stringify(result))
    })
})
