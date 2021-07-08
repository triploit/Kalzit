;(function(global){
	function isCollapsed(element){
		return element.classList.contains("k-closed");
	}
	
	function collapse(element){
		element.dispatchEvent(new CustomEvent("k-before_collapse"));
		element.classList.add("k-closable", "k-closed");
		element.style.maxHeight = null;
		element.dispatchEvent(new CustomEvent("k-after_collapse"));
	};
	
	function expand(element){
		element.dispatchEvent(new CustomEvent("k-before_expand"));
		element.classList.remove("k-closed");
		element.style.maxHeight = element.scrollHeight + "px";
		
		setTimeout(() => {
			if(!isCollapsed(element)) element.style.maxHeight = null;
		}, 2000);
		
		element.dispatchEvent(new CustomEvent("k-after_expand"));
	};
	
	/* @kalzit.for ui_toggle_expansion
	Changes the expanded / collapsed state of a UI element.
	If the element was collapsed before it will expand to full height, and if it was expanded it will collapse to a height of zero pixels.
	
	Usage example:
	```
	uiToggleExpansion: yourUiElement
	```
	*/
	global.uiToggleExpansion = function(element){
		if(isCollapsed(element)){
			expand(element);
		}else{
			collapse(element);
		}
	};
	
	/* @kalzit.for ui_expand
	Changes the expanded / collapsed state of a UI element so it gets the height it requires.
	If the element was collapsed before it will expand to full height, otherwise nothing should change.
	
	Usage example:
	```
	uiExpand: yourUiElement
	```
	*/
	global.uiExpand = expand;
	
	/* @kalzit.for ui_collapse
	Changes the expanded / collapsed state of a UI element so it gets a height of zero pixels.
	If the element was expanded it will collapse to a height of zero pixels, otherwise nothing should change.
	
	Usage example:
	```
	uiCollapse: yourUiElement
	```
	*/
	global.uiCollapse = collapse;
	
	/* @kalzit.for ui_is_collapsed
	Returns whether a UI element is collapsed (this state can be changed by uiCollapse or uiToggleExpansion)
	*/
	global.uiIsCollapsed = isCollapsed;
	
	/* @kalzit.for ui_is_expanded
	Returns whether a UI element is expanded (this state can be changed by uiCollapse or uiToggleExpansion)
	*/
	global.uiIsExpanded = function(element){
		return ! isCollapsed(element);
	};
	
	global.flagOnExpand = function(listener, object){
		object.addEventListener("k-before_expand", function(e){
			GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, []);
		});
	}
	global.flagOnCollapse = function(listener, object){
		object.addEventListener("k-before_collapse", function(e){
			GLang.callObject({value:listener}, GLang.defaultRuntimeEnvironment, []);
		});
	}
})(this);