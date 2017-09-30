var http = require('http');
var express = require("express");
var fs = require("fs");
var tool = require("./mytool");
var data = fs.readFile("x.txt",function(err,data){//同步请求
	if(err) return console.error(err) 
	// console.log(data.toString())
	http.createServer(function (request, response) {

		// 发送 HTTP 头部 
		// HTTP 状态值: 200 : OK
		// 内容类型: text/plain
		response.writeHead(200, {'Content-Type': 'text/html'});

		// 发送响应数据 "Hello World"
		response.end("mydata:"+data);
	}).listen(8888);
})


// 终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');