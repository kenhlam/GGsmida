module.exports = function(){
	var tool = null;
	tool.fileName = "mytool";
	tool.vison = "v1.0.0";
	tool.alert = function(str){
		alert(str)
	}
}

// function Hello() { 
// 	var name; 
// 	this.setName = function(thyName) { 
// 		name = thyName; 
// 	}; 
// 	this.sayHello = function() { 
// 		console.log('Hello ' + name); 
// 	}; 
// }; 
// module.exports = Hello;