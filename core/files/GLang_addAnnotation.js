;GLang.getAnnotationType = function(annotation){
	//Since 2020-04-08, functions are acceptable annotations as well
	var display = annotation.display;
	if(display === "codeBlock" || display === "function"){
		return "function";
	}
	
	//If not a possible function, check for an array of length 2
	if(!(annotation.value instanceof Array && annotation.value.length === 2)){
		return "invalid";
	}
	return "array"
}

GLang.applyArrayAnnotation = function(actualValue, annotation, defaultBehavior){
	defaultBehavior(actualValue, annotation);
}

GLang.applyAnnotation = function(actualValue, annotation, defaultBehavior){
	switch(GLang.getAnnotationType(annotation)){
		case "function": GLang.callObject(annotation, GLang.defaultRuntimeEnvironment, [actualValue]); break; //Use the annotation as a function
		case "array": defaultBehavior(actualValue, annotation); break;
		default: throw new Error("An annotation needs to be an array with two values, or a function / code block - " + GLang.stringify(annotation) + " does not fit this rule");
	}
}

GLang.addAnnotation = function(actualValue, annotation){
	GLang.applyAnnotation(actualValue, annotation, function(){
		//Behavior for array annotations
		actualValue.annotations = actualValue.annotations || [];
		actualValue.annotations.push(annotation);
	})
};
GLang.setAnnotation = function(actualValue, annotation){
	GLang.applyAnnotation(actualValue, annotation, function(){
		//Behavior for array annotations
		actualValue.annotations = actualValue.annotations || [];
		for(var i = 0; i < actualValue.annotations.length; i++){
			if(GLang.eq(actualValue.annotations[i].value[0].value, annotation.value[0].value)){
				actualValue.annotations[i] = annotation;
				return;
			}
		}
		actualValue.annotations.push(annotation);
	})
};
;GLang.getFirstAnnotation = function(actualValue, annotationKey){
	//actualValue.annotations = actualValue.annotations || [];
	if(!actualValue.annotations) return undefined;
	
	for(var i = 0; i < actualValue.annotations.length; i++){
		if(GLang.eq(actualValue.annotations[i].value[0].value, annotationKey.value)){
			return actualValue.annotations[i].value[1];
		}
	}
};
;GLang.getNamedAnnotations = function(actualValue, annotationKey){
	//actualValue.annotations = actualValue.annotations || [];
	if(!actualValue.annotations) return [];
	
	var list = [];
	for(var i = 0; i < actualValue.annotations.length; i++){
		if(GLang.eq(actualValue.annotations[i].value[0].value, annotationKey.value)){
			list.push(actualValue.annotations[i].value[1]);
		}
	}
	return list
};
