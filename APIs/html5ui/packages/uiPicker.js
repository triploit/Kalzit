GLang.defaultRuntimeEnvironment.setInnerVariable("uiPicker", {value:function(env, args){
	var varRef = args[0];
	if(varRef.display !== "reference"){throw new Error("uiPicker needs a reference as the first parameter")}
	
	var varEnv = varRef.environment;
	var varName = varRef.value;

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
		varEnv.setInnerVariable(args[0].value, GLang.stringValue(picker.value), true);
	}
	
	function onVariableChange(){
		picker.value = varEnv.resolveName(varName).value;
	}
	
	varEnv.registerVariableListener(varName, onVariableChange);
	
	return {value:picker, display:"dom"}
}});