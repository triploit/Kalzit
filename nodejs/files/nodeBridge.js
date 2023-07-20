;(function(global){
	var fs = require("fs");
	GLang.flagQueue = [];

	var redFormat = '\x1b[1m\x1b[31m%s\x1b[0m';

	GLang.error = function(str){
		console.error(redFormat, str);
	};
	GLang.log = GLang.print = console.log;

	//Initialize package manager - get the initial packages from nodejs/usable-libraries.json
	GLang.packageManager = new GLang.NodePackageManager();

    var packageList;
    try {
		//JSON.parse will return an array of folder names ...
		packageList = JSON.parse(fs.readFileSync("./nodejs/usable-libraries.json"))
		//... but we need the platform-packages.json files within these folders, so we change the paths
		.map(folderName => folderName + "/platform-packages.json")    
    } catch (error) {
		console.error(error);
        throw new Error("Package manager init failed!");
    }

	GLang.packageManager.initialize(
        packageList
	);
	
})(this);
