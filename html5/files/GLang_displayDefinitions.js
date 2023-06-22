GLang.displayValue = function displayValue(container){
	var displayType = container.display || "default";
	
	switch(displayType) {
		case "codeBlock": return GLang.stringDisplay(container, function(x){
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
		})

		case "string": return GLang.stringDisplay(container, function(x){
			return x.value;
		})

		case "variable": return GLang.stringDisplay(container, function(x){
			return "$" + x.value;
		})

		case "none": return GLang.stringDisplay(container, function(x){
			return "";
		})

		case "function": return GLang.stringDisplay(container, function(x){
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
		})

		case "dom": return container.value;

		case "mutable": return GLang.stringDisplay(container, function(x){
			return "mutable: " + x.value.mutable;
		})

		default: return GLang.stringDisplay(container, function(x){
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
		})
	}
};
