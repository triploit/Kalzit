var cssIncluded = false;
function includeCss(){
	var style = document.createElement("link");
	style.rel = "stylesheet";
	style.type = "text/css";
	style.href = "/assets/stylesheets/html5/dynamic/columns.css";
	document.head.appendChild(style);
}

this.flagColumns = function(columnCount, object){
	if(columnCount < 0){
		if(!cssIncluded){
			includeCss();
			cssIncluded = true;	
		}
		object.classList.add("calcitDynamic_columns");
	}else{
		object.style.columnCount = columnCount;
	}
}