(function(thiz){
	var firstInvalidConversion = true;
	function invalidNumberConversion(numberlikeValue){
		if(firstInvalidConversion){
			var out;
			try{
				if(alert !== undefined) out = alert;
				else out = function(m){console.log("DEBUG: " + m)};	
			}catch (e){
				out = function(m){console.log("DEBUG: " + m)};	
			}
			out("This app attempted to convert an invalid value (" + numberlikeValue + ") to a number internally. This probably indicates a bug in this app and means that it might not work as you would expect. If you see this message again or if the app does something unexpected, please let the developer know about it. This message will not show up again until you reload the page.");
			firstInvalidConversion = false;
		}
		console.error(new Error("The value " + numberlikeValue + " is not a number and can not be converted to one"));
		return 0;
	}

	thiz.float = function(numberlikeValue){
		var f = parseFloat(numberlikeValue + "");
		if(f !== f || f === null){
			return invalidNumberConversion(numberlikeValue);
		}
		return f;
	}
	
	thiz.int = function(numberlikeValue){
		var i = parseInt(numberlikeValue + "");
		if(i !== i || i === null){
			return invalidNumberConversion(numberlikeValue);
		}
		return i;
	}
})(this);