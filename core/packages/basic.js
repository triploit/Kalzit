GLang.defaultRuntimeEnvironment.setInnerVariable("each", {value:function(env, args){
	return {value:args[1].value.map(
		entry => GLang.callObject(args[0], env, [entry])
	)}
}})
/* @kalzit.for loop_each
A function which does essentially the same as "each", but it does always return void.
Because of this, no return values of the repeated function need to be stored and put into a list, making this function potentially faster.
*/
GLang.defaultRuntimeEnvironment.setInnerVariable("loop_each", {value:function(env, args){
	var array = args[1].value;
	for(var i = 0; i < array.length; i++) {
		GLang.callObject(args[0], env, [array[i]])
	}
	return GLang.voidValue;
}})
GLang.defaultRuntimeEnvironment.setInnerVariable("do", {value:function(env, args){
	var params = [];
	if(args.length >= 2){
		params = args[1].value;
		if(!(params instanceof Array)){
			params = [args[1]];
		}
	}
	return GLang.callObject(args[0], env, params);
}})