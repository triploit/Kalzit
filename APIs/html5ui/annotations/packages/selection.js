/* @kalzit.for flag_on_select
This flag causes a listener to be fired whenever an element is focused, or selected by clicking or tapping on it.
You should not use this function directly - instead, you should add the onSelect-Annotation to an element.
*/
this.flag_on_select = function(listener, object){
	object.onfocus = function(event){
		GLang.callObject({value:listener}, GLang.dr, []);
	}
}

/* @kalzit.for flag_on_select
This flag causes a listener to be fired whenever an element becomes not focused anymore, or deselected by clicking or tapping somewhere else.
You should not use this function directly - instead, you should add the onDeselect-Annotation to an element.
*/
this.flag_on_deselect = function(listener, object){
	object.onblur = function(event){
		GLang.callObject({value:listener}, GLang.dr, []);
	}
}
