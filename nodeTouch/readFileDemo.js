var fs = require("fs")
var data = fs.readFileSync("x.txt");//同步，不允许有回调

fs.readFile("x.txt",function(err,data){
	if(err) return console.error(err); 
	console.log(data.toString());
});
