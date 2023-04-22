;(function(){
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowVariable", {value:function(env, args){
		var mutable = args[0];
		if(mutable.display !== "mutable"){throw new Error("uiShowVariable needs a mutable as the first parameter")}
		
		var div = document.createElement("div");
		
		div.appendChild(GLang.displayValue(mutable.value.mutable));
		
		mutable.value.listeners.push({value:function(){
			div.replaceChild(GLang.displayValue(mutable.value.mutable), div.firstChild);
		}})
		
		return {value:div, display:"dom"};
	}, display:"function"});
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowVariableAsList", {value:function(env, args){
		var mutable = args[0];
		if(mutable.display !== "mutable"){throw new Error("uiShowVariableAsList needs a mutable as the first parameter")}
		
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
		}})
		
		return {value:div, display:"dom"};
	}, display:"function"});
})();
