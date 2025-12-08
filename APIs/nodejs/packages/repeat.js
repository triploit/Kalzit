;(function(){
	
	var setTimeout = require("timers").setTimeout;
	
	function repeatAsync(args){
		var repeat = true;
		var isRunning = true;
		
		function thisGetsRepeated(){
			GLang.call(args[1], []);
			if(repeat){
				setTimeout(thisGetsRepeated, args[0].value);
			}else{
				isRunning = false;	
			}
		}
		thisGetsRepeated();
		
		return GLang.wrapJsToValue({
			exit:function(){repeat = false},
			isRunning:function(){return isRunning}
		});
	}
	
	function repeat(args){
		while(true){
			GLang.call(args[0], []);
		}
	}

	GLang.dr.qdSet("repeat_async", {value:repeatAsync, display:DISPLAY_FUNCTION});
	GLang.dr.qdSet("repeat", {value:repeat, display:DISPLAY_FUNCTION});
})();
