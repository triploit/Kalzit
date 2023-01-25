/* @kalzit.for url_get_parameter
Takes a URL (partial or complete) and returns a parameter it has.
If the parameter is not present, void is returned.

The function takes the parameter name as the first parameter, and the URL as the second.

Usage example:
```
$test = $test urlGetParameter "https://www.example.com/?test=5".
`test is now "5"`
```
*/
this.urlGetParameter = function(parameterName, url) {
	try{
		if(url.split("?").length !== 2) return null; //No parameters
		
		var vars = url.split("#")[0].split("?")[1].split("&");
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
		return decodeURIComponent(urlParameter);
	}catch(e){return null;}
}
this.urlGetHostName = function(url) {
	try {
		return new URL(url).hostname;
	}catch(e){return null;}
}
this.urlGetOrigin = function(url) {
	try {
		return new URL(url).origin;
	}catch(e){return null;}
}