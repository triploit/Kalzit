GLang.dr.qdSet("run_command", {value:function(env, args){
	return GLang.stringValue(require("child_process").execSync(args[0].value + "").toString("UTF8"));
}});
GLang.dr.qdSet("run_command_from_array", {value:function(env, args){
	var array = args[0].value.map(value => value.value + "");
	var command = array[0];
	array.shift(); //array does now contain the command arguments
	return GLang.stringValue(require("child_process").spawnSync(command, array).stdout.toString("UTF8"));
}});
GLang.dr.qdSet("run_command_async", {value:function(env, args){
	require("child_process").exec(args[1].value + "", (error, stdout, stderr) => {
		if (error) {
			console.log(error);
			GLang.call(args[0], []);
		}else{
			GLang.call(args[0], [
				GLang.stringValue(stdout),
				GLang.stringValue(stderr)
			]);
		}
	});
	return GLang.voidValue
}});
GLang.dr.qdSet("run_command_raw", {value:function(env, args){
	return {value:require("child_process").execSync(args[0].value + "")};
}});
GLang.dr.qdSet("run_command_async_raw", {value:function(env, args){
	require("child_process").exec(args[1].value + "", {encoding: "buffer"}, (error, stdout, stderr) => {
		if (error) {
			console.log(error);
			GLang.call(args[0], []);
		}else{
			GLang.call(args[0], [
				{value:stdout},
				{value:stderr}
			]);
		}
	});
	return GLang.voidValue
}});
