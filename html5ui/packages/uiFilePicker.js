GLang.defaultRuntimeEnvironment.setInnerVariable("uiFilePickerPathVariable", {value:function(env, args){
	var picker = document.createElement("input");
	picker.classList.add("calcitFilePicker");
	picker.type = "file";
	picker.onchange = function(){
		GLang.defaultRuntimeEnvironment.setInnerVariable(args[0].value, GLang.stringValue(picker.value), true);
	}
	
	return {value:picker, display:"dom"}
}});

GLang.defaultRuntimeEnvironment.setInnerVariable("uiFilePickerContentTextVariable", {value:function(env, args){
	var picker = document.createElement("input");
	picker.classList.add("calcitFilePicker");
	picker.type = "file";
	picker.onchange = function(event){
		var reader = new FileReader();
		reader.onload = function(event){
			GLang.defaultRuntimeEnvironment.setInnerVariable(args[0].value, GLang.stringValue(event.target.result), true);
		}
		reader.readAsText(event.target.files[0]);
	}
	
	return {value:picker, display:"dom"}
}});

GLang.defaultRuntimeEnvironment.setInnerVariable("uiFilePickerContentUrlVariable", {value:function(env, args){
	var picker = document.createElement("input");
	picker.classList.add("calcitFilePicker");
	picker.type = "file";
	picker.onchange = function(event){
		var reader = new FileReader();
		reader.onload = function(event){
			GLang.defaultRuntimeEnvironment.setInnerVariable(args[0].value, GLang.stringValue(event.target.result), true);
		}
		reader.readAsDataURL(event.target.files[0]);
	}
	
	return {value:picker, display:"dom"}
}});