GLang.wrapValueToJsObject = function(container){
	container = container.value;
	if(container instanceof Array){
		var object = {};
		for(var i = 0; i < container.length; i++){
			if(container[i].value.length === 2 && "string" === typeof GLang.at(0, container[i]).value){
				//Make object
				//We have to check if the property exists already; if it does, we do not override it
				var propertyName = GLang.at(0, container[i]).value;
				if(! object.hasOwnProperty(propertyName)) {
					//Define the property
					object[propertyName] = GLang.wrapValueToJsObject(GLang.at(1, container[i]));
				}
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