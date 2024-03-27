GLang.dr = Object.create(null);
GLang.dr.resolveName = function(unified){
	const value = this[unified];
	var result = null;
	
	//Resolve the name and put it in "result".
	if(value){
		result = value;
	}else{
        GLang.pm.installPackage(unified);
		result = GLang.dr[unified];
	}
	
	if(GLANG_DEBUG) {
		if(result == null) {
			//There was a serious problem when the result is undefined now
			throw new Error("You used this non-existent variable: " + unified + ". This might be a serious language implementation problem, or maybe you just did not define the variable. Attempted to resolve '" + unified + "'");
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
}

//Quick-and-dirty variable set - set a variable to a value in the fastest way possible, without any safety checks
GLang.dr.qdSet = function(unified, value){
	//This should only be (directly) used for things like function parameters or global variables, that are not supposed to trigger listeners
	this[unified] = value;
}
