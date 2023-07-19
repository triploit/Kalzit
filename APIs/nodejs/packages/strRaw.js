GLang.defaultRuntimeEnvironment.qdSet("str_raw", {value:GLang.arrayFun(function(env, args){
	return {value:require("buffer").Buffer.from(args[0].value)};
})});
