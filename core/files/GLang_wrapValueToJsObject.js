GLang.wrapValueToJsObject = function(container){
	container = container.value;
	if(Array.isArray(container)){
		const object = {};
		for(var i = 0; i < container.length; i++){
			const PAIR = container[i].value;
			if(PAIR.length === 2 && "string" === typeof PAIR[0].value){
				//Make object
				//We have to check if the property exists already; if it does, we do not override it
				
				//The array access can be done safely, because we are guaranteed to have exactly two items (if statement above)
				var propertyName = PAIR[0].value;
				if(! object.hasOwnProperty(propertyName)) {
					//Define the property
					object[propertyName] = GLang.wrapValueToJsObject(PAIR[1]);
				}
			}else{
				//Return usual array
				return container.map(GLang.wrapValueToJsObject);
			}
		}
		return object;
	}else{
		return container;
	}
}
