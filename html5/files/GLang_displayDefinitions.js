;GLang.displayDefinitions = {
	"default": GLang.stringDisplay(function(x){
		var val = x.value;
		if(val instanceof Array){
			if(val.length === 0){
				return "()";
			}
			var string = "";
			for(var i = 0; i < val.length; i++){
				string += "[" + GLang.displayValue(val[i]).innerHTML + "]";
				if(i < val.length - 1){
					string += "; "
				}
			}
			return string;
		}
		return JSON.stringify(val);
	}),
    "codeBlock": GLang.stringDisplay(function(x){
		var val = x.value;
		if(val instanceof Array){
			if(val.length === 0){
				return "()";
			}
			var string = "";
			for(var i = 0; i < val.length; i++){
				string += "[" + GLang.displayValue(val[i]).innerHTML + "]";
				if(i < val.length - 1){
					string += "; "
				}
			}
			return string;
		}
		return JSON.stringify(val);
	}),
	"string": GLang.stringDisplay(function(x){
		return x.value;
	}),
	"variable": GLang.stringDisplay(function(x){
		return "$" + x.value;
	}),
	"none": GLang.stringDisplay(function(x){
		return "";
	}),
	"function": GLang.stringDisplay(function(x){
		var result = x.value.codeString ? "{" + x.value.codeString + "}" : "{{function}. void}";
		if(GLang.getFirstAnnotation(x, GLang.stringValue("argumentList"))){
			var argumentValues = GLang.getFirstAnnotation(x, GLang.stringValue("argumentList")).value;
			var argList = "(";
			for(var i = 0; i < argumentValues.length; i++){
				argList += "$" + (argumentValues[i].value || argumentValues[i])
				if(i < argumentValues.length - 1){
					argList += "; "
				}
			}
			argList += ")";
			result = argList + " fun " + result;
		}
		return result;
	}),
	"dom": function(x){
		return x.value;
	},
	"reference": GLang.stringDisplay(function(x){
		return "reference: $" + x.value;
	})
};

GLang.displayValue = function displayValue(container){
	var displayType = container.display || "default";
	if(GLang.displayDefinitions.hasOwnProperty(displayType)){
		return GLang.displayDefinitions[displayType](container)
	}
};
