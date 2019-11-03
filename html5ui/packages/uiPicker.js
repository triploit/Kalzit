GLang.defaultRuntimeEnvironment.setInnerVariable("uiPicker", {value:function(env, args){
	var picker = document.createElement("select");
	picker.classList.add("calcitPicker");
	var options = args[1].value;
	for(var i = 0; i < options.length; i++){
		var option = document.createElement("option");
		option.innerHTML = GLang.at(0, options[i]).value;
		option.value = GLang.at(1, options[i]).value;
		picker.appendChild(option);
	}
	picker.onchange = function(){
		GLang.defaultRuntimeEnvironment.setInnerVariable(args[0].value, GLang.stringValue(picker.value), true);
	}
	
	function onVariableChange(){
		picker.value = GLang.eval(args[0].value).value;
	}
	
	GLang.registerVariableListener(args[0].value, onVariableChange);
	
	return {value:picker, display:"dom"}
}});