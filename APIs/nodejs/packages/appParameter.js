this.app_parameter = function(name){
	name = name.toLowerCase();

	var args = process.argv.slice(2);
	for(var i = 0; i < args.length; i++){
		if(args[i].toLowerCase() === ("--" + name)){
			if(args.length > i + 1){
				return args[i + 1];
			} else {
				return null;	
			}
		}
	}
	
	return null;
}
