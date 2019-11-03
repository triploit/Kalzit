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

GLang.flagQueue = []; var handlerInProgress = false;

GLang.runFlagQueue = function(){
	if(handlerInProgress) return;
	handlerInProgress = true;
	if(GLang.useLazyFlags){
		function asTimeout(){
			if(GLang.flagQueue.length){
				GLang.flagQueue.shift()();
				setTimeout(asTimeout, 0);
			}else{
				handlerInProgress = false;	
			}
		}
		setTimeout(asTimeout, 1);
	}else{
		while(GLang.flagQueue.length){
			GLang.flagQueue.shift()();
		}
		handlerInProgress = false;
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
	var flags = GLang.getNamedAnnotations(container, GLang.stringValue("flag"));
	
	if(flags.length && GLang.useLazyFlags){
		//Return a "lazy" ui element and apply the flags later
		//Automatically apply flag annotations
		var placeholder = document.createElement("div");
		placeholder.style.display="inline-block";
		
		GLang.flagQueue.push(function(){
			for(var i = 0; i < flags.length; i++){
				GLang.callObject(
					GLang.defaultRuntimeEnvironment.resolveName("applyFlag"),
					GLang.defaultRuntimeEnvironment,
					[container, flags[i]]
				);
			}
			
			var actualElement = makeUiElement(container)
			try{
				placeholder.parentElement.replaceChild(actualElement, placeholder)
			}catch(error){
				placeholder.appendChild(actualElement)
			}
		})
		GLang.runFlagQueue();
		
		return placeholder;
	}else{
		GLang.runFlagQueue();
		return makeUiElement(container);
	}
};