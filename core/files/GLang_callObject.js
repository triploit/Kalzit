GLang.createFunctionScope = function(env, argumentList, args){
	var functionEnvironment = GLang.RuntimeEnvironment(env);
	
		//add arguments to function environment
		argumentList = argumentList.value || [];
		for(var argIndex = 0; argIndex < argumentList.length; argIndex++){
			if("string" !== typeof argumentList[argIndex].value) throw new Error("Every entry of an argument list needs to be a string value - " + JSON.stringify(argumentList[argIndex]) + " does not fit this rule");
			
			var untypedArgument = args.length > argIndex ? args[argIndex] : GLang.voidValue;
			var argumentName = argumentList[argIndex].value;
			var argumentType = GLang.getType(argumentList[argIndex]);
			
			//Check if we need to apply a type to the argument
			var actualArgument = argumentType ? GLang.callObject(argumentType, env, [untypedArgument]) : untypedArgument;
			
			functionEnvironment.setInnerWithoutListeners(
				//Name
				argumentName,
				//Value
				actualArgument
			)
		}
		
		return functionEnvironment
};

//Performance optimized variant of createFunctionScope, specifically for code block environments
GLang.createCodeBlockScope = function(env, args){
	var functionEnvironment = GLang.RuntimeEnvironment(env);
	
//	functionEnvironment.setInnerWithoutListeners("x", args.length > 0 ? args[0] : GLang.voidValue);
//	functionEnvironment.setInnerWithoutListeners("y", args.length > 1 ? args[1] : GLang.voidValue);
	functionEnvironment.kv_x = {varName:"x", varValue:args.length > 0 ? args[0] : GLang.voidValue};
	functionEnvironment.kv_y = {varName:"y", varValue:args.length > 1 ? args[1] : GLang.voidValue};
	
	return functionEnvironment;
};

//This is a stack (push, pop) used to keep track of the currently active function calls
GLang.callStack = [];
GLang.getValueVarName = function(anyValue) {
	try {
		if(anyValue.varName) return anyValue.varName;
		return "unnamed value (JS " + (typeof anyValue.value) + ")";
	} catch (anyError) {
		return "unknown value"	
	}
};
//logConfig has fields oldValue,newValue,typeName,varName,message
GLang.logTypeHint = function(logConfig) {
	if(GLANG_DEBUG && !GLang.eq(logConfig.oldValue.value, logConfig.newValue.value)) {
		console.warn(logConfig.message);
		console.log("The type changed the assigned value from this:");
		console.log(logConfig.oldValue);
		console.log("... to that:");
		console.log(logConfig.newValue);
		console.log("Kalzit call stack:");
		console.log([...GLang.callStack]);
		console.log("This is probably the most important value in that stack (the second-to-last one):");
		console.log(GLang.callStack[GLang.callStack.length - 2].obj);
		console.log("---");
	}
}
GLang.getSimplifiedCallStack = function() {
	return GLang.callStack.map(callEntry => GLang.getValueVarName(callEntry.obj))
};

const GLANG_CALL_STACK_NEEDED = GLANG_DEBUG;

GLang.callObject = function(obj, env, args){
	//If we have a non-function, quit this as quickly as possible
	if(!(obj.display === "codeBlock" || "function" === typeof obj.value)) {
		return obj;
	}
	
	//37752 calls when loading the IDE app (June 16 2023)
	//33414 calls after code block call optimization
	//30002 calls after colon optimization
	//26045 after optimization of common operators
	//console.log("GLang.callObject with real function");
	
	//We have a function to call
	//Before doing anything else, add the thing we want to call to the call stack
	if(GLANG_CALL_STACK_NEEDED) {
		GLang.callStack.push({obj: obj, args: args});
	}
	
	//Check if the value we want to call is deprecated - if yes, warn about that
	if(GLANG_DEBUG && GLang.getFirstAnnotation(obj, GLang.stringValue("deprecated")) != undefined) {
		console.warn("You called a deprecated value: " + (obj.varName || "unnamed value") + ". This is OK, just for you to consider.");
		console.log("Kalzit call stack:");
		console.log([...GLang.callStack]);
		console.log("---");
	}
	
	try{
			//Keep the original parameter untouched
			var object = obj.value;
			
			//Figure out the result of this (function-) call
			var result = null;
			switch(typeof object){
				case "function":
					result = object(env, args);
					if (result == null) {
						throw new Error("Calling the following function lead to a result of null or undefined: " + object);
					}
					break;
				default:
					//Must be a code block (all other options are eliminated at the top of the function)
					if(GLANG_CALL_STACK_NEEDED) {
						//We need to reach the bottom of this function to manage the call stack
						result = object.cb(GLang.createCodeBlockScope(obj.env, args));
					} else {
                    	return object.cb(GLang.createCodeBlockScope(obj.env, args));
					}
			}
			
//			//This is completely unneeded here, since the check has to have happened during the switch statement if we are here
//			//Check if the result is non-null (or non-undefined, hence ==). A null result can lead to problems later
//			if (result == null) {
//				throw new Error("A function call lead to a return value of null or undefined. This probably indicates a problem with the implementation of a JS function - all JS functions written for Kalzit libraries should return GLang.voidValue instead of undefined.");
//			}
			
			if(GLANG_CALL_STACK_NEEDED) {
				//Before returning the result, remove the currently active function from the call stack
				GLang.callStack.pop();
				
				//We attach a variable name to the value for debugging
				//If we are calling the ":" opearator and a name is already present, skip this step
				if(! (result.varName && ":" === GLang.getValueVarName(obj))) {
					//Apparently we should set the varName property
					result.varName = "return-value of " + GLang.getValueVarName(obj);
				}
			}
			return result;
//		}
	}catch(exception){
		//Put a human-readable error on the app, and a detailed log on the console
		GLang.print("Error: " + (exception.message || exception));
		
		if(GLANG_CALL_STACK_NEEDED) {
			GLang.print("(oldest call first, ':' and 'do' excluded)")
			GLang.getSimplifiedCallStack().forEach(callEntry => {
				if(!(callEntry === ":" || callEntry === "do")){
					//If the call entry is interesting, show it
					GLang.error("at " + callEntry)
				}
			});
		}
		
		if(GLANG_DEBUG && GLANG_CALL_STACK_NEEDED) {
			//For console use, it is easier to explore the stack this way
			console.log("JS call stack for console use:");
			console.log(exception);
			console.log("Kalzit call stack for console use:");
			console.log([...GLang.callStack]);
			console.log("This is probably the most important value in that stack (the last one):");
			console.log(GLang.callStack[GLang.callStack.length - 1].obj);
			console.log("---");
		}
		
		if(GLANG_CALL_STACK_NEEDED) {
			//We still have to pop the current call stack entry
			GLang.callStack.pop();
		}
		
		return {value:[], error:exception, callStackCopy:[...GLang.callStack], annotations:[
			{value:[
				GLang.stringValue("error"),
				GLang.stringValue(exception.message)
			]}
		]};
	}
}
