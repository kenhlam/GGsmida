// var express = require('express');
// var app = express();
 
// app.use(express.static('public'));
 
// app.get('/index.htm', function (req, res) {
//    // res.send("aa");
//    res.sendFile( __dirname + "/" + "index.html" );
// })
 
// app.get('/process_get', function (req, res) {
 
//    // 输出 JSON 格式
//    var response = {
//        "first_name":req.query.first_name,
//        "last_name":req.query.last_name
//    };
//    console.log(response);
//    res.end(JSON.stringify(response));
// })
 
// var server = app.listen(8081)
// var express = require('express');
// var app = express();
 
// app.get('/', function (req, res) {
//    res.send('Hello World');
// })
 
// var server = app.listen(8081)
var express = require("express");
var app = express();
var hostName = '127.0.0.1';
var port = 8081;
app.use(express.static('./'))
// app.all('*', function(req, res, next) {  
//     res.header("Access-Control-Allow-Origin", "*");  
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");  
//     res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
//     res.header("X-Powered-By",' 3.2.1')  
//     // res.header("Content-Type", "application/json;charset=utf-8");  
//     next();  
// });
app.get("/get",function(req,res){
    res.header("Content-Type", "application/json;charset=utf-8"); 
    res.end(JSON.stringify({name:"123"}))
})
app.get("/getpic",function(req,res){
    // res.header("Content-Type", "application/octet-stream");
    res.header("Content-Type", "attachment");
    // res.header("Content-Type", "image/jpeg;charset=utf-8");
    // res.sendFile( __dirname + "/" + "bananar.jpg" );  
    // res.download('/report-12345.pdf', 'report.pdf');
    // res.download(path, [,filename], [,fn])
    // res.download(__dirname + "/bananar.jpg" )
    res.download("./x.txt" )
})
app.listen(port);