;(function(){
	
	GLang.setAnnotation = function(actualValue, annotation){
		//Figure out which kind of annotation we have
		//Since 2020-04-08, functions are acceptable annotations as well
		var display = annotation.display;
		if(display === DISPLAY_FUNCTION){
			//We have a function annotation
            annotation.value(annotation.env, [actualValue]);
			//GLang.callObject(annotation, annotation.env, [actualValue]);
			return;
		}
		
		//If not a possible function, check for an array of length 2
		if(GLANG_DEBUG && !(annotation.value instanceof Array && annotation.value.length === 2)){
			//We have an invalid annotation
			throw new Error("An annotation needs to be an array with two values, or a function - " + GLang.stringify(annotation) + " does not fit this rule");
		}

		//Behavior for array annotations
		actualValue.annotations = actualValue.annotations || [];
		for(var i = 0; i < actualValue.annotations.length; i++){
			if(GLang.eq(actualValue.annotations[i].value[0].value, annotation.value[0].value)){
				actualValue.annotations[i] = annotation;
				return;
			}
		}
		actualValue.annotations.push(annotation);
	};
	
	if(GLANG_DEBUG) {
		GLang.getFirstAnnotation = function(actualValue, annotationKey){
			//actualValue.annotations = actualValue.annotations || [];
			if(!actualValue.annotations) return undefined;
			
			for(var i = 0; i < actualValue.annotations.length; i++){
				if(GLang.eq(actualValue.annotations[i].value[0].value, annotationKey.value)){
					return actualValue.annotations[i].value[1];
				}
			}
		};
	}
})();
