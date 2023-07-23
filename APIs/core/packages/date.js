GLang.dr.qdSet("get_current_date", {value:function(){
	return {value:new Date().getTime()};
}});
GLang.dr.qdSet("date_to_utc", {value:function(env, args){
	return GLang.stringValue((new Date(args[0].value)).toUTCString());
}});
