function makeFileAccess(file){
	function withFileReader(mainCall, callback){
		var reader = new FileReader();
		reader.onload = function(){
			callback(reader.result);
		};
		reader[mainCall](file);
	}

	return {value:[
		{value:[GLang.stringValue("name"), 
			GLang.stringValue(file.name)
		]},
		{value:[GLang.stringValue("mime"), 
			GLang.stringValue(file.type)
		]},
		{value:[GLang.stringValue("size"), 
			GLang.stringValue(file.size)
		]},
		{value:[GLang.stringValue("textAsync"), {value:function(env, args){
			withFileReader("readAsText", function(result){
				GLang.callObject(args[0], env, [GLang.stringValue(result)]);
			});
			return GLang.voidValue;
		}}]},
		{value:[GLang.stringValue("urlAsync"), {value:function(env, args){
			withFileReader("readAsDataURL", function(result){
				GLang.callObject(args[0], env, [GLang.stringValue(result)]);
			});
			return GLang.voidValue;
		}}]},
		{value:[GLang.stringValue("binaryAsync"), {value:function(env, args){
			withFileReader("readAsBinaryString", function(result){
				GLang.callObject(args[0], env, [{value:result}]);
			});
			return GLang.voidValue;
		}}]},
		{value:[GLang.stringValue("uploadAsync"), {value:function(env, args){
			var callback = args[0];
			var accessName = args.length == 2 ? (args[1].value + "") : null;
			
			var request = new XMLHttpRequest();
			request.open("POST", "/api/special/upload" + (accessName ? "?accessName=" + encodeURIComponent(accessName) : ""));
			
			request.setRequestHeader("Content-Type", file.type);
			//Add a session header if appropriate
			var session = localStorage.getItem("calcitSession");
			if(session) {
				request.setRequestHeader("kalzit-session", session);
			}
			
			request.onreadystatechange = function(event) {
				if (this.readyState == 4) {
					//Request is done
					GLang.callObject(callback, env, [{value:[
						{
							value: [{value: "code"}, {value:request.status}]
						},
						{
							value: [{value: "text"}, GLang.stringValue(request.responseText)]
						}
					]}])
				}
			};
			
			request.send(file);
			return GLang.voidValue;
		}}]}
	]};
}

function makeDropEventAccess(event){
	var files = [];
	for(var i = 0; i < event.dataTransfer.files.length; i++){
		files.push(makeFileAccess(event.dataTransfer.files[i]));
	}

	return {value:[
		{value:[GLang.stringValue("files"), {
			value:files
		}]},
		{value:[GLang.stringValue("text"), GLang.stringValue(event.dataTransfer.getData("Text"))]}
	]};
}

this.flagOnDrop = function(listener, object){
	object.ondragover = function(event){
		event.preventDefault();
		event.dataTransfer.dropEffect = "copy";
	};
	object.ondrop = function(event){
		event.preventDefault();
		GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, [
			makeDropEventAccess(event)
		]);	
	};
}

GLang.defaultRuntimeEnvironment.setInnerVariable("uiFilePicker", {value:function(env, args){
	var picker = document.createElement("input");
	picker.classList.add("calcitFilePicker");
	picker.type = "file";
	picker.onchange = function(event){
		var files = [];
		for(var i = 0; i < event.target.files.length; i++){
			files.push(makeFileAccess(event.target.files[i]));
		}
		GLang.callObject(args[0], env, [{value:files}]);
	}
	
	return {value:picker, display:"dom"}
}});

GLang.defaultRuntimeEnvironment.setInnerVariable("uiMultiFilePicker", {value:function(env, args){
	var picker = document.createElement("input");
	picker.classList.add("calcitFilePicker");
	picker.type = "file";
	picker.multiple=true;	
	
	picker.onchange = function(event){
		var files = [];
		for(var i = 0; i < event.target.files.length; i++){
			files.push(makeFileAccess(event.target.files[i]));
		}
		GLang.callObject(args[0], env, [{value:files}]);
	}
	
	return {value:picker, display:"dom"}
}});