GLang.scopePrototype = {
	
	notifyVariableChange: function(n){
		if(GLang.disableRuntimeUpdates) return;
		for(var i = 0; i < this.variableUpdateFunctions.length; i++){
			var updater = this.variableUpdateFunctions[i];
			if(updater.varName === n){
				updater.update();
			}
		}
		//GLang.notifyGeneralChange();
	},
	registerVariableListener: function(n, listener){
		this.variableUpdateFunctions.push({varName:this.unifyStringName(n), update:listener});
	},
	resolveUnknownName: "calcit_resolve_unknown",
	resolveName: function(n){
		var unified = this.unifyStringName(n);
		var value = this["kv_" + unified];
		var result = null;
		
		//Resolve the name and put it in "result".
		if(value){
			result = value.varValue;
		}else if(GLang.packageManager.installPackage(unified)){
			result = GLang.defaultRuntimeEnvironment["kv_" + unified].varValue;
		}else{
			throw new Error("You used this non-existent variable: " + n);
		}
		
		if(result == null) {
			//There was a serious problem when the result is undefined now
			throw new Error("Variable resolve about to return null or undefined - this is a serious language implementation problem and should be addressed. Attempted to resolve '" + n + "'");
		}
		
		//This exists to make function call stacks easier to understand
		try{
			result.varName = n;
		} catch (error) {
			console.warn("There was a non-critical problem with adding a variable name to a resolved value: (" + n + ")")
			console.warn(error);	
		}
		
		return result;
	},
	unifyStringName: function(originalName){
		if("string" !== typeof originalName) throw new Error("unifyStringName only accepts strings - " + JSON.stringify(originalName) + " does not fit this rule");
		
		if(originalName === ""){
			return "";
		}
		
		//Try to go with an easy and fast unification method first
		if(
			//Check for an all-upper-case name - if present, make it lower case and return
			originalName.includes("_") || 
			//If the name does contain underscores, do the same thing
			originalName === originalName.toUpperCase()
		){
			return originalName.toLowerCase();	
		}
		
		//Otherwise, expect lower camel case, place a _ in front of every upper case character and make it lower case
		var unifiedName = originalName.replace(
			//All upper-case characters
			/[A-Z]/g,
			//What to do with them
			char => "_" + char.toLowerCase()
		)
		
		//Add an exception for the first letter of the name (remove leading _ if present)
		if (unifiedName.startsWith("_")){
			return unifiedName.slice(1);	
		}else{
			return unifiedName	
		}
	},
	setInnerVariable: function(n, value, allowOverride, type){
		if(!n.match("[a-zA-Z_]+")){
			throw new Error(n + " is not a valid variable name!");
		}
		
		//Look for an existing variable with the given name...
		n = this.unifyStringName(n);
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
			var current = this["kv_" + n];
			if(allowOverride){
				//Check if the variable is typed
				var newValue = value;
				var oldValue = current.varValue;
				if (current.varType) {
					//Apply the type
					newValue = GLang.callObject(current.varType, this, [value]);
					//For debugging: log if the value was changed by the type
					GLang.logTypeHint({
						message:"The following variable was automatically changed by its type",
						oldValue:value,
						newValue:newValue,
						typeName:GLang.getValueVarName(current.varType),
						varName:n
					})
				}
				
				if(oldValue !== newValue){
					//Overwrite its value and finish
					current.varValue = newValue;
					this.notifyVariableChange(n);
				}
				return newValue;
			}else{
				throw new Error("Not allowed to change variable $" + n);
			}
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
		
		var v = value;
		if(type) {
			v = GLang.callObject(type, this, [value], type);
			//For debugging: log if the value was changed by the type
// 			GLang.logTypeHint({
// 				message:"The initial value of this variable was automatically changed by its type",
// 				oldValue:value,
// 				newValue:v,
// 				typeName:GLang.getValueVarName(type),
// 				varName:n
// 			})
		}
		this["kv_" + n] = {varName:n, varValue:v, varType:type};
		this.notifyVariableChange(n);
		return v;
	},
	setInnerWithoutListeners: function(name, value){
		//This should only be (directly) used for things like function parameters, that are not supposed to trigger listeners
		name = this.unifyStringName(name);
		 this["kv_" + name] = {varName: name, varValue: value};
	},
	hasInnerVariable: function(n){
		return this.hasOwnProperty("kv_" + this.unifyStringName(n));	
	}
	
};

//Holds all variables known to the program
GLang.RuntimeEnvironment = function(outer){
	//For debugging: test if this is called as a constructor
	if(!this instanceof GLang.RuntimeEnvironment) throw new Error("GLang.RuntimeEnvironment not called with 'new' keyword");

	var me = Object.create(outer || GLang.scopePrototype);
	me.variableUpdateFunctions = [];
	return me;
}