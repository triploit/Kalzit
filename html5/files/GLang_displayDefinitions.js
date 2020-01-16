;GLang.displayDefinitions = [
	{name:"default", value:GLang.stringDisplay(function(x){
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
	})},
	{name:"string", value:GLang.stringDisplay(function(x){
		return x.value;
	})},
	{name:"variable", value:GLang.stringDisplay(function(x){
		return "$" + x.value;
	})},
	{name:"none", value:GLang.stringDisplay(function(x){
		return "";
	})},
	{name:"function", value:GLang.stringDisplay(function(x){
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
	})},
	{name:"dom", value:function(x){
		return x.value;
	}},
	{name:"reference", value:GLang.stringDisplay(function(x){
		return "reference: $" + x.value;
	})}
];

GLang.flagQueue = [];
setInterval(function(){
	if(GLang.useLazyFlags && GLang.flagQueue.length){
		var len = GLang.flagQueue.length || 5;
		for(var i = 0; i < len; i++){
			GLang.flagQueue.pop()();
		}
	}
}, 100);

GLang.runFlagQueue = function(){
	if(!GLang.useLazyFlags) {
		while(GLang.flagQueue.length){
			GLang.flagQueue.pop()();
		}
	}
}

function makeUiElement(container){
	var displayType = container.display || "default";
	for(var i = 0;  i < GLang.displayDefinitions.length; i++){
		if(GLang.displayDefinitions[i].name === displayType){
			return GLang.displayDefinitions[i].value(container);
		}
	}
}

GLang.useLazyFlags = true;

GLang.displayValue = function displayValue(container){
	if(!GLang.useLazyFlags) return makeUiElement(container);
	
	var flags = GLang.getNamedAnnotations(container, GLang.stringValue("flag"));
	
	//Return a "lazy" ui element and show it when the flags are dealt with
	var placeholder = document.createElement("div");
	placeholder.style.display="inline-block";
	
	GLang.flagQueue.unshift(function(){
		var actualElement = makeUiElement(container)
		try{
			placeholder.parentElement.replaceChild(actualElement, placeholder)
		}catch(error){
			placeholder.appendChild(actualElement)
		}
	});
	GLang.runFlagQueue();
	
	return placeholder;
};