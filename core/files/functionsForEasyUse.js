if(GLANG_TREE_GENERATOR_INCLUDED) {
	GLang.eval = function (text){
		try{
			return GLang.evaluatePreparedTree(GLang.prepareTree(GLang.generateTree(text)), GLang.defaultRuntimeEnvironment);
		}catch(e){
			if(GLANG_DEBUG) {
				console.error(e);
			}
			throw e;
		}
	};
}

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
