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
