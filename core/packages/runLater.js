GLang.defaultRuntimeEnvironment.setInnerVariable("runLater", {value:function(env, args){
	setTimeout(function(){
		GLang.callObject(args[0], env, []);
	}, 10);
	return GLang.voidValue;
}});