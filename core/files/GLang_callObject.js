GLang.createFunctionScope = function(env, argumentList, args){
	var functionEnvironment = new GLang.RuntimeEnvironment(env);
	
		//add arguments to function environment
		argumentList = argumentList.value || [];
		for(var argIndex = 0; argIndex < argumentList.length; argIndex++){
			var argument = args.length > argIndex ? args[argIndex] : GLang.voidValue;
			functionEnvironment.innerVariables.push({
				varName:GLang.defaultRuntimeEnvironment.unifyStringName(argumentList[argIndex].value),
				varValue:(GLang.getType(argumentList[argIndex]) ? GLang.callObject(GLang.getType(argumentList[argIndex]), env, [argument]) : argument)
			});
		}
		
		return functionEnvironment
};

GLang.callObject = function(obj, env, args){
	try{
		if(typeof(obj) !== "object"){
			throw new Error("Error! You are probably using some v0 library or function. v1 values have to be 'normal' objects, not functions. Trying to call: " + object);
		}else{
			
			//Keep the original parameter untouched
			var object = obj.value;
			
			if(typeof(object) === "function"){
				var result = object(env, args);
				GLang.setAnnotation(result, {value:[
					GLang.stringValue("producer"),
					obj
				]});
				return result;
			}else if(typeof(object) === "string"){
				obj = GLang.functionFromString(object, obj.environment || env);
				object = obj.value;
			}
			
			//before assuming that "object" is a function object, we should validate this
			var argumentList = GLang.getFirstAnnotation(obj, GLang.stringValue("argumentList"));
			if(!(argumentList && object.code && object.environment)){
				return obj
			}
			
			var functionEnvironment = GLang.createFunctionScope(object.environment, argumentList, args);
			
			if(typeof(object) === "object"){
				//TODO types are not always applied with string-only functions, but they should be
				if(GLang.getType(obj)){
					return GLang.callObject(GLang.getType(obj), env, [GLang.evaluateTree(object.code, functionEnvironment)]);
				}
				return GLang.evaluateTree(object.code, functionEnvironment);
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
		
		throw exception;
	}
}