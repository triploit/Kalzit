;(function(global){
	
	//Loads a js file by http (or relative) url and runs it.
	function loadUrl(url){
		// get some kind of XMLHttpRequest
		var xhrObj = new XMLHttpRequest();
		// open and send a synchronous request
		xhrObj.open('GET', url, false);
		xhrObj.send('');
		
		return xhrObj.responseText;
	}
		
	//A package manager implementation for the browser
	GLang.DOMPackageManager = function(){
		this.loadUrl = loadUrl;
		
		this.__proto__ = new GLang.PackageManager();
	};
	
})(this);