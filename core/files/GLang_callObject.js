(function(){	
	if(GLANG_DEBUG) {
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
		GLang.getSimplifiedCallStack = function() {
			return GLang.callStack.map(callEntry => GLang.getValueVarName(callEntry.obj))
		};
	}

	GLang.call = function(obj, args) {
		//If we have a non-function, quit this as quickly as possible
		if(!("function" === typeof obj.value)) {
			return obj;
		}
		
		//We have a function to call
		//Before doing anything else, add the thing we want to call to the call stack
		if(GLANG_DEBUG) {
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

			if(object.length != 1) {
				console.error(new Error("Kalzit functions should have exactly one parameter (an array of arguments); the old 'env, args' structure is no longer supported. OBJ: " + object));
			}

			result = object(args);
			if (GLANG_DEBUG && result == null) {
				throw new Error("Calling the following function lead to a result of null or undefined: " + object);
			}
			
			if(GLANG_DEBUG) {
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
		}catch(exception){
			//Put a human-readable error on the app, and a detailed log on the console
			GLang.error("E:" + exception);
			
			if(GLANG_DEBUG) {
				GLang.print("(oldest call first, ':' and 'do' excluded)")
				GLang.getSimplifiedCallStack().forEach(callEntry => {
					if(!(callEntry === ":" || callEntry === "do")){
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
			} else {
				return GLang.voidValue;
			}
			
		}
	}

})();
