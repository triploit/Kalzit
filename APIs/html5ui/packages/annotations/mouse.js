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
	object.onmousedown = function(e){
		GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, [
			{value:e.clientX}, {value:e.clientY}
		]);
	}
}
this.flagOnPointerUp = function(listener, object){
	object.onmouseup = function(e){
		GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, [
			{value:e.clientX}, {value:e.clientY}
		]);
	}
}
this.flagOnPointerMove = function(listener, object){
	object.onmousemove = function(e){
		GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, [
			{value:e.clientX}, {value:e.clientY}
		]);
	}
}