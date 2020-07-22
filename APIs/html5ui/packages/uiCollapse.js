;(function(global){
	function isCollapsed(element){
		return element.classList.contains("closed");
	}
	
	function collapse(element){
		element.classList.add("closable", "closed");
		element.style.maxHeight = null;
	};
	
	function expand(element){
		element.classList.remove("closed");
		element.style.maxHeight = element.scrollHeight + "px";
		
		setTimeout(() => {
			if(!isCollapsed(element)) element.style.maxHeight = null;
		}, 2000)
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
})(this);