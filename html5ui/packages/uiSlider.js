;(function(){
	GLang.defaultRuntimeEnvironment.setInnerVariable("uiNativeSlider", {value:function(env, args){
		var varRef = args[0];
		if(varRef.display !== "reference"){throw new Error("listenVariable needs a reference as the first parameter")}
		
		var varEnv = varRef.environment;
		var varName = varRef.value;
		
		var slider = document.createElement("input");
		slider.type = "range";
		
		if(args.length === 1){
			args.push({value:[{value:0}, {value:100}]});
		}
		
		slider.min = args[1].value[0].value;
		slider.max = args[1].value[1].value;
		
		var initialValue = parseInt(varEnv.resolveName(varName).value);
		if(initialValue === initialValue){
			slider.value = initialValue;
		}
		
		slider.oninput = function() {
			varEnv.setInnerVariable(varName, {value:Number.parseInt(slider.value)}, true);
			//setTimeout(function(){GLang.eval(args[0].value)}, 0);
		};
		slider.oninput();
		
		GLang.registerVariableListener(args[0].value, function(){
			slider.value = env.resolveName(args[0].value).value;
		})
		
		return {value:slider, display:"dom"};
	}, display:"function"});
})();