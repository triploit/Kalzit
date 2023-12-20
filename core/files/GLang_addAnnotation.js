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
