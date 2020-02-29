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
		if(location.hash == "#" + name) initiate(name);
	};
})(this);