this.flag_on_text_select = function flagOnTextSelect(listener, object){
	
	var lastStart, lastEnd;
	
	function triggerListener(startPos, endPos){
		if(startPos !== lastStart || endPos !== lastEnd){
			lastStart = startPos;
			lastEnd = endPos;
			GLang.callObject({value:listener}, GLang.dr, [GLang.stringValue(object.value.substring(startPos, endPos))])
		}
	}
	
	function markerListener(){
		if (object.selectionStart !== undefined) {
			var startPos = object.selectionStart;
			var endPos = object.selectionEnd;
			if(startPos !== endPos){
				triggerListener(startPos, endPos)
			}
		}
		setTimeout(markerListener, 750);
	}
	
	markerListener();

};
