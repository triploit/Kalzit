;(function(){
	
	function applyAnnotation(actualValue, annotation, defaultBehavior){
		//Figure out which kind of annotation we have
		//Since 2020-04-08, functions are acceptable annotations as well
		var display = annotation.display;
		if(display === DISPLAY_CODEBLOCK || display === DISPLAY_FUNCTION){
			//We have a function annotation
			GLang.callObject(annotation, GLang.defaultRuntimeEnvironment, [actualValue]);
			return;
		}
		
		//If not a possible function, check for an array of length 2
		if(!(annotation.value instanceof Array && annotation.value.length === 2)){
			//We have an invalid annotation
			throw new Error("An annotation needs to be an array with two values, or a function / code block - " + GLang.stringify(annotation) + " does not fit this rule");
		}
		
		//We have an array annotation
		defaultBehavior(actualValue, annotation);
	}

	GLang.addAnnotation = function(actualValue, annotation){
		applyAnnotation(actualValue, annotation, function(){
			//Behavior for array annotations
			actualValue.annotations = actualValue.annotations || [];
			actualValue.annotations.push(annotation);
		})
	};
	GLang.setAnnotation = function(actualValue, annotation){
		applyAnnotation(actualValue, annotation, function(){
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
	}
})();
