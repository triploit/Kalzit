GLang.dr.qdSet("disk_space_native_async", {value:function(env, args){
	var callback = args[0];
	var disk = args[1].value;
	
	require("diskspace").check(disk, (error, status) => {
		if(!status.status === "READY") {
			console.log("Disk space check not ready! Cancel.");
			return;
		}
		
		GLang.callObject(callback, env, [{value:[
			{value:[GLang.stringValue("total"), {value: status.total}]},
			{value:[GLang.stringValue("free"), {value: status.free}]},
			{value:[GLang.stringValue("used"), {value: status.used}]}
		]}]);
	});
	
	return GLang.voidValue;
}})
