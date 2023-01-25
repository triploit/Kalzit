/* @kalzit.for flag_on_enter
This flag causes a listener to be fired whenever a press of the Enter key is registered by a UI element.
You should not use this function directly - instead, you should add the onEnter-Annotation to an element.
*/
this.flagOnEnter = function(listener, object){
	object.onkeypress = function(event){
		if(event.keyCode === 13){
			GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, []);
		}
	}
}