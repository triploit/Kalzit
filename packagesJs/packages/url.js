this.urlGetParameter = function(parameterName, url) {
	try{
		if(url.split("?").length !== 2) return null; //No parameters
		
		var vars = url.split("?")[1].split("&");
		for (var i = 0; i < vars.length; i++) {
			var pair = vars[i].split("=");
			if(decodeURIComponent(pair[0]) === parameterName){
				return decodeURIComponent(pair[1]); //Matching parameter found
			}
		}
		return null; //No matching parameter found
	}catch(e){return null;}
}
this.urlEncodeParameter = function(urlParameter){
	try {
		return encodeURIComponent(urlParameter);
	}catch(e){return null;}
}
this.urlDecodeParameter = function(urlParameter){
	try {
		console.log(urlParameter);
		return decodeURIComponent(urlParameter);
	}catch(e){return null;}
}