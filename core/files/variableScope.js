GLang.scopePrototype = {
	resolveName: function(unified){
		var value = this["kv_" + unified];
		var result = null;
		
		//Resolve the name and put it in "result".
		if(value){
			result = value;
		}else if(GLang.packageManager.installPackage(unified)){
			result = GLang.defaultRuntimeEnvironment["kv_" + unified];
		}else{
			throw new Error("You used this non-existent variable: " + unified);
		}
		
		if(GLANG_DEBUG) {
			if(result == null) {
				//There was a serious problem when the result is undefined now
				throw new Error("Variable resolve about to return null or undefined - this is a serious language implementation problem and should be addressed. Attempted to resolve '" + unified + "'");
			}

			//This exists to make function call stacks easier to understand
			try{
				result.varName = unified;
			} catch (error) {
				console.warn("There was a non-critical problem with adding a variable name to a resolved value: (" + unified + ")")
				console.warn(error);
			}
		}
		
		return result;
	},
	setInnerVariable: function(n, value, unneeded){		
		//Look for an existing variable with the given name...
		
		//For debugging, make sure the name is sort of meaningful
		if (GLANG_DEBUG && n.length <= 1) {
			console.warn("You should probably give this variable a more meaningful name: " + n);
			console.log("Kalzit call stack:");
			console.log([...GLang.callStack]);
			if(GLang.callStack.length) {
				console.log("This is probably the most important value in the stack (the last one):");
				console.log(GLang.callStack[GLang.callStack.length - 1].obj);
			}
			console.log("---");
		}
		
		if(this.hasOwnProperty("kv_" + n)){
			throw new Error("Not allowed to change existing variable $" + n + "; consider using a mutable container");
		}
		
		//If no existing variable was found, create a new one
		//But first, check if it exists somewhere else - there should be a warning
		if(GLANG_DEBUG && (this["kv_" + n] != undefined) ) {
			console.warn("You attempted to define a variable that already exists in a higher scope: " +n);
			console.log("Kalzit call stack:");
			console.log([...GLang.callStack]);
			console.log(new Error("JS call stack:"));
			console.log("This is probably the most important value in that stack (the second-to-last one):");
			console.log(GLang.callStack[GLang.callStack.length - 2].obj);
			console.log("---");
		}
		
		return this["kv_" + n] = value;
	},
	//Quick-and-dirty variable set - set a variable to a value in the fastest way possible, without any safety checks
	qdSet: function(unified, value){
		//This should only be (directly) used for things like function parameters or global variables, that are not supposed to trigger listeners
		this["kv_" + unified] = value;
	},
	hasInnerVariable: function(n){
		return this.hasOwnProperty("kv_" + n);
	}
	
};

//Holds all variables known to the program
GLang.RuntimeEnvironment = function(outer){
	//For debugging: test if this is called as a constructor
	//if(!this instanceof GLang.RuntimeEnvironment) throw new Error("GLang.RuntimeEnvironment not called with 'new' keyword");

	return Object.create(outer || GLang.scopePrototype);
}
