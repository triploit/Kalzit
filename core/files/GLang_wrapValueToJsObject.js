GLang.wrapValueToJsObject = function(container){
	container = container.value;
	if(container instanceof Array){
		var object = {};
		for(var i = 0; i < container.length; i++){
			if(container[i].value.length === 2 && "string" === typeof GLang.at(0, container[i]).value){
				//Make object
				object[GLang.at(0, container[i]).value] = GLang.wrapValueToJsObject(GLang.at(1, container[i]));
			}else{
				//Return usual array
				var array = [];
				for(var i = 0; i < container.length; i++){
					array[i] = GLang.wrapValueToJsObject(container[i]);
				}
				return array
			}
		}
		return object;
	}else{
		return container;
	}
}