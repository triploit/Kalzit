;(function(global){
	
	//Function for unifying names - this allows multiple name variations for variables
	function getUnifiedName(varNameItem){
		if(typeof(varNameItem) === "string"){
			return unifyStringName(varNameItem)
		}
		return unifyStringName(GLang.structuresToString(varNameItem));
	}
	
	//Function for unifying names - this allows multiple name variations for variables
	function unifyStringName(originalName){
		if(originalName === ""){
			return "";
		}
		//If it does contain underscores, make all characters lower case and finish
		if(originalName.split("_").length > 1){
			return originalName.toLowerCase();
		}
		//Otherwise, expect lower camel case, place a _ in front of every upper case character and make it lower case
		var unifiedName = originalName[0].toLowerCase();
		for(var i = 1; i < originalName.length; i++){
			//Replace upper case characters with _ followed by the lower case version
			var char = originalName[i];
			unifiedName += char.toLowerCase() !== char ? "_" + char.toLowerCase() : char;
		}
		return unifiedName;
	}
	
	var variableUpdateFunctions = [];
	function notifyVariableChange(n){
		if(GLang.disableRuntimeUpdates) return;
		for(var i = 0; i < variableUpdateFunctions.length; i++){
			var updater = variableUpdateFunctions[i];
			if(updater.varName === n){
				updater.update();
			}
		}
		GLang.notifyGeneralChange();
	}
	
	function registerVariableListener(n, listener){
		variableUpdateFunctions.push({varName:GLang.defaultRuntimeEnvironment.unifyStringName(n), update:listener});
	}

	//Holds all variables known to the program
	global.GLang.RuntimeEnvironment = function(outerEnvironment){
		//Variables in this environment
		this.innerVariables = [];
		//An environment outside of this one (optional)
		this.outerEnvironment = outerEnvironment;
		//Listening functions
		this.notifyVariableChange = notifyVariableChange;
		this.registerVariableListener = registerVariableListener;
		
		//Find a variable by name (a tree structure)
		this.resolveName = function resolveName(varNameItem){
			var varName = getUnifiedName(varNameItem);
			//Loop through the inner variables...
			for(var i = 0; i < this.innerVariables.length; i++){
				var entry = this.innerVariables[i];
				//In order to find a variable with the given name
				if(entry.varName === varName){
					var clone = Object.create(entry.varValue);
					GLang.setAnnotation(clone, {value:[
						GLang.stringValue("accessVarName"),
						GLang.stringValue(varName)
					]});
					return clone;
				}
			}
			//If not found, try to find it in the outer environment
			if(this.outerEnvironment){
				return this.outerEnvironment.resolveName(varNameItem);
			}
			
			//Try to find the wanted variable in a package
			if(GLang.packageManager.installPackage(varName)){
				return this.resolveName(varNameItem);
			}
			//If there really is no variable with the wanted name, ask calcitResolveUnknown for help
			if(varName !== "calcit_resolve_unknown"){
				return GLang.callObject(this.resolveName("calcit_resolve_unknown"), null, [GLang.stringValue(varNameItem)]);
			}else{
				return {value:GLang.voidValue.value, varName:varName}
			}
		};
		
		this.hasInnerVariable = function hasInnerVariable(varName){
			for(var i = 0; i < this.innerVariables.length; i++){
				var entry = this.innerVariables[i];
				//In order to find a variable with the given name
				if(entry.varName === varName){
					return true;
				}
			}
			return false;
		}
		
		//Overwrites or creates inner variables
		this.setInnerVariable = function setInnerVariable(n, value, allowOverride, type){
			if(!n.match("[a-zA-Z_]+")){
				throw new Error(n + " is not a valid variable name!");
			}
			
			//Look for an existing variable with the given name...
			n = unifyStringName(n);
			for(var i = 0; i < this.innerVariables.length; i++){
				var v = this.innerVariables[i];
				if(v.varName === n){
					if(allowOverride && (!v.frozen)){
						var newValue = v.varType ? GLang.callObject(v.varType, this, [value]) : value;
						var oldValue = v.varValue;
						if(oldValue !== newValue){
							//Overwrite its value and finish
							v.varValue = newValue;
							if(oldValue.value !== newValue.value){
								notifyVariableChange(n);
							}
						}
						return;
					}else{
						throw new Error("Not allowed to change variable $" + n + (v.frozen ? " because it is frozen - probably part of a package" : ""));
					}
				}
			}
			//If no existing variable was found, create a new one
			var v = {varName:n, varValue: (type ? GLang.callObject(type, this, [value], type) : value), varType:type};
			if(!(outerEnvironment)){
				GLang.addAnnotation(v.varValue, {value:[
					GLang.stringValue("originalValueOf"),
					GLang.stringValue(n)
				]});
			}
			this.innerVariables.push(v);
			notifyVariableChange(n)
		}
		
		this.freezeInnerVariable = function freezeInnerVariable(n){
			n = unifyStringName(n);
			for(var i = 0; i < this.innerVariables.length; i++){
				var v = this.innerVariables[i];
				if(v.varName === n){
					v.frozen = true;
				}
			}
		}
		
		this.unifyStringName = unifyStringName;
	};
})(this);