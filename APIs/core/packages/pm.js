GLang.defaultRuntimeEnvironment.setInnerVariable("pmListRegisteredPackages", {value:function(){
	return GLang.wrapJsToValue(GLang.packageManager.registeredPackages);
}});
GLang.defaultRuntimeEnvironment.setInnerVariable("pmListInstalledNames", {value:function(){
	var result = [];
	for(var entry in GLang.defaultRuntimeEnvironment){
		if(entry.startsWith("kv_"))	result.push(entry.substring(3));
	}
	return GLang.wrapJsToValue(result);
}});