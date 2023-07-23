GLang.dr.qdSet("ui_container", {value:function(env, args){
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
	return {value:div, display:DISPLAY_DOM};
}, display:DISPLAY_FUNCTION});
GLang.dr.qdSet("ui_element_collection", {value:function(env, args){
	var frag = document.createDocumentFragment();
	
	var arr = args[0].value;
	if(!(arr instanceof Array)){
		arr = [args[0]];
	}
	
	for(var i = 0; i < arr.length; i++){
		frag.appendChild(GLang.displayValue(arr[i]));
	}
	
	return {value:frag, display:DISPLAY_DOM};
}, display:DISPLAY_FUNCTION});

GLang.dr.qdSet("ui_centering_container", {value:function(env, args){
	var div = document.createElement("div");
	div.style.display = "flex";
	div.style.alignItems = "center";
	div.style.justifyContent = "center";
	
	var arr = args[0].value;
	if(!(arr instanceof Array)){
		arr = [args[0]];
	}
	
    var frag = document.createDocumentFragment();
	for(var i = 0; i < arr.length; i++){
		frag.appendChild(GLang.displayValue(arr[i]));
	}
	
    div.appendChild(frag);
	return {value:div, display:DISPLAY_DOM};
}, display:DISPLAY_FUNCTION});
