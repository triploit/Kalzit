GLang.defaultRuntimeEnvironment.setInnerVariable("listenMutable", {value:GLang.arrayFun(function(env, args){
	var mutable = args[0];
	if(mutable.display !== "mutable"){throw new Error("listenMutable needs a mutable value as the first parameter")}
	
	mutable.value.listeners.push(args[1]);
	
	return {value:0, display:"none"}
}), display:"function"});
