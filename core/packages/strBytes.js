this.strBytes = function(string){
	var chars = [];
	for (var i = 0; i < string.length; ++i) {
		var code = string.charCodeAt(i);
		chars = chars.concat([code & 0xff, code / 256 >>> 0]);
	}
	return chars;
}