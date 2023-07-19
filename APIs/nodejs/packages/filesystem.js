var fs = require('fs');
var path = require("path");

this.file_content = function(filePath){
	try{
		return fs.readFileSync(filePath, "utf8");
	}catch(e){
		return null;
	}
}
this.file_content_bytes = function(filePath){
	var buffer = fs.readFileSync(filePath);
	var byteArray = [];
	for(var i = 0; i < buffer.length; i++){
		byteArray.push({value:buffer[i]});
	}
	return byteArray;
}
function file_content_raw(filePath){
	return fs.readFileSync(filePath);
}
function fileContentAsync(callback, filePath){
	fs.readFile(filePath, "utf8", callback);
}
this.folder_content = function(filePath){
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
this.file_write = function(filePath, data){
	try{
		fs.writeFileSync(filePath, data);	
	}catch(e){
		console.log("WARNING: writing to file " + filePath + " failed!");
		console.log(e);	
	}
}
this.file_create_folder = function(folderPath){
	!fs.existsSync(folderPath) && fs.mkdirSync(folderPath, {recursive: true});
}
this.file_delete = function(filePath){
	fs.existsSync(filePath) && fs.unlinkSync(filePath);
}
this.file_delete_folder = function(filePath){
	fs.existsSync(filePath) && fs.rmdirSync(filePath);
}

GLang.defaultRuntimeEnvironment.qdSet("file_content_raw", {value:GLang.arrayFun(function(env, args){
	return {value:fileContentRaw(args[0].value)};
}), display:DISPLAY_FUNCTION});
GLang.defaultRuntimeEnvironment.qdSet("file_content_async", {value:GLang.arrayFun(function(env, args){
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
	
	return GLang.voidValue
}), display:DISPLAY_FUNCTION});
GLang.defaultRuntimeEnvironment.qdSet("folder_content_async", {value:GLang.arrayFun(function(env, args){
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
	//fs.realpathSync(args[1].value)
	
	return GLang.voidValue
}), display:DISPLAY_FUNCTION});

this.file_exists = function(filePath){
	return fs.existsSync(filePath);
}
/* Returns if a file is a folder, not a file with contents nor a symbolic link pointing to a folder */
this.file_is_folder_not_link = function(filePath){
	try{
		return fs.lstatSync(filePath).isDirectory();
	}catch(e){
		return false;
	}
}
this.file_is_folder = function(filePath){
	try{
		return fs.lstatSync(fs.realpathSync(filePath)).isDirectory();
	}catch(e){
		return false;
	}
}
this.file_realpath = function(filePath){
	return fs.realpathSync(filePath);
}
this.file_rename_file = function(oldPath, newPath){
	if (fs.existsSync(oldPath)) {
		fs.renameSync(oldPath, newPath);
	}
}
this.file_is_file = function(filePath){
	try{
		return fs.lstatSync(fs.realpathSync(filePath)).isFile();
	}catch(e){
		return false;
	}
}
/* Returns if a file is a file, not a folder nor a symbolic link pointing to a file */
this.file_is_file_not_link = function(filePath){
	try{
		return fs.lstatSync(filePath).isFile();
	}catch(e){
		return false;
	}
}
/* Returns if a file is a symbolic link */
this.file_is_link = function(filePath){
	try{
		return fs.lstatSync(filePath).isSymbolicLink();
	}catch(e){
		return false;
	}
}
