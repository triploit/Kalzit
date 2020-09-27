this.flagColumns = function(columnCount, object){
	if(columnCount < 0){
		object.classList.add("k-columns");
	}else{
		object.style.columnCount = columnCount;
	}
}