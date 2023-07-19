this.flag_columns = function(columnCount, object){
	if(columnCount < 0){
		object.classList.add("k-columns");
	}else{
		object.style.width = (100 / columnCount) + "%";
	}
}
