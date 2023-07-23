GLang.dr.qdSet("run_later", {value:function(env, args){
	setTimeout(function(){
		GLang.callObject(args[0], env, []);
	}, args.length == 2 ? args[1].value : 10);
	return GLang.voidValue;
}});
