;(function(global){

	var fs = require("fs");
	
	//Loads a file by relative path and runs it.
	function loadUrl(url){
		return fs.readFileSync(url, "utf8");
	}
		
	//A package manager implementation for the browser
	GLang.NodePackageManager = function(){
		this.loadUrl = loadUrl;
		
		this.__proto__ = new GLang.PackageManager();
	};
	
})(this);