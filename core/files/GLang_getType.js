;GLang.getType = function(v){
	if(v.annotations){
		for(var i = 0; i < v.annotations.length; i++){
			if(v.annotations[i].value[0].value === "type"){
				return v.annotations[i].value[1];
			}
		}
	}
};