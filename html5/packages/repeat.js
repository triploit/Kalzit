;(function(){
	
	function repeatAsync(env, args){
		function thisGetsRepeated(){
			GLang.callObject(args[1], env, []);
			setTimeout(thisGetsRepeated, args[0].value);
		}
		thisGetsRepeated();
		
		return {value: 0, display: "none"};
	}

	GLang.defaultRuntimeEnvironment.setInnerVariable("repeatAsync", {value:repeatAsync, display:"function"});
})();