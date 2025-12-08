;(function(){
	
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

	/* @kalzit.for repeat_async
	* Repeats a function asynchronously, meaning other code can run between one call and the next..
	* It is repeated until the main app is closed, without any other condition.
	* Usage: repeatAsync: function.
	*/
	GLang.dr.qdSet("repeat_async", {value:repeatAsync, display:DISPLAY_FUNCTION});
})();
