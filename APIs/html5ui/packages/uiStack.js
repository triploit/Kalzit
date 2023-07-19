//Wrap a view so it can be added to a stack view and look correct
function createLayer(value){
	var layer = document.createElement("div");
	
	var child = GLang.displayValue(value);
	if(!child.style.pointerEvents) {
		child.style.pointerEvents = "auto"
	}
	layer.appendChild(child);

	layer.style.width = "100%";
	layer.style.height = "100%";
	layer.style.position = "absolute";
	layer.style.top = 0;
	layer.style.left = 0;
	layer.style.pointerEvents = "none";
	
	return layer
}

GLang.defaultRuntimeEnvironment.qdSet("ui_stack", {value:function(env, args){
	var div = document.createElement("div");
	
	var arr = args[0].value;
	if(!(arr instanceof Array)){
		arr = [args[0]];
	}
	
	for(var i = 0; i < arr.length; i++){
		div.appendChild(createLayer(arr[i]));
	}
	
	div.style.display = "inline-block";
	div.style.position = "relative"
	return {value:div, display:DISPLAY_DOM};
}, display:DISPLAY_FUNCTION});

GLang.defaultRuntimeEnvironment.qdSet("ui_print_into_stack", {value:function(env, args){
	var stack = args[0].value;
	
	return {value:function(env, args) {
		stack.appendChild(createLayer(args[0]));
		return GLang.voidValue;
	}};
}, display:DISPLAY_FUNCTION});

