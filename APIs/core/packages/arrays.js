GLang.defaultRuntimeEnvironment.qdSet("length", {value:function(env, args){
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
GLang.defaultRuntimeEnvironment.qdSet("list_contains", {value:function(env, args){
	var array = args[1];
	var entry = args[0];
	
	return array.value.some(value => GLang.eq(value.value, entry.value)) ? {value:1} : {value:0}
}});
