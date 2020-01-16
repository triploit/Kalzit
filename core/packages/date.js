GLang.defaultRuntimeEnvironment.setInnerVariable("getCurrentDate", {value:function(){
	return {value:new Date().getTime()};
}});
GLang.defaultRuntimeEnvironment.setInnerVariable("dateToUtc", {value:function(env, args){
	return GLang.stringValue((new Date(args[0].value)).toUTCString());
}});