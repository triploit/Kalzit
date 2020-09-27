;(function(thiz){
	var hashes = new Map();
	var lastSubApp = null;
	
	function initiate(name){
		if(hashes.has(lastSubApp)){
			GLang.callObject(hashes.get(lastSubApp).close, GLang.defaultRuntimeEnvironment, []);	
		}
		if(hashes.has(name)){
			GLang.callObject(hashes.get(name).open, GLang.defaultRuntimeEnvironment, []);
		}
		lastSubApp = name;
	}
	
	window.onhashchange = function(){
		console.log(hashes);
		var hash = location.hash.replace("#", "");
		switch(hash) {
			case "none":
			case "":
				GLang.eval("!popupAnimateOut");
		}
		initiate(hash);
	}
	
	thiz.openSubApp = function(name) {
		location.hash = name;
	};
	thiz.closeSubApp = function() {
		location.hash = "#none";
	};
	thiz.registerSubApp = function(name, _openAndClose){
		hashes.set(name, {open:_openAndClose[0], close:_openAndClose[1]});
		if(location.hash == "#" + name) location.hash = "none"
	};
	thiz.getCurrentSubApp = function(){
		return location.hash.replace("#", "");	
	};
	
	//Make sure that the sub-app is closed when the user hits escape
	window.addEventListener("keydown", function(event){
		if("Escape" === event.key) {
			location.hash = "#none";
		}
	})
	
})(this);