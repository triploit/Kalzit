this.float = function(numberlikeValue){
	var f = parseFloat(numberlikeValue + "");
	if(f !== f || f === null){
		throw new Error("The value " + numberlikeValue + " is not a number and can not be converted to one");
	}
	return f;
}

this.int = function(numberlikeValue){
	var i = parseInt(numberlikeValue + "");
	if(i !== i || i === null){
		throw new Error("The value " + numberlikeValue + " is not a number and can not be converted to one");
	}
	return i;
}