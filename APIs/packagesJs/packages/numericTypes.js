function invalidNumberConversion(numberlikeValue){
		throw new Error("This app attempted to convert an invalid value (" + numberlikeValue + ") to a number internally. This probably indicates a bug in this app and means that it might not work as you would expect. If you see this message again or if the app does something unexpected, please let the developer know about it. This message will not show up again until you reload the page.");
}

/* @kalzit.for float
Converts a number (or a string that represents a number) and returns the floating-point number it represents.

Usage example:
	```
	$a = float: "2.3".		`Produces 2.3`
	$b = float: "10e3"		`Produces 10000`
	```
*/
this.float = function(numberlikeValue){
	var f = parseFloat(numberlikeValue + "");
	if(f !== f || f === null){
		return invalidNumberConversion(numberlikeValue);
	}
	return f;
}

/* @kalzit.for int
Converts a number (or a string that represents a number) and returns the integer number it represents.
If the represented value is floating-point, the decimal part is cut off. So something like 5.6 becomes 5.

Usage example:
	```
	$a = int: "2.3".		`Produces 2`
	$b = int: "10e3"		`Produces 10000`
	```
*/
this.int = function(numberlikeValue){
	var i = parseInt(numberlikeValue + "");
	if(i !== i || i === null){
		return invalidNumberConversion(numberlikeValue);
	}
	return i;
}
