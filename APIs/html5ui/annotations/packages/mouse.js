this.flagOnHover = function(listener, object){
	object.onmouseover = function(){
		GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, []);
	}
}
this.flagOnTap = function(listener, object){
	object.onclick = function(){
		GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, []);
	}
}
this.flagOnPointerDown = function(listener, object){
	object.addEventListener("mousedown", function(e){
		GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, [
			{value:e.pageX}, {value:e.pageY}
		]);
	});
	object.addEventListener("touchstart", function(e){
		var touches = e.changedTouches;
		
		 if (touches.length >= 1) {
		 	var touch = touches[0];
	    	GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, [
				{value:touch.pageX}, {value:touch.pageY}
			]);
		}
	});
}
this.flagOnPointerUp = function(listener, object){
	object.addEventListener("mouseup", function(e){
		GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, [
			{value:e.pageX}, {value:e.pageY}
		]);
	});
	object.addEventListener("touchend", function(e){
		var touches = e.changedTouches;
		
		 if (touches.length >= 1) {
		 	var touch = touches[0];
	    	GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, [
				{value:touch.pageX}, {value:touch.pageY}
			]);
		}
	});
}
this.onGlobalPointerUp = function(listener, object){
	document.body.addEventListener("mouseup", function(e){
		GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, [
			{value:e.pageX}, {value:e.pageY}
		]);
	});
	document.body.addEventListener("touchend", function(e){
		var touches = e.changedTouches;
		
		 if (touches.length >= 1) {
		 	var touch = touches[0];
	    	GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, [
				{value:touch.pageX}, {value:touch.pageY}
			]);
		}
	});
}

this.flagOnPointerMove = function(listener, object){
	object.addEventListener("mousemove", function(e){
		GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, [
			{value:e.pageX}, {value:e.pageY}
		]);
	});
	object.addEventListener("touchmove", function(e){
		var touches = e.changedTouches;
		
		 if (touches.length >= 1) {
		 	var touch = touches[0];
	    	GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, [
				{value:touch.pageX}, {value:touch.pageY}
			]);
		}
	});
}

this.onGlobalPointerMove = function(listener){
	document.body.addEventListener("mousemove", function(e){
		GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, [
			{value:e.pageX}, {value:e.pageY}
		]);
	});
	document.body.addEventListener("touchmove", function(e){
		var touches = e.changedTouches;
		
		 if (touches.length >= 1) {
		 	var touch = touches[0];
	    	GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, [
				{value:touch.pageX}, {value:touch.pageY}
			]);
		}
	});
}