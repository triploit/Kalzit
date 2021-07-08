GLang.defaultRuntimeEnvironment.setInnerVariable("length", {value:function(env, args){
	var array = args[0];
	var lengthAnnotation = GLang.getFirstAnnotation(array, GLang.stringValue("length"));
	
	if(lengthAnnotation){
		return lengthAnnotation;
	}else if(array.value instanceof Array){
		return {value:array.value.length};
	}else{
		return {value:1};
	}
}});
GLang.defaultRuntimeEnvironment.setInnerVariable("listContains", {value:function(env, args){
	var array = args[1];
	var entry = args[0];
	
	return array.value.some(value => GLang.eq(value.value, entry.value)) ? {value:1} : {value:0}
}});