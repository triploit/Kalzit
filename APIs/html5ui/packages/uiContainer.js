GLang.defaultRuntimeEnvironment.setInnerVariable("uiContainer", {value:function(env, args){
	var div = document.createElement("div");
	
	var arr = args[0].value;
	if(!(arr instanceof Array)){
		arr = [args[0]];
	}
	
    var frag = document.createDocumentFragment();
	for(var i = 0; i < arr.length; i++){
		frag.appendChild(GLang.displayValue(arr[i]));
	}
	
    div.appendChild(frag);
	return {value:div, display:"dom"};
}, display:"function"});
GLang.defaultRuntimeEnvironment.setInnerVariable("uiElementCollection", {value:function(env, args){
	var frag = document.createDocumentFragment();
	
	var arr = args[0].value;
	if(!(arr instanceof Array)){
		arr = [args[0]];
	}
	
	for(var i = 0; i < arr.length; i++){
		frag.appendChild(GLang.displayValue(arr[i]));
	}
	
	return {value:frag, display:"dom"};
}, display:"function"});
