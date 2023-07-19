;(function(){
	
	GLang.defaultRuntimeEnvironment.qdSet("ui_show_variable", {value:function(env, args){
		var mutable = args[0];
		if(mutable.display !== DISPLAY_MUTABLE){throw new Error("uiShowVariable needs a mutable as the first parameter")}
		
		var div = document.createElement("div");
		
		div.appendChild(GLang.displayValue(mutable.value.mutable));
		
		mutable.value.listeners.push({value:function(){
			div.replaceChild(GLang.displayValue(mutable.value.mutable), div.firstChild);
			return GLang.voidValue;
		}})
		
		return {value:div, display:DISPLAY_DOM};
	}, display:DISPLAY_FUNCTION});
	GLang.defaultRuntimeEnvironment.qdSet("ui_show_variable_as_list", {value:function(env, args){
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
})();
