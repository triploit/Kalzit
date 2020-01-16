GLang.defaultRuntimeEnvironment.setInnerVariable("uiContainer", {value:function(env, args){
	var div = document.createElement("div");
	div.classList.add("calcitContainer")
	
	var arr = args[0].value;
	if(!(arr instanceof Array)){
		arr = [args[0]];
	}
	
	for(var i = 0; i < arr.length; i++){
		div.appendChild(GLang.displayValue(arr[i]));
	}
	
	return {value:div, display:"dom"};
}, display:"function"});