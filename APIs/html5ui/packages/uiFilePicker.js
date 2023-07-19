GLang.defaultRuntimeEnvironment.qdSet("ui_file_picker_content_text_variable", {value:function(env, args){
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
	
	return {value:picker, display:DISPLAY_DOM}
}});

GLang.defaultRuntimeEnvironment.qdSet("ui_file_picker_content_url_variable", {value:function(env, args){
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
	
	return {value:picker, display:DISPLAY_DOM}
}});
