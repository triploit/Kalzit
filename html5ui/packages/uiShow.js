;(function(){
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowFunction", {value:function(env, args){
		var div = document.createElement("div");
		
		div.appendChild(GLang.displayValue(GLang.callObject(args[0], env, [])));
		
		GLang.registerGeneralListener(function(){
			div.replaceChild(GLang.displayValue(GLang.callObject(args[0], env, [])), div.firstChild);
		})
		
		div.style.display = "inline";
		div.style.width = "100%";
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
		
		div.style.display = "inline-block";
		div.style.width = "100%";
		return {value:div, display:"dom"};
	}, display:"function"});
	
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowVariable", {value:function(env, args){
		var div = document.createElement("div");
		
		div.appendChild(GLang.displayValue(env.resolveName(args[0].value + "")));
		
		env.registerVariableListener(args[0].value, function(){
			div.replaceChild(GLang.displayValue(env.resolveName(args[0].value + "")), div.firstChild);
		})
		
		div.style.display = "inline-block";
		div.style.width = "100%";
		return {value:div, display:"dom"};
	}, display:"function"});
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiShowVariableAsList", {value:function(env, args){
		var div = document.createElement("div");
		
		var arr = env.resolveName(args[0].value + "").value;
		for(var i = 0; i < arr.length; i++){
			div.appendChild(GLang.displayValue(arr[i]));
		}
		
		env.registerVariableListener(args[0].value, function(){
			while (div.firstChild) {
			    div.removeChild(div.firstChild);
			}
			var arr = env.resolveName(args[0].value + "").value;
			for(var i = 0; i < arr.length; i++){
				div.appendChild(GLang.displayValue(arr[i]));
			}
		})
		
		div.style.display = "inline-block";
		div.style.width = "100%";
		return {value:div, display:"dom"};
	}, display:"function"});
})();