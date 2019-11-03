GLang.defaultRuntimeEnvironment.setInnerVariable("filter", {value:function(env, args){
	var result = [];;
	for(var i = 0; i < args[1].value.length; i++){
		var entry = args[1].value[i];
		if(GLang.callObject(args[0], env, [entry]).value){
			result.push(entry);
		}
	}
	return {value:result};
}});