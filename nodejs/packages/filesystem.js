var fs = require('fs');
var path = require("path");

this.fileContent = function(filePath){
	return fs.readFileSync(filePath, "utf8");
}
this.fileContentBytes = function(filePath){
	var buffer = fs.readFileSync(filePath);
	var byteArray = [];
	for(var i = 0; i < buffer.length; i++){
		byteArray.push({value:buffer[i]});
	}
	return byteArray;
}
function fileContentRaw(filePath){
	return fs.readFileSync(filePath);
}
function fileContentAsync(callback, filePath){
	fs.readFile(filePath, "utf8", callback);
}
this.folderContent = function(filePath){
	return fs.readdirSync(filePath).map(name => path.join(filePath, name))
}
function folderContentAsync(callback, filePath){
	fs.readdir(filePath, callback)
}
this.fileWrite = function(filePath, data){
	fs.writeFileSync(filePath, data);
}
this.fileCreateFolder = function(folderPath){
	!fs.existsSync(folderPath) && fs.mkdirSync(folderPath);
}

GLang.defaultRuntimeEnvironment.setInnerVariable("fileContentRaw", {value:GLang.arrayFun(function(env, args){
	return {value:fileContentRaw(args[0].value)};
}), display:"function"});
GLang.defaultRuntimeEnvironment.setInnerVariable("fileContentAsync", {value:GLang.arrayFun(function(env, args){
	function fileContentCallback(content){
		GLang.callObject(args[0], env, [content])
	}
	
	fileContentAsync(function(err, data){
		if(err){
			fileContentCallback({value:0});
		}else{
			fileContentCallback(GLang.stringValue(data));
		}
	}, args[1].value);
	
	return {value:0, display:"none"}
}), display:"function"});
GLang.defaultRuntimeEnvironment.setInnerVariable("folderContentAsync", {value:GLang.arrayFun(function(env, args){
	function folderContentCallback(content){
		GLang.callObject(args[0], env, [content])
	}
	
	folderContentAsync(function(err, data){
		if(err){
			folderContentCallback({value:[]});
		}else{
			folderContentCallback({value:data.map(name => GLang.stringValue(path.join(args[1].value, name)))});
		}
	}, args[1].value);
	
	return {value:0, display:"none"}
}), display:"function"});

this.fileExists = function(filePath){
	return fs.existsSync(filePath);
}
this.fileIsFolder = function(filePath){
	try{
		return fs.lstatSync(filePath).isDirectory();
	}catch(e){
		return false;
	}
}
this.fileIsFile = function(filePath){
	try{
		return fs.lstatSync(filePath).isFile();
	}catch(e){
		return false;
	}
}