;(function(global){

	function doStuff(text, disableRuntimeUpdates){
		var allowRuntimeUpdates = disableRuntimeUpdates ? 1 : 0;
		GLang.disableRuntimeUpdates+=allowRuntimeUpdates;
		try{
			var result = GLang.evaluateTree(GLang.generateTree(text), GLang.defaultRuntimeEnvironment);
			GLang.disableRuntimeUpdates-=allowRuntimeUpdates;
			if(GLang.disableRuntimeUpdates < 0){
				GLang.error("GLang.disableRuntimeUpdates is " + GLang.disableRuntimeUpdates)
			}
			return result;
		}catch(e){
			GLang.disableRuntimeUpdates-=allowRuntimeUpdates;
			throw e;
		}
	};
	
	GLang.eval = doStuff;
	GLang.evalV1 = doStuff;
	
	var generalUpdateFunctions = [];
	function notifyGeneralChange(){
		if(GLang.disableRuntimeUpdates) return;
		for(var i = 0; i < generalUpdateFunctions.length; i++){
			generalUpdateFunctions[i]();
		}
	}
	
	function registerGeneralListener(listener){
		generalUpdateFunctions.push(listener);
	}
	
	GLang.notifyGeneralChange = notifyGeneralChange;
	GLang.notifyVariableChange = GLang.defaultRuntimeEnvironment.notifyVariableChange;
	GLang.registerVariableListener = GLang.defaultRuntimeEnvironment.registerVariableListener;
	GLang.registerGeneralListener = registerGeneralListener;
	
	GLang.disableRuntimeUpdates = 0;
	
})(this);