GLang.createFunctionScope = function(env, argumentList, args){
	var functionEnvironment = new GLang.RuntimeEnvironment(env);
	
		//add arguments to function environment
		argumentList = argumentList.value || [];
		for(var argIndex = 0; argIndex < argumentList.length; argIndex++){
			if("string" !== typeof argumentList[argIndex].value) throw new Error("Every entry of an argument list needs to be a string value - " + JSON.stringify(argumentList[argIndex]) + " does not fit this rule");
			
			var argument = args.length > argIndex ? args[argIndex] : GLang.voidValue;
			
			functionEnvironment.setInnerWithoutListeners(
				//Name
				argumentList[argIndex].value,
				//Value
				GLang.getType(argumentList[argIndex]) ? GLang.callObject(GLang.getType(argumentList[argIndex]), env, [argument]) : argument
			)
		}
		
		return functionEnvironment
};

GLang.callObject = function(obj, env, args){
	try{
		if(typeof(obj) !== "object"){
			throw new Error("Values have to be 'normal' objects, not functions. Trying to call: " + object);
		}else{
			//Keep the original parameter untouched
			var object = obj.value;
			switch(typeof object){
				case "function": return object(env, args);
				case "string": return GLang.functionFromString(object, obj.environment || env).value(env, args);
				default: return obj;
			}
		}
	}catch(exception){
		GLang.error("Tried to call:");
		GLang.print(obj);
		if(obj.annotations){
			for(var i = 0; i < obj.annotations.length; i++){
				var annotation = obj.annotations[i];
				if(annotation.value.length === 2 && annotation.value[0].value === "comment"){
					GLang.print("# " + annotation.value[1].value);
				}
			}
		}
		
		GLang.print("With parameters:");
		GLang.print(args);
		
		GLang.error(exception);
		GLang.error(exception.message);
		
		return {value:[], error:exception, annotations:[
			{value:[
				GLang.stringValue("error"),
				GLang.stringValue(exception.message)
			]}
		]};
	}
}