GLang.defaultRuntimeEnvironment.setInnerVariable("uiTextfieldOnaction", {value:GLang.arrayFun(function(env, args){
	var textfield = document.createElement("input");
	textfield.type="text";
	textfield.value=args[1].value;
	textfield.onkeyup=function(e){
		if(e.key === "Enter"){
			GLang.callObject(args[0], env, [GLang.stringValue(textfield.value)]);
		}
	}
	return {value:textfield, display:"dom"};
})})
GLang.defaultRuntimeEnvironment.setInnerVariable("uiTextfieldOnchange", {value:GLang.arrayFun(function(env, args){
	var textfield = document.createElement("input");
	textfield.type="text";
	textfield.value=args[1].value;
	
	//To make this a bit more efficient, we store the last text content in memory - the change listener should only actually trigger if the text changed
	var lastValue = textfield.value;
	function callback(){
		var newValue = textfield.value;
		if(newValue !== lastValue) {
			//Oh wow, the value is actually different!
			//Trigger the change listener...
			GLang.callObject(args[0], env, [GLang.stringValue(newValue)]);
			//... and update the last known value
			lastValue = newValue;
		}
	}
	
	textfield.addEventListener("change", callback, false);
	textfield.addEventListener("keypress", callback, false);
	textfield.addEventListener("paste", callback, false);
	textfield.addEventListener("input", callback, false);
	
	return {value:textfield, display:"dom"};
})})