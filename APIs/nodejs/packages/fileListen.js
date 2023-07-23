var fs = require('fs');

GLang.dr.qdSet("native_file_listen_folder_async", {value:function(env, args){
	var file = args[1].value;
	var callbackValue = args[0];
	var callback = function(eventname, filename){
		GLang.callObject(callbackValue, env, [
			GLang.stringValue(eventname),
			GLang.stringValue(filename)
		]);
	}
	
	//Start listening
	var watcher = fs.watch(file, callback);
	
	return GLang.voidValue;
}});

//The callback gets the name of the file as the first and the name of the event as the second parameter
GLang.dr.qdSet("native_file_listen_file_async", {value:function(env, args){
	var file = args[1].value;
	var callbackValue = args[0];
	var exists = fs.existsSync(file);
	
	var callback = function(eventname, filename){
		if(eventname === "rename") {
			refreshWatcher();
		}
		GLang.callObject(callbackValue, env, [
			GLang.stringValue(eventname)
		]);
	}
	
	function onError(error) {
		console.log(error.message);
		
		//This should deal with all kinds of errors - maybe the file was deleted
		if(exists) {
			//If we are here, the file was deleted - report that event
			callback("delete")
			exists = false;	
		}
		
		refreshWatcher();
	}
	
	//Start listening
	var watcher = fs.watch(file, callback);
	function refreshWatcher(){
		if(watcher != null) {
			watcher.close();
		}
		
		try {
			watcher = fs.watch(file, callback);
			//The file should exist if we get here
			if(!exists) {
				//When we are here, that means that the file was created - report that event
				callback("create");
				exists = true;
			}
			
			//Deal with errors
			watcher.on("error", onError)
		} catch (error) {
			onError(error);	
		}
	}
	refreshWatcher();
	
	
	return GLang.voidValue;
}});
