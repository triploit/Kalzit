this.assert_or_crash = function(shouldBeOne, errorMessage) {
	if(shouldBeOne !== 1) {
		//We have to produce an error
		if("string" == typeof errorMessage) {
			throw new Error("An assertion failed; " + errorMessage);
		} else {
			throw new Error("An assertion failed");
		}
	}
}

this.crash = function(message) {
	throw new Error(message);
}