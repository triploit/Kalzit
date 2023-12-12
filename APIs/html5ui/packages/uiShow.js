GLang.dr.qdSet("ui_show_variable", {value:function(env, args){
	var mutable = args[0];
    
    //Figure out how to show this value; do we have a custom visualizer function to wrap it?
    var visualizer = null; //Gets called every time the variable changes to produce the thing that is actually shown
    if(args.length === 2) {
        //We have a custom visualizer function
        visualizer = function(kalzitValue) {
            //console.log("WE HAVE A VISUALIZER IN UI_SHOW_VARIABLE")
            return GLang.callObject(args[1], env, [kalzitValue]);
        }
    } else {
        //Use the default visualizer
        visualizer = x => x;
    }
    
	if(mutable.display !== DISPLAY_MUTABLE){throw new Error("uiShowVariable needs a mutable as the first parameter")}
	
	var div = document.createElement("div");
	
	div.appendChild(GLang.displayValue(visualizer(mutable.value.mutable)));
	
	mutable.value.listeners.push({value:function(){
        div.replaceChildren(GLang.displayValue(visualizer(mutable.value.mutable)));
		return GLang.voidValue;
	}})
	
	return {value:div, display:DISPLAY_DOM};
}, display:DISPLAY_FUNCTION});
GLang.dr.qdSet("ui_show_variable_as_list", {value:function(env, args){
	var mutable = args[0];
	if(mutable.display !== DISPLAY_MUTABLE){throw new Error("uiShowVariableAsList needs a mutable as the first parameter")}
	
	var div = document.createElement("div");
	
	var arr = mutable.value.mutable.value;
	for(var i = 0; i < arr.length; i++){
		div.appendChild(GLang.displayValue(arr[i]));
	}
	
	mutable.value.listeners.push({value:function(){
		while (div.firstChild) {
		    div.removeChild(div.firstChild);
		}
		var arr = mutable.value.mutable.value;
		for(var i = 0; i < arr.length; i++){
			div.appendChild(GLang.displayValue(arr[i]));
		}
		return GLang.voidValue;
	}})
	
	return {value:div, display:DISPLAY_DOM};
}, display:DISPLAY_FUNCTION});
