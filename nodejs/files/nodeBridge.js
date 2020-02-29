;(function(global){

	GLang.flagQueue = [];

	var redFormat = '\x1b[1m\x1b[31m%s\x1b[0m';

	GLang.error = function(str){console.log(redFormat, "Error: " + str)};
	GLang.log = GLang.print = console.log;

	//Initialize package manager
	GLang.packageManager = new GLang.NodePackageManager();
	GLang.packageManager.initialize(["core/platform-packages.json", "nodejs/platform-packages.json", "APIs/packagesJs/platform-packages.json", "APIs/packages/platform-packages.json"])
	
})(this);