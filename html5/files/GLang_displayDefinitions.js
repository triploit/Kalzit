GLang.displayValue = function displayValue(container){
	var displayType = container.display || DISPLAY_DEFAULT;
	
	switch(displayType) {
		case DISPLAY_CODEBLOCK: return GLang.stringDisplay(container, function(x){
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

		case DISPLAY_STRING: return GLang.stringDisplay(container, function(x){
			return x.value;
		})

		case DISPLAY_NONE: return GLang.stringDisplay(container, function(x){
			return "";
		})

		case DISPLAY_FUNCTION: return GLang.stringDisplay(container, function(x){
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

		case DISPLAY_DOM: return container.value;

		case DISPLAY_MUTABLE: return GLang.stringDisplay(container, function(x){
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
