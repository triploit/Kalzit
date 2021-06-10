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

//This is a stack (push, pop) used to keep track of the currently active function calls
GLang.callStack = [];
GLang.getSimplifiedCallStack = function() {
	return GLang.callStack.map(callEntry => {
		try {
			if(callEntry.obj.varName) return callEntry.obj.varName;
			return "unnamed value (JS " + (typeof callEntry.obj.value) + ")";
		} catch (anyError) {
			return "unknown value"	
		}
	})
};

GLang.callObject = function(obj, env, args){
	//Before doing anything else, add the thing we want to call to the call stack
	GLang.callStack.push({obj: obj, args: args});
	
	try{
		if(typeof(obj) !== "object"){
			throw new Error("Values have to be 'normal' objects, not functions. Trying to call: " + object);
		}else{
			//Keep the original parameter untouched
			var object = obj.value;
			
			//Figure out the result of this (function-) call
			var result = null;
			switch(typeof object){
				case "function":
					result = object(env, args);
					if (result == null) throw new Error("Calling the following function lead to a result of null or undefined: " + object);
					break;
				case "string":
					result = GLang.functionFromString(object, obj.environment || env).value(env, args); break;
				default:
					result = obj; break;
			}
			
			//Check if the result is non-null (or non-undefined, hence ==). A null result can lead to problems later
			if (result == null) {
				throw new Error("A function call lead to a return value of null or undefined. This probably indicates a problem with the implementation of a JS function - all JS functions written for Kalzit libraries should return GLang.voidValue instead of undefined.");
			}
			
			//Before returning the result, remove the currently active function from the call stack
			GLang.callStack.pop();
			
			result.varName = "return-value of " + (obj.varName ? obj.varName : "unnamed value") +  " (JS " + (typeof obj.value) + ")";
			return result;
		}
	}catch(exception){
		//Put a human-readable error on the app, and a detailed log on the console
		GLang.print("Error: " + (exception.message || exception) + "; (oldest call first, ':' and 'do' excluded)");
		
		GLang.getSimplifiedCallStack().forEach(callEntry => {
			if(!(callEntry === "do" || callEntry === ":")){
				//If the call entry is interesting, show it
				GLang.error("at " + callEntry)
			}
		});
		
		//For console use, it is easier to explore the stack this way
		console.log("JS call stack for console use:");
		console.log(exception);
		console.log("Kalzit call stack for console use:");
		console.log([...GLang.callStack]);
		console.log("This is probably the most important value in that stack (the last one):");
		console.log(GLang.callStack[GLang.callStack.length - 1].obj);
		console.log("---");
		
		//We still have to pop the current call stack entry
		GLang.callStack.pop();
		
		return {value:[], error:exception, callStackCopy:[...GLang.callStack], annotations:[
			{value:[
				GLang.stringValue("error"),
				GLang.stringValue(exception.message)
			]}
		]};
	}
}