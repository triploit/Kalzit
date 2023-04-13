GLang.defaultRuntimeEnvironment.setInnerVariable("each", {value:function(env, args){
    var input = args[1].value;
    var output = [];
	for(var i = 0; i < input.length; i++) {
		output.push(GLang.callObject(args[0], env, [input[i], {value: i}]));
	}
	return {value:output}
}})
/* @kalzit.for loop_each
A function which does essentially the same as "each", but it does always return void.
Because of this, no return values of the repeated function need to be stored and put into a list, making this function potentially faster.
*/
GLang.defaultRuntimeEnvironment.setInnerVariable("loop_each", {value:function(env, args){
	var array = args[1].value;
	for(var i = 0; i < array.length; i++) {
		GLang.callObject(args[0], env, [array[i], {value: i}])
	}
	return GLang.voidValue;
}})

/* @kalzit.for loop_each_async
A function which does essentially the same as "loopEach", but it does it asynchronously. Great for handling large lists without freezing an app.
*/
GLang.defaultRuntimeEnvironment.setInnerVariable("loop_each_async", {value:function(env, args){
	var array = args[1].value;
	var callback = args[0];
	var counter = 0;
	
	function runNext() {
		if(counter < array.length) {
			GLang.callObject(callback, env, [array[counter]]);
			counter++;
			setTimeout(runNext, 0);
		}
	}
	
	//Start the loop
	runNext();
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
