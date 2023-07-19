GLang.defaultRuntimeEnvironment.qdSet("pm_list_registered_packages", {value:function(){
	return GLang.wrapJsToValue(GLang.packageManager.registeredPackages);
}});
GLang.defaultRuntimeEnvironment.qdSet("pm_list_installed_names", {value:function(){
	var result = [];
	for(var entry in GLang.defaultRuntimeEnvironment){
		if(entry.startsWith("kv_"))	result.push(entry.substring(3));
	}
	return GLang.wrapJsToValue(result);
}});
