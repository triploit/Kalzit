GLang.scopePrototype = {
	
	notifyVariableChange: function(n){
		if(GLang.disableRuntimeUpdates) return;
		for(var i = 0; i < this.variableUpdateFunctions.length; i++){
			var updater = this.variableUpdateFunctions[i];
			if(updater.varName === n){
				updater.update();
			}
		}
		GLang.notifyGeneralChange();
	},
	registerVariableListener: function(n, listener){
		this.variableUpdateFunctions.push({varName:this.unifyStringName(n), update:listener});
	},
	resolveUnknownName: "calcit_resolve_unknown",
	resolveName: function(n){
		var unified = this.unifyStringName(n);
		var value = this["kv_" + unified];
		
		if(value){
			return value.varValue;
		}else if(GLang.packageManager.installPackage(unified)){
			return GLang.defaultRuntimeEnvironment["kv_" + unified].varValue;
		}else if(unified !== this.resolveUnknownName){
			return GLang.callObject(this.resolveName(this.resolveUnknownName), null, [GLang.stringValue(unified)]);
		}else{
			return {value:GLang.voidValue.value, varName:this.resolveUnknownName}
		}
		
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
		if(this.hasOwnProperty("kv_" + n)){
			var current = this["kv_" + n];
			if(allowOverride){
				var newValue = current.varType ? GLang.callObject(current.varType, this, [value]) : value;
				var oldValue = current.varValue;
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
		var v = {varName:n, varValue: (type ? GLang.callObject(type, this, [value], type) : value), varType:type};
		this["kv_" + n] = v;
		this.notifyVariableChange(n);
		return v.varValue;
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
	var me = Object.create(outer || GLang.scopePrototype);
	me.variableUpdateFunctions = [];
	return me;
}