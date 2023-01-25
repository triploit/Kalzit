GLang.defaultRuntimeEnvironment.setInnerVariable("runCommand", {value:function(env, args){
	return GLang.stringValue(require("child_process").execSync(args[0].value + "").toString("UTF8"));
}});
GLang.defaultRuntimeEnvironment.setInnerVariable("runCommandFromArray", {value:function(env, args){
	var array = args[0].value.map(value => value.value + "");
	var command = array[0];
	array.shift(); //array does now contain the command arguments
	return GLang.stringValue(require("child_process").spawnSync(command, array).stdout.toString("UTF8"));
}});
GLang.defaultRuntimeEnvironment.setInnerVariable("runCommandAsync", {value:function(env, args){
	require("child_process").exec(args[1].value + "", (error, stdout, stderr) => {
		if (error) {
			console.log(error);
			GLang.callObject(args[0], env, []);
		}else{
			GLang.callObject(args[0], env, [
				GLang.stringValue(stdout),
				GLang.stringValue(stderr)
			]);
		}
	});
	return GLang.voidValue
}});
GLang.defaultRuntimeEnvironment.setInnerVariable("runCommandRaw", {value:function(env, args){
	return {value:require("child_process").execSync(args[0].value + "")};
}});
GLang.defaultRuntimeEnvironment.setInnerVariable("runCommandAsyncRaw", {value:function(env, args){
	require("child_process").exec(args[1].value + "", {encoding: "buffer"}, (error, stdout, stderr) => {
		if (error) {
			console.log(error);
			GLang.callObject(args[0], env, []);
		}else{
			GLang.callObject(args[0], env, [
				{value:stdout},
				{value:stderr}
			]);
		}
	});
	return GLang.voidValue
}});