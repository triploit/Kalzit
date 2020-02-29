this.flagColumns = function(columnCount, object){
	if(columnCount < 0){
		object.classList.add("calcitDynamic_columns");
	}else{
		object.style.columnCount = columnCount;
	}
}