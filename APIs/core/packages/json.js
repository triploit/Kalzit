GLang.defaultRuntimeEnvironment.setInnerVariable("parseJson", {value:function(env, args){
	try{
		return GLang.wrapJsToValue(JSON.parse(args[0].value + ""));
	}catch(e){
		return GLang.voidValue;
	}
}});
GLang.defaultRuntimeEnvironment.setInnerVariable("objToJson", {value:function(env, args){
	return GLang.stringValue(JSON.stringify(GLang.wrapValueToJsObject(args[0])))
}});