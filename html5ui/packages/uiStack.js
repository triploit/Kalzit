GLang.defaultRuntimeEnvironment.setInnerVariable("uiStack", {value:function(env, args){
	var div = document.createElement("div");
	
	var arr = args[0].value;
	if(!(arr instanceof Array)){
		arr = [args[0]];
	}
	
	function createLayer(value){
		var layer = document.createElement("div");
		layer.appendChild(GLang.displayValue(value));
		layer.style.width = "100%";
		layer.style.height = "100%";
		layer.style.position = "absolute";
		layer.style.top = 0;
		layer.style.left = 0;
		
		return layer
	}
	
	for(var i = 0; i < arr.length; i++){
		div.appendChild(createLayer(arr[i]));
	}
	
	div.style.display = "inline-block";
	div.style.position = "relative"
	return {value:div, display:"dom"};
}, display:"function"});