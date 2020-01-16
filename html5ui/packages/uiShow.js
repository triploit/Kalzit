;(function(){
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowFunction", {value:function(env, args){
		var div = document.createElement("div");
		
		div.appendChild(GLang.displayValue(GLang.callObject(args[0], env, [])));
		
		GLang.registerGeneralListener(function(){
			div.replaceChild(GLang.displayValue(GLang.callObject(args[0], env, [])), div.firstChild);
		})
		
		return {value:div, display:"dom"};
	}, display:"function"});
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowFunctionAsList", {value:function(env, args){
		var div = document.createElement("div");
		
		var arr = GLang.callObject(args[0], env, []).value;
		for(var i = 0; i < arr.length; i++){
			div.appendChild(GLang.displayValue(arr[i]));
		}
		
		GLang.registerGeneralListener(function(){
			while (div.firstChild) {
			    div.removeChild(div.firstChild);
			}
			var arr = GLang.callObject(args[0], env, []).value;
			for(var i = 0; i < arr.length; i++){
				div.appendChild(GLang.displayValue(arr[i]));
			}
		})
		
		return {value:div, display:"dom"};
	}, display:"function"});
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowVariable", {value:function(env, args){
		var varRef = args[0];
		if(varRef.display !== "reference"){throw new Error("uiShowVariable needs a reference as the first parameter")}
		
		var varEnv = varRef.environment;
		var varName = varRef.value;
		
		var div = document.createElement("div");
		
		div.appendChild(GLang.displayValue(varEnv.resolveName(varName)));
		
		varEnv.registerVariableListener(args[0].value, function(){
			div.replaceChild(GLang.displayValue(varEnv.resolveName(varName)), div.firstChild);
		})
		
		return {value:div, display:"dom"};
	}, display:"function"});
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowVariableAsList", {value:function(env, args){
		var varRef = args[0];
		if(varRef.display !== "reference"){throw new Error("uiShowVariableAsList needs a reference as the first parameter")}
		
		var varEnv = varRef.environment;
		var varName = varRef.value;
		
		var div = document.createElement("div");
		
		var arr = varEnv.resolveName(varName).value;
		for(var i = 0; i < arr.length; i++){
			div.appendChild(GLang.displayValue(arr[i]));
		}
		
		varEnv.registerVariableListener(varName, function(){
			while (div.firstChild) {
			    div.removeChild(div.firstChild);
			}
			var arr = varEnv.resolveName(varName).value;
			for(var i = 0; i < arr.length; i++){
				div.appendChild(GLang.displayValue(arr[i]));
			}
		})
		
		return {value:div, display:"dom"};
	}, display:"function"});
})();