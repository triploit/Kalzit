GLang.validateAnnotation = function(annotation){
	if(!(annotation.value instanceof Array && annotation.value.length === 2)){
		throw new Error("An annotation needs to be an array with two values - " + annotation.value + " does not fit this rule");
	}
	if(!(typeof(annotation.value[0].value) === "string")) throw new Error("The first item of an annotation array has to be a string - " + annotation.value[0].value + " does not fit this rule");
}

;GLang.addAnnotation = function(actualValue, annotation){
	GLang.validateAnnotation(annotation);
	actualValue.annotations = (actualValue.annotations || []).concat([annotation]);
	if(annotation.value[0].value === "flag"){
		GLang.flagQueue.push(function(){
			//Automatically apply flag annotations
			GLang.callObject(
				GLang.defaultRuntimeEnvironment.resolveName("applyFlag"),
				GLang.defaultRuntimeEnvironment,
				[actualValue, annotation.value[1]]
			)
		})
		if((!GLang.useLazyFlags) && GLang.runFlagQueue) GLang.runFlagQueue();
	}
};
;GLang.setAnnotation = function(actualValue, annotation){
	GLang.validateAnnotation(annotation)
	actualValue.annotations = actualValue.annotations || [];
	
	for(var i = 0; i < actualValue.annotations.length; i++){
		if(GLang.eq(actualValue.annotations[i].value[0].value, annotation.value[0].value)){
			actualValue.annotations[i] = annotation;
			return;
		}
	}
	
	actualValue.annotations = (actualValue.annotations || []).concat([annotation]);
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