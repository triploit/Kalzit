(function(){
	function textDom(string) {
		var paragraph = document.createElement("p");
		paragraph.appendChild(document.createTextNode(string));
		return paragraph;
	}

	GLang.displayValue = function displayValue(container){
		var displayType = container.display || DISPLAY_DEFAULT;
		
		switch(displayType) {
			case DISPLAY_STRING: return textDom(container.value)
			case DISPLAY_NONE: return textDom("")
			case DISPLAY_FUNCTION: return textDom("{{function}. void}")
			case DISPLAY_DOM: return container.value;
			case DISPLAY_MUTABLE: return textDom("mutable: " + container.value.mutable);
			case DISPLAY_IMPORTED_DOM: return document.importNode(container.value, true);

			default:
				var val = x.value;
				if(val instanceof Array){
					if(val.length === 0){
						return textDom("()");
					}
					var string = "";
					for(var i = 0; i < val.length; i++){
						string += "[" + GLang.displayValue(val[i]).innerHTML + "]";
						if(i < val.length - 1){
							string += "; "
						}
					}
					return textDom(string);
				}
				return textDom(JSON.stringify(val));
		}
	};
})();