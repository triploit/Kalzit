GLang.eval = function (text, disableRuntimeUpdates){
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
		console.error(e);
		throw e;
	}
};

//A function that attempts to produce a human-readability-first, completeness-second string from any value
GLang.stringify = function(anything){
	try{
		return JSON.stringify(anything);
	}catch(error){
		//Something went wrong - try to exclude repeated values
		var seen = [GLang.defaultRuntimeEnvironment];
	
		return JSON.stringify(anything, function(key, val) {
		   if (val != null && typeof val == "object") {
		        if (seen.indexOf(val) >= 0) {
		            return;
		        }
		        seen.push(val);
		    }
		    return val;
		});	
	}
};

(function(){
//	var generalUpdateFunctions = [];
	
// 	GLang.notifyGeneralChange = function (){
// 		console.log("GLang.notifyGeneralChange");
// 		if(GLang.disableRuntimeUpdates) return;
// 		for(var i = 0; i < generalUpdateFunctions.length; i++){
// 			generalUpdateFunctions[i]();
// 		}
// 	};
//	GLang.notifyVariableChange = GLang.defaultRuntimeEnvironment.notifyVariableChange;
//	GLang.registerVariableListener = function(varName, fun){
//		console.warn("GLang.registerVariableListener should not be used anymore - use GLang.defaultRuntimeEnvironment.registerVariableListener instead");
//		GLang.defaultRuntimeEnvironment.registerVariableListener(varName, fun);
//	};
	//GLang.registerGeneralListener = function (listener){generalUpdateFunctions.push(listener)};
	
	GLang.disableRuntimeUpdates = 0;
})();
