//Polyfills
;String.prototype.startsWith = String.prototype.startsWith || function(start){
	return this.lastIndexOf(start, 0) === 0
};
Array.prototype.includes = Array.prototype.includes || function(needle){
	return this.indexOf(needle) >= 0
};

this.GLang={};