GLang.defaultRuntimeEnvironment.setInnerVariable("runLater", {value:function(env, args){
	GLang.flagQueue.push(function(){
		GLang.callObject(args[0], env, []);
	});
	GLang.runFlagQueue();
	return GLang.voidValue;
}});