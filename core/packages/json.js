this.parseJson = function(jsonString){
	try{
		return JSON.parse(jsonString);
	}catch(e){
		return [];
	}
}