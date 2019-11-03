;(function(){
	
	var setTimeout = require("timers").setTimeout;
	
	function repeatAsync(env, args){
		function thisGetsRepeated(){
			GLang.callObject(args[1], env, []);
			setTimeout(thisGetsRepeated, args[0].value);
		}
		thisGetsRepeated();
		
		return {value: 0, display: "none"};
	}
	
	function repeat(env, args){
		while(true){
			GLang.callObject(args[0], env, []);
		}
	}

	GLang.defaultRuntimeEnvironment.setInnerVariable("repeatAsync", {value:repeatAsync, display:"function"});
	GLang.defaultRuntimeEnvironment.setInnerVariable("repeat", {value:repeat, display:"function"});
})();