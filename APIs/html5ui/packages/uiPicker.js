GLang.dr.qdSet("ui_picker", {value:function(env, args){
	var mutable = args[0];
	if(mutable.display !== DISPLAY_MUTABLE){throw new Error("uiPicker needs a mutable as the first parameter")}
	
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
		mutable.value.set(GLang.stringValue(picker.value));
	}
	
	function onVariableChange(){
		picker.value = mutable.value.mutable.value;
		return GLang.voidValue;
	}
	
	mutable.value.listeners.push({value:onVariableChange});
	
	return {value:picker, display:DISPLAY_DOM}
}});
