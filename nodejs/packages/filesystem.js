var fs = require('fs');
var path = require("path");

this.fileContent = function(filePath){
	try{
		return fs.readFileSync(filePath, "utf8");
	}catch(e){
		return null;
	}
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
	var array = fs.readdirSync(filePath);
	var result = [];
	for(var i = 0; i < array.length; i++){
		result.push(path.join(filePath, array[i]));
	}
	return result;
}
function folderContentAsync(callback, filePath){
	fs.readdir(filePath, callback)
}
this.fileWrite = function(filePath, data){
	try{
		fs.writeFileSync(filePath, data);	
	}catch(e){
		console.log("WARNING: writing to file " + filePath + " failed!");
		console.log(e);	
	}
}
this.fileCreateFolder = function(folderPath){
	console.log("File system: creating folder " + folderPath);
	!fs.existsSync(folderPath) && fs.mkdirSync(folderPath, {recursive: true});
}
this.fileDelete = function(filePath){
	fs.existsSync(filePath) && fs.unlinkSync(filePath);
}
this.fileDeleteFolder = function(filePath){
	fs.existsSync(filePath) && fs.rmdirSync(filePath);
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
			var dataCopy = [];
			for(var i = 0; i < data.length; i++) {
				dataCopy.push(GLang.stringValue(
					path.join(args[1].value + "", data[i])
				));
			}
			
			folderContentCallback({
				value:dataCopy
			});
		}
	}, args[1].value);
	
	return {value:0, display:"none"}
}), display:"function"});

this.fileExists = function(filePath){
	return fs.existsSync(filePath);
}
/* Returns if a file is a folder, not a file with contents nor a symbolic link pointing to a folder */
this.fileIsFolderNotLink = function(filePath){
	try{
		return fs.lstatSync(filePath).isDirectory();
	}catch(e){
		return false;
	}
}
this.fileIsFolder = function(filePath){
	try{
		return fs.lstatSync(fs.realpathSync(filePath)).isDirectory();
	}catch(e){
		return false;
	}
}
this.fileRealpath = function(filePath){
	return fs.realpathSync(filePath);
}
this.fileRenameFile = function(oldPath, newPath){
	if (fs.existsSync(oldPath)) {
		fs.renameSync(oldPath, newPath);
	}
}
this.fileIsFile = function(filePath){
	try{
		return fs.lstatSync(fs.realpathSync(filePath)).isFile();
	}catch(e){
		return false;
	}
}
/* Returns if a file is a file, not a folder nor a symbolic link pointing to a file */
this.fileIsFileNotLink = function(filePath){
	try{
		return fs.lstatSync(filePath).isFile();
	}catch(e){
		return false;
	}
}