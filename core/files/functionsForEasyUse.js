GLang.eval = function (text, disableRuntimeUpdates){
	//Remove shebang
	if(text.startsWith("#!")){
		text = text.split("\n").slice(1).join("\n");
	}
	
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

(function(){
	var generalUpdateFunctions = [];
	
	GLang.notifyGeneralChange = function (){
		if(GLang.disableRuntimeUpdates) return;
		for(var i = 0; i < generalUpdateFunctions.length; i++){
			generalUpdateFunctions[i]();
		}
	};
	GLang.notifyVariableChange = GLang.defaultRuntimeEnvironment.notifyVariableChange;
	GLang.registerVariableListener = GLang.defaultRuntimeEnvironment.registerVariableListener;
	GLang.registerGeneralListener = function (listener){generalUpdateFunctions.push(listener)};
	
	GLang.disableRuntimeUpdates = 0;
})();