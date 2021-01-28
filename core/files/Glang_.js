//Polyfills
;String.prototype.startsWith = String.prototype.startsWith || function(start){
	return this.lastIndexOf(start, 0) === 0
};
Array.prototype.includes = Array.prototype.includes || function(needle){
	return this.indexOf(needle) >= 0
};

this.GLang={
	returnFalse: function(){return false;}
};
this.KNI = this.KNI || {
	//KNI polyfill
	hasStorage: GLang.returnFalse,
	hasSynchronousLoader: GLang.returnFalse,
	hasAsynchronousLoader: GLang.returnFalse,
	isDefault: true
};