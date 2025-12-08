GLang.dr.qdSet("run_later", {value:function(args){
	setTimeout(function(){
		GLang.call(args[0], []);
	}, args.length == 2 ? args[1].value : 10);
	return GLang.voidValue;
}});
