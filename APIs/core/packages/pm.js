GLang.dr.qdSet("pm_list_registered_packages", {value:function(){
	return GLang.wrapJsToValue(GLang.pm.registeredPackages);
}});
GLang.dr.qdSet("pm_list_installed_names", {value:function(){
	var result = [];
	for(var entry in GLang.dr){
		if(!(entry === "resolveName" || entry === "qdSet")) result.push(entry);
	}
	return GLang.wrapJsToValue(result);
}});
